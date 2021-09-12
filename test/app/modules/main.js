import {Module} from '../../../dist/nodom.js'
import {ModuleA} from './modulea.js'
export class ModuleMain extends Module{
    template(){
        return `
            <div>
                <button e-click='change'>change</button>
                <div>hello world!</div>
                <div>x.y is {{x.y}}</div>
                <h2>默认plug</h2>
                <ModuleA x-data={{getData()}} xxx='111'>
                    <plug name='aa'>
                        <h3 style='color:blue'> hello change plug 1</h3>    
                    </plug>
                </ModuleA>

                <h2>替换plug</h2>
                <ModuleA x-data={{getData()}} xxx='222'>
                    <plug name='aa'>
                        <h3 style='color:red'> hello change plug 2</h3>    
                    </plug>
                </ModuleA>
           </div>
        `
    }
    model = {
            show:true,
            x:{
                y:123
            },
            y:'hello',
            name:'yanglei',
            rows:[
                {name:'yang'},
                {name:'lei'},
            ]
        }
    
    methods = {
        getData(){
            // return {
            //     x1:'x.y',
            //     x2:['y',true]
            // }
            return{
                n:'name',
                x1:'x.y',
                x2:['y',true]
            }
        },
        change(){
            this.show = false;
            this.y = 'aaaa';
            console.log(this);
        }
        
    }
    modules = [ModuleA]
    
}