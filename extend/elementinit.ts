import { DefineElement } from "../core/defineelement";
import { DefineElementManager } from "../core/defineelementmanager";
import { NError } from "../core/error";
import { NodomMessage } from "../core/nodom";
import { VirtualDom } from "../core/virtualdom";
import { Directive } from "../core/directive";
import { Module } from "../core/module";
import { GlobalCache } from "../core/globalcache";

/**
 * module 元素
 */
class MODULE extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //类名
        let clazz = node.getProp('name');
        if (!clazz) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'MODULE', 'className');
        }
        node.delProp('name');
        node.addDirective(new Directive('module',clazz));
    }
}

/**
 * for 元素
 * 描述：用于重复生成多个同类型节点
 */
class FOR extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'FOR', 'cond');
        }
        node.delProp('cond');
        // if(typeof cond === 'number'){ //表达式
        //     cond = GlobalCache.getExpression(cond);
        // }
        node.addDirective(new Directive('repeat',cond));
    }
}

/**
 * 递归元素
 * 描述：生成树形节点，实现嵌套结构
 */
class RECUR extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //条件
        let cond = node.getProp('cond');
        node.delProp('cond');
        // if(typeof cond === 'number'){ //表达式
        //     cond = GlobalCache.getExpression(cond);
        // }
        node.addDirective(new Directive('recur',cond));
    }
}

/**
 * IF 元素
 * 描述：用于条件判断
 */
class IF extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'IF', 'cond');
        }
        node.delProp('cond');
        // if(typeof cond === 'number'){ //表达式
        //     cond = GlobalCache.getExpression(cond);
        // }
        node.addDirective(new Directive('if',cond));
    }
}

class ELSE extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        node.addDirective(new Directive('else',null));
    }
}

/**
 * ELSEIF 元素
 * 描述：用于条件判断
 */
class ELSEIF extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'ELSEIF', 'cond');
        }
        node.delProp('cond');
        // if(typeof cond === 'number'){ //表达式
        //     cond = GlobalCache.getExpression(cond);
        // }
        node.addDirective(new Directive('elseif',cond));
    }
}

/**
 * ENDIF 元素
 * 描述：用于结束条件判断
 */
class ENDIF extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        node.addDirective(new Directive('endif',null));
    }
}

/**
 * SLOT 元素
 * 描述：替代器，替换同名节点
 */
class SLOT extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //条件
        let cond = node.getProp('name') || 'default';
        node.delProp('name');
        node.addDirective(new Directive('slot',cond));
    }
}

DefineElementManager.add([MODULE,FOR,IF,RECUR,ELSE,ELSEIF,ENDIF,SLOT]);
