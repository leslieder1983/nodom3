import {Module} from '../../../dist/nodom.js'

export class ModuleA extends Module{
    template(props){
        if(props.p1){
            return `
                <div>
                    <div>这是子模块1</div>
                    <div>这是外部数据x1:{{x1}}</div>
                    <plug name="aa">aaa</plug>
                    <div>这是外部数据x2:{{x2}}</div>
                    <button e-click='changeX2'>修改x2</button>
                </div>
            `
        }else{
            return[ `
                <div>
                    <div>这是子模块2</div>
                    <div>这是外部数据name:{{n}}</div>
                    <plug name="aa">
                        hello plug
                    </plug>
                    <div>这是外部数据x1:{{x1}}</div>
                    <div>这是外部数据x2:{{x2}}</div>
                    <button e-click='changeX2'>修改x2</button>
                </div>
            `,true]
        }
        
    }
    model = {
        name:'yang',
        x1:0,
        x2:0
    }

    methods = {
        onBeforeFirstRender(){
            console.log(this);
        },
        changeX2(dom,module){
            this.x2 = 'hahaha'
        }
    }
}