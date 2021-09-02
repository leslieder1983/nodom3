import { Compiler } from "./compiler";
import { Element } from "./element";
import { LocalStore } from "./localstore";
import { MethodFactory } from "./methodfactory";
import { Model } from "./model";
import { ModelManager } from "./modelmanager";
import { ModuleFactory } from "./modulefactory";
import { Renderer } from "./renderer";
import { ChangedDom, IModuleCfg } from "./types";
import { Util } from "./util";

/**
 * 模块类
 */
export class Module {
    /**
     * 模块id(全局唯一)
     */
    public id: number;

    /**
     * 模块名(模块内(父模块的子模块之间)唯一)，如果不设置，则系统会自动生成Module+id
     */
    public name: string;

    /**
     * 模型，函数或对象
     */
    public model: any;

    /**
     * 方法集合，函数或对象
     */
    public methods: any;

    /**
     * 子模块，类名数组，函数或数组
     */
    public modules: any;

    /**
     * css样式
     * 函数或数组，如果数组元素为object，则为样式名和键值对，否则为url,url为主页面相对路径
     * [{
     *  '.cls1:{
     *      color:'red',
     *      font-size:'12px'
     *  },
     *  '.cls2':{
     *      ...
     *  }
     * },'css1.css']
     */
    public css: any;

    /**
     * 是否是首次渲染
     */
    private firstRender: boolean = true;

    /**
     * 根虚拟dom
     */
    public virtualDom: Element;

    /**
     * 渲染树
     */
    private renderTree: Element;

    /**
     * 父模块 id
     */
    private parentId: number;

    /**
     * 子模块id数组
     */
    public children: Array<number> = [];

    /**
     * 容器key
     */
    public containerKey: string;

    /**
     * 模块创建时执行操作
     */
    private createOps: Array<Function> = [];

    /**
     * 状态 0 create(创建)、1 init(初始化，已编译)、2 unactive(渲染后被置为非激活) 3 active(激活，可渲染显示)
     */
    public state: number = 0;

    /**
     * 局部存储，用于存放父子模块作用域的订阅
     */
    private localStore: LocalStore;

    /**
     * 数据模型工厂
     */
    public modelManager: ModelManager;

    /**
     * 方法工厂
     */
    public methodFactory: MethodFactory;

    /**
     * 待渲染的虚拟dom数组
     */
    private renderDoms: Array<ChangedDom> = [];

    /**
     * 放置模块的容器
     */
    private container: HTMLElement = null;

    /**
     * 子模块名id映射，如 {模块局部名:模块全局id}，以父子关系形成一个闭环，模块名闭环内唯一
     */
    private moduleMap: Map<string, number> = new Map();

    /**
     * 订阅
     */
    public subscribes: LocalStore;

    /**
     * 从其它模块获取数据项的数据类型
     */
    public dataType: any;

    /**
     * 构造器
     * @param config    模块配置
     */
    constructor(config?: IModuleCfg) {
        this.id = Util.genId();
        // 模块名字
        if (config && config.name) {
            this.name = config.name;
        }
        //获取container，如果有el选择器，则使用选择器获取，否则使用body
        if (config && config.el) {
            this.container = document.querySelector(config.el);
        }

        //加入模块工厂
        ModuleFactory.add(this);
        // 初始化模型工厂
        this.modelManager = new ModelManager(this);
        // 初始化方法工厂
        this.methodFactory = new MethodFactory();

        //主模块，加入渲染队列
        if (ModuleFactory.getMain() === this) {
            Renderer.add(this);
        }
    }

