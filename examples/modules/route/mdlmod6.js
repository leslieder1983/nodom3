import {Module,request} from '../../../dist/nodom.esm.js'

class Module61 extends Module{
    template(props){
        return '<p style="background:#f00">{{name}}</p>'
    }
}
/**
 * 路由主模块
 */
export class MdlMod6 extends Module {
    modules = [Module61]
    // template() {
    //     return '<span>路由r2加载的模块</span>'
    // }
    template(){
        return `
            <div>
                vip is:{{d1.vip}}
                <Module61 x-repeat = {{d1.foods}} useDomModel />
                <ul>
                    <li x-repeat={{d1.foods}}>
                        {{name}}
                    </li>
                </ul>
                <button e-click='clickTest'>test</button>
                <input x-field='title' />
                <div>{{title}}</div>
            </div>
        `;
    }

    data(){
        return {
            title:'test'
        }
    }
    onBeforeFirstRender(model){
        request({
            url:'/examples/data/data1.json',
            type:'json'
        }).then(r=>{
            model.d1 = r;
            console.log(r);
        })
    }

    clickTest(){
        console.log(this);
    }
}