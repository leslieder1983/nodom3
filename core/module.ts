import { NCache } from "./cache";
import { Compiler } from "./compiler";
import { CssManager } from "./cssmanager";
import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { ModuleFactory } from "./modulefactory";
import { ObjectManager } from "./objectmanager";
import { Renderer } from "./renderer";
import { Util } from "./util";
import { DiffTool } from "./difftool";
import { ModelManager } from "./modelmanager";
import { EModuleState } from "./types";

/**
 * 模块类
 * 模块方法说明：模版内使用的方法，包括事件，都直接在模块内定义
 *      方法this：指向module实例
 *      事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)
 *      表达式方法：参数按照表达式方式给定即可
 */
export class Module {
    /**
     * 模块id(全局唯一)
     */
    public id: number;

    /**
     * 模型，代理过的data
     */
    public model:Model;

    /**
     * 子模块类集合，模版中引用的模块类需要声明
     * 如果类已经通过registModule注册过，这里不再需要定义，只需import即可
     */
    public modules: any;

    /**
     * 父模块通过dom节点传递的属性
     */
    public props:any;

    /**
     * 编译后的dom树
     */
    public originTree:VirtualDom;

    /**
     * 渲染树
     */
    public renderTree: VirtualDom;

    /**
     * 父模块 id
     */
    public parentId: number;

    /**
     * 子模块id数组
     */
    public children: Array<number> = [];

    /**
     * 模块状态
     */
    public state: EModuleState;

    /**
     * 放置模块的容器
     */
    private container: HTMLElement;

    /**
     * 后置渲染序列
     */
    private preRenderOps:any[] = [];

    /**
     * 后置渲染序列
     */
    private postRenderOps:any[] = [];

    /**
     * 对象管理器，用于管理虚拟dom节点、指令、表达式、事件对象及其运行时参数
     */
    public objectManager:ObjectManager;

    /**
     * 更改model的map，用于记录增量渲染时更改的model
     */
    public changedModelMap:Map<string,boolean>;

    /**
     * 用于保存每个key对应的html node
     */
    private keyNodeMap:Map<string,Node> = new Map();

    /**
     * 用户自定义key htmlelement映射
     */
    private keyElementMap:Map<string,HTMLElement> = new Map();

    /**
     * key virtualdom map 
     */
    private keyVDomMap:Map<string,VirtualDom> = new Map();

    /**
     * 不允许加入渲染队列标志，在renderdom前设置，避免render前修改数据引发二次渲染
     */
    public dontAddToRender:boolean;

    /**
     * 是否替换容器
     */
    public replaceContainer:boolean;

    /**
     * 来源dom，子模块对应dom
     */
    public srcDom:VirtualDom;

    /**
     * 生成dom时的keyid，每次编译置0
     */
    private domKeyId:number;

    /**
     * 旧模版串
     */
    private oldTemplate:string;

    /**
     * 构造器
     */
    constructor() {
        this.id = Util.genId();
        this.objectManager = new ObjectManager(this);
        this.changedModelMap = new Map();
        //加入模块工厂
        ModuleFactory.add(this);
    }

    /**
     * 初始化
     */
    public init() {
        // 设置状态为初始化
        this.state = EModuleState.INITED;
        //初始化model
        this.model = new Model(this.data()||{} , this);
        //注册子模块
        if(this.modules && Array.isArray(this.modules)){
            for (let cls of this.modules) {
                ModuleFactory.addClass(cls);
            }
            delete this.modules;
        }
    }

    /**
     * 模版串方法，使用时重载
     * @param props     props对象，在模版容器dom中进行配置，从父模块传入
     * @returns         模版串
     */
    public template(props?:any):string{
        return null;
    }

    /**
     * 数据方法，使用时重载
     * @returns      model数据
     */
    public data():any{
        return {};
    }
    
