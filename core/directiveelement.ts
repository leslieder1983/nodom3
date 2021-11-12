import { VirtualDom } from "./virtualdom";
import { Module } from "./module";
/**
 * 自定义元素
 * 用于扩充定义，主要对ast obj进行前置处理
 */
export class DirectiveElement {
    /**
     * 构造函数
     * @param node 虚拟dom节点
     * @param module 模块
     */
    constructor(node:VirtualDom,module:Module){
        if (node.hasProp('tag')) {
            node.tagName = node.getProp('tag');
            node.delProp('tag');
        } else {
            node.tagName = 'div';
        }
    }
}