    /**
     * 初始化
     */
    public init() {
        //初始化model
        let data = (typeof this.model === 'function' ? this.model() : this.model);
        this.model = new Model(data || {}, this);

        //调用模版函数，并把this指向model
        let tStr = (typeof this.template === 'function' ? this.template.apply(this.model) : this.template);
        if (!tStr) {
            throw '模版函数需要返回模版串';
        }
        delete this.template;

        //初始化方法
        let methods = (typeof this.methods === 'function' ? this.methods.apply(this.model) : this.methods);
        if (methods && typeof methods === 'object') {
            Object.getOwnPropertyNames(methods).forEach(item => {
                this.methodFactory.add(item, methods[item]);
            });
        }
        delete this.methods;

        //初始化子模块
        let mods = (typeof this.modules === 'function' ? this.modules.apply(this.model) : this.modules);
        if (Array.isArray(mods)) {
            for (let cls of mods) {
                ModuleFactory.getInstance(cls);
            }
        }
        delete this.modules;

        //处理css配置
        this.handleCss();

        // 编译成虚拟dom
        console.time('compile')
        for (let i = 0; i < 10; i++) {
            this.virtualDom = Compiler.compile(tStr);
        }
        console.timeEnd('compile');
    }
    /**
     * 处理css
     */
    private handleCss() {
        let cssArr = (typeof this.css === 'function' ? this.css.apply(this.model) : this.css);
        if (Array.isArray(cssArr) && cssArr.length > 0) {
            //如果不存在stylesheet或最后一个stylesheet是link src，则新建一个style标签
            if (document.styleSheets.length === 0 || document.styleSheets[document.styleSheets.length - 1].href) {
                document.head.appendChild(document.createElement('style'));
            }
            //得到最后一个sheet
            let sheet: CSSStyleSheet = document.styleSheets[document.styleSheets.length - 1];

            for (let css of cssArr) {
                if (typeof css === 'string') {
                    sheet.insertRule("@import '" + css + "'");
                } else if (typeof css === 'object') {
                    for (let p in css) {
                        let style = p + '{';
                        for (let p1 in css[p]) {  //多个样式
                            style += p1 + ':' + css[p][p1] + ';'
                        }
                        style = p + '}';
                        //加入样式表
                        sheet.insertRule(style);
                    }
                }
            }
        }
        delete this.css;
    }

    /**
     * 模版函数
     */
    public template(): string {
        return null;
    }


    /**
     * 模型渲染
     * @return false 渲染失败 true 渲染成功
     */
    public render(): boolean {

        //状态为2，不渲染
        // if (this.state === 2) {
        //     return true;
        // }
        //容器没就位或state不为active则不渲染，返回渲染失败
        // if (this.state !== 3 || !this.virtualDom) {
        //     return false;
        // }
        // console.log(this);
        //克隆新的树
        let root: Element = this.virtualDom.clone();

        if (this.firstRender) {
            this.doFirstRender(root);
        } else { //增量渲染
            //执行每次渲染前事件
            this.doModuleEvent('onBeforeRender');
            if (this.model) {
                root.model = this.model;
                let oldTree = this.renderTree;
                this.renderTree = root;
                //渲染
                root.render(this, null);
                this.clearDontRender(root);
                this.doModuleEvent('onBeforeRenderToHtml');
                let deleteMap = new Map();
                // 比较节点
                root.compare(oldTree, this.renderDoms, deleteMap);
                //刪除和替換
                deleteMap.forEach((value, key) => {
                    let dp: HTMLElement = this.getNode(key);
                    for (let i = value.length - 1; i >= 0; i--) {
                        let index = value[i];
                        if (typeof index == 'string') {
                            let parm = index.split('|');
                            index = parm[0];
                            const vDom: Element = root.query(parm[1]);
                            dp.insertBefore((() => {
                                const el: HTMLElement | SVGElement = vDom.getTmpParam('isSvgNode') ? Util.newSvgEl(vDom.tagName) : Util.newEl(vDom.tagName);
                                //设置属性
                                Util.getOwnProps(vDom.props).forEach(k => el.setAttribute(k, vDom.props[k]));
                                el.setAttribute('key', vDom.key);
                                vDom.handleNEvents(this, el, vDom.parent);
                                vDom.handleAssets(el);
                                return el;
                            })(), dp.childNodes[index++]);
                        }
                        dp.removeChild(dp.childNodes[index]);
                    }
                });
                deleteMap.clear();

                // 渲染
                this.renderDoms.forEach((item) => {
                    item.node.renderToHtml(this, item);
                });
            }
            //执行每次渲染后事件
            this.doModuleEvent('onRender');
        }

        //通知更新数据
        if (this.subscribes) {
            this.subscribes.publish('@data' + this.id, null);
            this.subscribes.publish('@dataTry' + this.id, null);
        }

        let md: Module = this.getParent();
        if (md && md.subscribes !== undefined) {
            md.subscribes.publish('@dataTry' + this.parentId, null);
        }

        //数组还原
        this.renderDoms = [];
        return true;
    }

