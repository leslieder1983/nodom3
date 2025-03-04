import {Module} from "./module";
import { IRenderedDom } from "./types";
import {VirtualDom} from "./virtualdom";
/**
 * css 管理器
 * 针对不同的rule，处理方式不同
 * CssStyleRule 进行保存和替换，同时 scopeInModule(模块作用域)有效
 * CssImportRule 路径不重复添加，因为必须加在stylerule前面，所以需要记录最后的import索引号
 */
export class CssManager{

    /**
     * style sheet
     */
    private static sheet:any;

    /**
     * import url map，用于存储import的url路径
     */
    private static importMap = new Map();

    /**
     * importrule 位置
     */
    private static importIndex = 0;

    /**
     * css class 前置名
     */
    private static cssPreName = '___nodommodule___';
    
    /**
     * 处理style 元素
     * @param module    模块
     * @param dom       虚拟dom
     * @param root      模块root dom
     * @param add       是否添加根模块类名
     * @returns         如果是styledom，则返回true，否则返回false
     */
    public static handleStyleDom(module:Module,dom:IRenderedDom,root:IRenderedDom,add?:boolean):boolean{
        if(dom.tagName.toLowerCase() !== 'style'){
            return false;
        }
        if(add){
            let cls = this.cssPreName + module.id;
            if(root.props['class']){
                root.props['class'] = dom.props['class'] + ' ' + cls;
            }else{
                root.props['class'] = cls;
            }
        }
        return true;
    }

    /**
     * 处理 style 下的文本元素
     * @param module    模块
     * @param dom       style text element
     * @returns         如果是styleTextdom返回true，否则返回false
     */
    public static handleStyleTextDom(module:Module,dom:IRenderedDom):boolean{
        if(dom.parent.tagName.toLowerCase() !== 'style'){
            return false;
        }
        console.log(dom,dom.parent);
        //scope=this，在模块根节点添加 限定 class
        CssManager.addRules(module,dom.textContent,dom.parent.props['scope'] === 'this'?'.' + this.cssPreName + module.id:undefined);
        return true;
    }

    /**
     * 添加多个css rule
     * @param cssText           rule集合 
     * @param module            模块
     * @param scopeName         作用域名(前置选择器)
     */
    public static addRules(module:Module,cssText:string,scopeName?:string){
        //sheet 初始化
        if(!this.sheet){
            //safari不支持 cssstylesheet constructor，用 style代替
            let sheet = document.createElement('style');
            document.head.appendChild(sheet);
            this.sheet = document.styleSheets[0];
        }

        //如果有作用域，则清除作用域下的rule
        if(scopeName){
            this.clearModuleRules(module);
        }

        //是否限定在模块内
        //cssRule 获取正则式  @import
        const reg = /(@[a-zA-Z]+\s+url\(.+?\))|([.#@a-zA-Z]\S*(\s*\S*\s*?)?{)|\}/g;

        //import support url正则式
        const regImp = /@[a-zA-Z]+\s+url/;
        
        // keyframe font page support... 开始 位置
        let startIndex:number=-1;
        // { 个数，遇到 } -1 
        let beginNum:number = 0;
        let re;
        while((re=reg.exec(cssText)) !== null){
            if(regImp.test(re[0])){ //import namespace
                handleImport(re[0]);
            }else if(re[0] === '}'){ //回收括号，单个样式结束判断
                if(startIndex>=0 && --beginNum <= 0){  //style @ end
                    let txt = cssText.substring(startIndex,re.index+1);
                    if(txt[0] === '@'){ //@开头
                        this.sheet.insertRule(txt,CssManager.sheet.cssRules?CssManager.sheet.cssRules.length:0);
                    }else{  //style
                        handleStyle(module,txt,scopeName);
                    }
                    startIndex = -1;
                    beginNum = 0;
                }
            }else{ //style 或 @内部
                if(startIndex === -1){
                    startIndex = re.index;
                    beginNum++;
                }else{
                    beginNum++;
                }
            }
        }
        
        /**
         * 处理style rule
         * @param module         模块
         * @param cssText        css 文本
         * @param scopeName      作用域名(前置选择器)
         * @returns              如果css文本最后一个"{"前没有字符串，则返回void   
         */
        function handleStyle(module:Module,cssText:string,scopeName?:string){
            const reg = /.+(?=\{)/; //匹配字符"{"前出现的所有字符
            let r = reg.exec(cssText);
            if(!r){
                return;
            }
            // 保存样式名，在模块 object manager 中以数组存储
            if(scopeName){
                let arr = module.objectManager.get('$cssRules');
                if(!arr){
                    arr = [];
                    module.objectManager.set('$cssRules',arr);
                }
                arr.push((scopeName + ' ' + r[0]));
                //为样式添加 scope name
                cssText = scopeName + ' ' + cssText;
            }
            //加入到样式表
            CssManager.sheet.insertRule(cssText,CssManager.sheet.cssRules?CssManager.sheet.cssRules.length:0);
        } 

        /**
         * 处理import rule
         * @param cssText   css文本
         * @returns         如果cssText中"()"内有字符串且importMap中存在键值为"()"内字符串的第一个字符，则返回void
         */
        function handleImport(cssText:string){
            const reg = /(?<=\()\S+(?=\))/;
            let r;
            if((r = reg.exec(cssText))!==null){
                if(CssManager.importMap.has(r[0])){
                    return;
                }
                //插入import rule
                CssManager.sheet.insertRule(cssText,CssManager.importIndex++);
                CssManager.importMap.set(r[0],true);
            }
        }
    }

    /**
     * 清除模块css rules
     * @param module  模块
     * @returns       如果模块不存在css rules，则返回void 
     */
    public static clearModuleRules(module:Module){
        let rules = module.objectManager.get('$cssRules');
        if(!rules || rules.length === 0){
            return;
        }
        //从sheet清除
        for(let i=0;i<this.sheet.cssRules.length;i++){
            let r = this.sheet.cssRules[i];
            if(r.selectorText && rules.indexOf(r.selectorText) !== -1){
                this.sheet.deleteRule(i--);
            }
        }

        //置空cache
        module.objectManager.set('$cssRules',[]);
    }
}