    /**
     * 模型渲染
     */
    public render(): boolean {
        if(this.state === EModuleState.UNACTIVE || !this.container){
            return;
        }
        console.log(this,this.state);
        
        this.dontAddToRender = true;
        //检测模版并编译
        let templateStr = this.template(this.props);
        if(templateStr !== this.oldTemplate){
            this.oldTemplate = templateStr;
            this.compile();
        }
        //不存在，不渲染
        if(!this.originTree){
            return;
        }
        //执行前置方法
        this.doRenderOps(0);
        //渲染前事件返回true，则不进行渲染
        if(this.doModuleEvent('onBeforeRender')){
            this.dontAddToRender = false;
            return;
        }
        
        if (!this.renderTree) {
            this.doFirstRender();
        } else { //增量渲染
            //执行每次渲染前事件
            if (this.model) {
                let oldTree = this.renderTree;
                this.renderTree = Renderer.renderDom(this,this.originTree,this.model);
                this.doModuleEvent('onBeforeRenderToHtml');
                let changeDoms = [];
                // 比较节点
                DiffTool.compare(this.renderTree,oldTree, changeDoms);
                //执行更改
                if(changeDoms.length>0){
                    Renderer.handleChangedDoms(this,changeDoms);
                }
            }
        }
        
        //设置已渲染状态
        this.state = EModuleState.RENDERED;
        //执行后置方法
        this.doRenderOps(1);
        //执行每次渲染后事件
        this.doModuleEvent('onRender');
        this.changedModelMap.clear();
        this.dontAddToRender = false;
    }

    /**
     * 执行首次渲染
     * @param root 	根虚拟dom
     */
    private doFirstRender() {
        this.doModuleEvent('onBeforeFirstRender');
        //渲染树
        this.renderTree = Renderer.renderDom(this,this.originTree,this.model);
        this.doModuleEvent('onBeforeFirstRenderToHTML');
        //渲染为html element
        let el:any = Renderer.renderToHtml(this,this.renderTree,null,true);
        if(this.replaceContainer){ //替换
            Util.replaceNode(this.container,el);
            // 替换后，需要保留
            this.getParent().saveNode(this.container['vdom'],el);
        }else{
            //清空子元素
            Util.empty(this.container);
            this.container.appendChild(el);
        }
        //执行首次渲染后事件
        this.doModuleEvent('onFirstRender');
    }

    /**
     * 添加子模块
     * @param module    模块id或模块
     */
    public addChild(module: number|Module) {
        let mid;
        if(typeof module === 'number'){
            mid = module;
            module = ModuleFactory.get(mid);
        }else{
            mid = module.id;
        }
        if (!this.children.includes(mid)) {
            this.children.push(mid);
            module.parentId = this.id;
            //首次添加，激活
            module.active();
        }
    }

    /**
     * 激活模块(添加到渲染器)
     * @param deep  是否深度active，如果为true，则子模块进行active
     */
    public active(deep?:boolean) {
        this.state = EModuleState.INITED;
        Renderer.add(this);
        if(deep){
            for(let id of this.children){
                let m = ModuleFactory.get(id);
                if(m){
                    m.active(deep);
                }
            }    
        }
    }

    /**
     * 取消激活
     */
    public unactive() {
        if (ModuleFactory.getMain() === this) {
            return;
        }
        this.doModuleEvent('beforeUnActive');
        //设置状态
        this.state = EModuleState.UNACTIVE;
        //从html dom树移除
        if(this.container && this.renderTree){
            let el = this.getNode(this.renderTree.key);
            if(el){
                if(this.replaceContainer){
                    console.log(el,this.container);
                    Util.replaceNode(el,this.container);
                    this.getParent().saveNode(this.container['vdom'],this.container);
                }else{
                    this.container.removeChild(el);
                }
            }
        }
        
        //删除渲染树
        delete this.renderTree;

        // 清理dom key map
        this.keyNodeMap.clear();
        this.keyElementMap.clear();
        this.keyVDomMap.clear();
        //清理缓存
        this.clearCache();
        
        this.doModuleEvent('unActive');
        //处理子模块
        for(let id of this.children){
            let m = ModuleFactory.get(id);
            if(m){
                m.unactive();
            }
        }
    }