    /**
     * 执行首次渲染
     * @param root 	根虚拟dom
     */
    private doFirstRender(root: Element) {
        this.doModuleEvent('onBeforeFirstRender');
        //渲染树
        this.renderTree = root;
        if (this.model) {
            root.model = this.model;
        }
        root.render(this, null);
        this.clearDontRender(root);
        this.doModuleEvent('onBeforeFirstRenderToHTML');
        //无容器，不执行
        if (!this.getContainer()) {
            return;
        }
        //清空子元素
        Util.empty(this.container);
        //渲染到html
        root.renderToHtml(this, <ChangedDom>{ type: 'fresh' });
        //删除首次渲染标志
        delete this.firstRender;
        //执行首次渲染后事件
        this.doModuleEvent('onFirstRender');
    }

    /**
     * 克隆模块
     * 共享virtual Dom，但是名字为新名字
     * @param moduleName    新模块名
     */
    clone(moduleName: string): any {
        let me = this;
        let m: Module = Reflect.construct(this.constructor, [{ name: moduleName }]);
        //克隆数据
        if (this.model) {
            let data = Util.clone(this.model, /^\$\S+/);
            m.model = new Model(data, m);
        }
        let excludes = ['id', 'name', 'model', 'virtualDom', 'container', 'containerKey', 'modelManager'];
        Object.getOwnPropertyNames(this).forEach((item) => {
            if (excludes.includes(item)) {
                return;
            }
            m[item] = me[item];
        });
        //克隆虚拟dom树
        m.virtualDom = this.virtualDom.clone(true);
        return m;
    }

    /**
     * 添加引用数据项到本地存储
     */
    public addToLocalStore() {
        if (!this.localStore) {
            this.localStore = new LocalStore();
        }

    }

    /**
     * 数据改变
     * @param model 	改变的model
     */
    public dataChange() {
        Renderer.add(this);
    }

    /**
     * 添加子模块
     * @param moduleId      模块id
     * @param className     类名
     */
    public addChild(moduleId: number) {
        if (!this.children.includes(moduleId)) {
            this.children.push(moduleId);
            let m: Module = ModuleFactory.get(moduleId);
            if (m) {
                m.parentId = this.id;
            }
            //保存name和id映射
            if (m.name) {
                this.moduleMap.set(m.name, moduleId);
            }
        }
    }

    /**
     * 接受消息
     * @param fromName 		来源模块名
     * @param data 			消息内容
     */
    public receive(fromName, data) {
        this.doModuleEvent('onReceive', [fromName, data]);
    }

    /**
     * 激活模块(添加到渲染器)
     */
    public active() {

    }

    /**
     * 取消激活
     */
    public unactive() {
        if (ModuleFactory.getMain() === this || this.state === 2) {
            return;
        }
        this.state = 2;
        //设置首次渲染标志
        this.firstRender = true;
        if (Util.isArray(this.children)) {
            this.children.forEach((item) => {
                let m: Module = ModuleFactory.get(item);
                if (m) {
                    m.unactive();
                }
            });
        }
    }

    /**
     * 模块终结
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

    /*************事件**************/

