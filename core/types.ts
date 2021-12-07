import { Module } from "./module";
import { Route } from "./route";

/**
 * 应用初始化配置类型
 */
/**
 * 路由配置
 */
export interface IRouteCfg {
    /**
     * 路由路径，可以带通配符*，可以带参数 /:
     */
    path?: string;
    
    /**
     * 路由对应模块对象或类或模块类名
     */
    module?:any;

    /**
     * 模块路径，当module为类名时需要，默认执行延迟加载
     */
    modulePath?:string;
    /**
     * 子路由数组
     */
    routes?: Array<IRouteCfg>;

    /**
     * 进入路由事件方法
     */
    onEnter?: Function;
    /**
     * 离开路由方法
     */
    onLeave?: Function;
    
    /**
     * 父路由
     */
    parent?: Route;
}

/**
 * 模块状态类型
 */
export enum EModuleState {
    INITED = 1,
    UNACTIVE=2,
    RENDERED=4
}