    /**
     * 模块销毁
     */
    public destroy() {
        if (Util.isArray(this.children)) {
            this.children.forEach((item) => {
                let m: Module = ModuleFactory.get(item);
                if (m) {
                    m.destroy();
                }
            });
        }
        this.clearCache(true);
        //从工厂释放
        ModuleFactory.remove(this.id);
    }

    /**
     * 获取父模块
     * @returns     父模块   
     */
    public getParent(): Module {
        if (!this.parentId) {
            return;
        }
        return ModuleFactory.get(this.parentId);
    }

    /**
     * 执行模块事件
     * @param eventName 	事件名
     * @returns             执行结果，各事件返回值如下：
     *                          onBeforeRender：如果为true，表示不进行渲染
     */
    private doModuleEvent(eventName: string):boolean{
        return this.invokeMethod(eventName, this.model);
    }

    /**
     * 获取模块方法
     * @param name  方法名
     * @returns     方法
     */
    public getMethod(name: string): Function {
        return this[name];
    }

    /**
     * 设置渲染容器
     * @param el        容器
     * @param replace   渲染时是否直接替换container
     */
    public setContainer(el:HTMLElement,replace?:boolean){
        this.container = el;
        this.replaceContainer = replace;
    }

    /**
     * 调用方法
     * @param methodName    方法名
     */
    public invokeMethod(methodName: string,arg1?:any,arg2?:any,arg3?:any) {
        let foo = this[methodName];
        if (foo && typeof foo === 'function') {
            let args = [];
            for(let i=1;i<arguments.length;i++){
                args.push(arguments[i]);
            }
            return foo.apply(this, args);
        }
    }

    /**
     * 添加渲染方法
     * @param foo   方法函数    
     * @param flag  标志 0:渲染前执行 1:渲染后执行
     * @param args  参数
     * @param once  是否只执行一次，如果为true，则执行后删除
     */
    public addRenderOps(foo:Function,flag:number,args?:any[],once?:boolean){
        if(typeof foo !== 'function'){
            return;
        }
        let arr = flag===0?this.preRenderOps:this.postRenderOps;
        arr.push({
            foo:foo,
            args:args,
            once:once
        });
    }

    /**
     * 执行渲染方法
     * @param flag 类型 0:前置 1:后置
     */
    private doRenderOps(flag:number){
        let arr = flag===0?this.preRenderOps:this.postRenderOps;
        if(arr){
            for(let i=0;i<arr.length;i++){
                let o = arr[i];
                o.foo.apply(this,o.args);
                // 执行后删除
                if(o.once){
                    arr.splice(i--,1);
                }
            }
        }
    }

    /**
     * 设置props
     * @param props     属性值
     * @param dom       子模块对应节点
     */
    public setProps(props:any,dom:VirtualDom){
        let dataObj = props.$data;
        delete props.$data;
        //props数据复制到模块model
        if(dataObj){
            for(let d in dataObj){
                let o = dataObj[d];
                //如果为对象，需要绑定到模块
                if(typeof o === 'object' && this.model[d] !== o){
                    ModelManager.bindToModule(o,this);
                }
                this.model[d] = o;
            }
        }
        this.props = props;
        this.srcDom = dom;
        if(this.state === EModuleState.INITED){
            this.active();
        }else if(this.state !== EModuleState.UNACTIVE){  //计算template，如果导致模版改变，需要激活
            let change = false;
            if(!this.props){
                change = true;
            }else{
                const keys = Object.getOwnPropertyNames(props);
                let len1 = keys.length;
                const keys1 = this.props?Object.getOwnPropertyNames(this.props):[];
                let len2 = keys1.length;
                if(len1 !== len2){
                    change = true;
                }else{
                    for(let k of keys){
                        // object 默认改变
                        if(props[k] !== this.props[k] || typeof(props[k]) === 'object'){
                            change = true;
                            break;
                        }
                    }
                }
            }
            if(change){  //props 发生改变，计算模版，如果模版改变，激活模块
                const tmp = this.template(this.props);
                if(tmp !== this.oldTemplate){
                    this.active();
                }
            }    
        }
    }