    /**
     * 执行模块事件
     * @param eventName 	事件名
     * @param param 		参数，为数组
     */
    private doModuleEvent(eventName: string, param?: Array<any>) {
        if (param) {
            param.unshift(this);
        } else {
            param = [this];
        }
        this.invokeMethod(eventName, param);
    }

    /**
     * 添加实例化后操作
     * @param foo  	操作方法
     */
    public addCreateOperation(foo: Function) {
        if (!Util.isFunction(foo)) {
            return;
        }
        if (!this.createOps.includes(foo)) {
            this.createOps.push(foo);
        }
    }

    /**
     * 清理不渲染节点
     * @param dom   节点
     */
    clearDontRender(dom: Element) {
        for (let i = 0; i < dom.children.length; i++) {
            let item = dom.children[i];
            if (item.dontRender) {
                dom.children.splice(i, 1);
                return;
            }
            this.clearDontRender(item);
        }
    }
    /**
     * 获取子孙模块
     * @param name          模块名 
     * @param descendant    如果为false,只在子节点内查找，否则在后代节点查找（深度查询），直到找到第一个名字相同的模块
     */
    public getChild(name: string, descendant?: boolean): Module {
        if (this.moduleMap.has(name)) {
            let mid = this.moduleMap.get(name);
            return ModuleFactory.get(mid);
        } else if (descendant) {
            for (let id of this.children) {
                let m = ModuleFactory.get(id);
                if (m) {
                    let m1 = m.getChild(name, descendant);
                    if (m1) {
                        return m1;
                    }
                }
            }
        }
        return null;
    }

    /**
     * 获取模块方法
     * @param name  方法名
     * @returns     方法
     */
    public getMethod(name: string): Function {
        return this.methodFactory.get(name);
    }

    /**
     * 添加方法
     * @param name  方法名
     * @param foo   方法函数
     */
    public addMethod(name: string, foo: Function) {
        this.methodFactory.add(name, foo);
    }

    /**
     * 移除方法
     * @param name  方法名
     */
    public removeMethod(name: string) {
        this.methodFactory.remove(name);
    }

    /**
     * 获取模块下的html节点
     * @param key       el key值或对象{attrName:attrValue}
     * @param notNull   如果不存在，则返回container
     * @returns         html element
     */
    public getNode(key: string | Object, notNull?: boolean): HTMLElement {
        let keyName: string;
        let value: any;
        if (typeof key === 'string') {  //默认为key值查找
            keyName = 'key';
            value = key;
        } else {  //对象
            keyName = Object.getOwnPropertyNames(key)[0];
            value = key[keyName];
        }
        let qs: string = "[" + keyName + "='" + value + "']";
        let el: HTMLElement = this.container ? this.container.querySelector(qs) : null;
        if (!el && notNull) {
            return this.container;
        }
        return el;
    }

    /**
     * 获取虚拟dom节点
     * @param key               dom key
     * @param fromVirtualDom    是否从源虚拟dom数获取，否则从渲染树获取
     */
    public getElement(key: string | Object, fromVirtualDom?: boolean) {
        let tree = fromVirtualDom ? this.virtualDom : this.renderTree;
        return tree.query(key);
    }

    /**
     * 获取模块容器
     */
    public getContainer(): HTMLElement {
        if (this.containerKey) {
            this.container = document.querySelector("[key='" + this.containerKey + "']");
        }
        return this.container;
    }

    /**
     * 设置首次渲染标志
     * @param flag  首次渲染标志true/false
     */
    public setFirstRender(flag: boolean) {
        this.firstRender = flag;
    }

    /**
     * 调用方法
     * @param methodName    方法名
     * @param args          参数数组
     */
    public invokeMethod(methodName: string, args: any[]) {
        let foo = this.getMethod(methodName);
        if (foo && typeof foo === 'function') {
            return foo.apply(this, args);
        }
    }
}
