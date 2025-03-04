import {Module,registModule} from '../../dist/nodom.esm.js'
import {ModuleB} from './moduleb.js'
export class ModuleA extends Module{
    template(props){
        if(props.p1){
            return `
                <div  class='modulea' style='color:red'>
                    <div>这是子模块A</div>
                    <p>模块A的内容</p>
                    <slot></slot>
                </div>
            `;
		} else if (props.temp) {
			return `
                <div>
                    <h1>props传模版</h1>
                    ${props.temp}
                </div>
            `
        }else{
            return `
                <div class='modulea'>
                    <div>这是外部数据name:{{n}}</div>
                    <for  cond={{rows}}>
                        <slot innerRender>
                            hello plug
                        </slot>
                    </for>
                    <div>这是外部数据x1:{{x1}}</div>
                    <div>
                        <p>这是外部数据x2:{{x2}}</p>
                        <slot name='s2'>第二个slot</slot>
                    </div>
                    <button e-click='changeX2'>修改x2</button>
                </div>
            `
        }
        
    }
    data(){
        return{
            name:'yang',
            x1:0,
            x2:0,
            rows:[{name:'nodom1'},{name:'nodom2'},{name:'nodom3'}]
        }
    }
    changeX2(model){
        model.x2='hello';
        console.log(model);
    }
    onBeforeFirstRender(){
        // console.log(this);
    }
    onBeforeRender(model){
        if(!this.props || !this.props.$data){
            return;
        }
        for(let k of Object.keys(this.props.$data)){
            model[k] = this.props.$data[k];
        }
        delete this.props.$data
    }
}

registModule(ModuleA,'mod-a');