    /**
     * 编译
     */
    public compile(){
        this.domKeyId = 0;
        //清空孩子节点
        this.children = [];

        //清除缓存
        this.clearCache();

        //清除dom节点cache
        this.objectManager.clearElements();
        //清理css url
        CssManager.clearModuleRules(this);
        
        if(!this.oldTemplate){
            return;
        }
        this.originTree = new Compiler(this).compile(this.oldTemplate);
        //事件传递
        if(this.srcDom && this.srcDom.events){
            if(!this.originTree.events){
                this.originTree.events = new Map();
            }
            for(let p of this.srcDom.events){
                if(!this.originTree.events.has(p[0])){  //子模块已存在的事件不处理
                    this.originTree.events.set(p[0],p[1]);
                }
            }
        }
    }
    /**
     * 清理缓存
     * @param force 强力清除 
     */
    public clearCache(force?:boolean){
        if(force){ //强力清除，后续不再使用
            this.objectManager.cache = new NCache();
            return;
        }
        //清理指令
        this.objectManager.clearDirectives();
        //清理表达式
        this.objectManager.clearExpressions();
        //清理事件
        this.objectManager.clearEvents();
    }

    /**
     * 获取node
     * @param key   dom key 
     * @returns     html node
     */
    public getNode(key:string):Node{
        return this.keyNodeMap.get(key);
    }

    /**
     * save node
     * @param key   dom key
     * @param node  html node
     */
    public saveNode(key:string,node:Node){
        this.keyNodeMap.set(key,node);
    }

    /**
     * 获取用户key定义的html
     * @param key   用户自定义key
     * @returns     html element
     */
    public getElement(key:string):HTMLElement{
        return this.keyElementMap.get(key);
    }

    /**
     * 保存用户key对应的htmlelement
     * @param key   自定义key
     * @param node  htmlelement
     */
    public saveElement(key:string,node:HTMLElement){
        this.keyElementMap.set(key,node);
    }


    /**
     * 获取key对应的virtual dom
     * @param key   vdom key
     * @returns     virtual dom
     */
    public getVirtualDom(key:string):VirtualDom{
        return this.keyVDomMap.get(key);
    }

    /**
     * 保存key对应的virtual dom
     * @param dom   virtual dom
     * @param key   vdom key
     */
    public saveVirtualDom(dom:VirtualDom,key?:string){
        this.keyVDomMap.set(key || dom.key,dom);
    }

    /**
     * 从keyNodeMap移除
     * @param key   dom key
     * @param deep  深度清理
     */
    public removeNode(key:string,deep?:boolean){
        this.keyNodeMap.delete(key);
        if(deep){
            let dom = this.keyVDomMap.get(key);
            if(dom && dom.children){
                for(let d of dom.children){
                    this.removeNode(d.key,true);
                }    
            }
        }
    }

    /**
     * 移除 dom cache
     * @param key   dom key
     * @param deep  深度清理
     */
    public clearDomCache(dom:VirtualDom,deep?:boolean){
        if(deep){
            if(dom.children){
                for(let d of dom.children){
                    this.clearDomCache(d,true);
                }
            }
        }
        //从缓存移除节点
        this.objectManager.removeElement(dom.key);
        // this.objectManager.clearElementParams(dom.key);
        //从key node map移除
        this.keyNodeMap.delete(dom.key);
        //从virtual dom map移除
        this.keyVDomMap.delete(dom.key);
    }

    /**
     * 获取dom key id
     * @returns     key id
     */
    public getDomKeyId():number{
        return ++this.domKeyId;
    }
}
