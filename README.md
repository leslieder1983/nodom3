# nodom

nodom是一款基于数据驱动的web mvvm框架。
用于搭建单页应用(SPA)，目前发展到3.3版本。
插件也在同步更新中。

详情请点击官网[nodom](http://www.nodom.cn/webroute/home)  
```js
源码所在目录：./core  
示例所在目录：./examples  
示例运行方式:  
clone后在根目录执行  
npm install  
安装依赖包  
再执行  
npm run build  
即可编译出可运行的nodom.js  
使用Live Server启动在./examples目录下的html文件即可  
```
# 文档

## 安装

Nodom是一款用于构建用户界面的前端框架，Nodom支持按需、渐进式引入。不论是体验Nodom还是构建复杂的单页应用，Nodom均完全支持。

在项目内可引入的方式如下：

1. 下载JavaScript文件，以ES Module的形式引入。

2. 在页面以CDN包的方式引入。

### 最新的Nodom

最新的版本可在[GitHub](https://github.com/fieldyang/nodom3)上获取，内有官方发布的重要信息，包括详细的更新日志，及之前的版本。

### 体验Nodom

你可以在[CodePen](https://codepen.io/pen/?template=wvqPeJQ)平台在线体验Nodom。
也可前往GitHub平台下载源码，运行./examples目录内提供的示例代码。

### CDN

对于CDN引入的方式，可以这样引入：

```html
<script src="https://unpkg.com/nodomjs"></script>
```

以确保使用最新版本。

### 下载引入

在生产环境下，建议引入完整的**nodom.js**文件，Nodom建议使用ES Module实现模块化，无需构建工具即可完成模块化开发，引入方式如下：

```html
<script type="module">
    import{nodom,Module} from '../dist/nodom.js'
		class Module1 extends Module{
			template(){
				return `
					<div>
						{{msg}}
					</div>
				`
			}
			data(){
				return {
					msg:'Hello World'
				}
			}
		}
    	nodom(Module1,'div');
</script>
```



## 基础

### 起步

 Nodom是一款基于数据驱动，用于构建用户界面的前端`MVVM`模式框架。内置路由，提供数据管理功能，支持模块化、组件化开发。在不使用第三方工具的情况下可独立开发完整的单页应用。

<!--假设你已经掌握一定的Html，Css,JavaScript基础，如果没有，那么阅读文档将会有些困难。-->

一个简单的Hello World例子如下：

```js
<script type='module'>
import{nodom,Module} from '../dist/nodom.js'
class HelloWorld extends Module {
 template() {
  return `
  	<div>
 		helloWorld!
  	</div>`;
 }
}
nodom(HelloWorld, "div");
</script>
```

#### 引入方式

Nodom支持以普通JavaScript文件的形式引入至HTML文件，比如：

```html
<script src="./nodom.global.js"></script>
```

但是我们建议以ES Module的形式引入script文件，利于模块化开发。与普通的script文件引入不同的是，ES Module的引入在标签内需要配置**type="module"**浏览器才能识别。比如：

```html
<script type='module'>
import{nodom,Module} from '../dist/nodom.js'
</script>
```

 #### 渲染元素

Nodom支持渐进式开发，框架内部会使用元素选择器将该元素作为框架处理的入口。所以，传入你的渲染器作为框架处理的入口，将该元素完全交给Nodom托管。

例如有一节点：

```html
<div id="app">   
</div>
```

我们将其称为根节点，如果需要将一个Nodom模块渲染到根节点，只需要编写元素选择器，依序传入Nodom方法内，第一个参数为定义的模块类，第二个参数为dom选择器。

```js
nodom(HelloWorld, "#app");
```

Nodom会将传入模块渲染至传入的选择器。

### 模块基础

Nodom基于模块进行应用搭建，一个应用由单个或多个模块组成。

#### 模块定义

模块定义需要继承Module类。模版类定义方式主要便于各模块独立和重复使用。
定义模块时，为提升模块重用性，通过template()方法返回模板字符串定义模板代码，通过data()方法返回对象指定数据，还可以自定义模块需要的方法。      典型定义如下代码所示：

```javascript
		class Module1 extends Module{
			template(){
				return `
                    <div>
					    <span class='name'>Hello,{{ name}}</span> &nbsp;
					    <button e-click='change'>change</button>
                    </div>
				`
			}
			data(){
				return {
					name:'nodom',
				}
			}	
			change(model){
				model.name='nodom3';
			}    
		}
```

#### 模块生命周期

主要支持开发者参与模块的各个环节。

| 事件名                    | 描述                     | 参数  | this指向 |
| :------------------------ | :----------------------- | :---: | :------: |
| onBeforeRender            | 渲染前执行事件           | model |  module  |
| onBeforeFirstRender       | 首次渲染前执行事件       | model |  module  |
| onBeforeFirstRenderToHTML | 首次渲染到html执行事件   | model |  module  |
| onFirstRender             | 执行首次渲染后事件       | model |  module  |
| onBeforeRenderToHtml      | 增量渲染到html前执行事件 | model |  module  |
| onRender                  | 执行每次渲染后事件       | model |  module  |

#### 

#### 生命周期图示

![nodom生命周期](D:\User_zhao\App_file\Google_file\nodom生命周期.jpg)

#### 模块注册

根模块注册除外，Nodom为子模块提供两种注册方式：

* 模块modules数组注册

```js
<!--待注册模块A -->
class ModuleA extends Module{
    ...
}
<!--待注册模块B -->
class ModuleB extends Module{
    ...
}
<!--注册使用模块A，B -->
class Module extends Module{
    ...
    modules=[ModuleA,ModuleB]//或者在构造函数内指定
    ...
template(){
    return `
 	使用模块A
	<ModuleA></ModuleA>
	使用模块B
	<ModuleB></ModuleB>
 `
 }
}
```

* *registModule*方法
  registModule方法可以给待注册模块设置**别名**，在模板中使用模块时，既可以使用模块类名作为标签名，也可以使用注册的别名作为标签名。


```js
<!--待注册模块A -->
class ModuleA extends Module{
    ...
}
registModule(ModuleA,'User');
class Main extends Module{
    template(){
        return `
<!--两种方式均可-->
<ModuleA></ModuleA>
<User></User>
`
    }
}
```

### 

### 模板语法

nodom使用基于HTML语法的模板语法，支持原生的HTML语法。

#### 基础写法

模板的写法遵循两个基本的原则：

- 所有的标签应该闭合，如果时没有内容的标签可以写成自闭合标签的形式；
- 所有模块的模板都应该有一个根节点。

nodom支持原生HTML写法，例如：

```html
<span>hello</span>

<div class="cls1 cls2"> <p> Something </p> </div>

......
```

#### 模块写法

在其他模块里使用定义好的模块，默认使用该模块定义时使用的类名，比如假设我们已经定义了一个模块名为`ModuleA`，在其他模块的模板中使用时我们直接使用他的类名当作标签名：

```html
<ModuleA />
```

如果你使用了`registModule`API注册模块，并且提供了模块别名，则在模板中可直接使用别名，例如我们使用`registModule(ModuleA,'mod-a')`的方式注册模块，则我们在模板中可以这样写：

```html
<mod-a />
```

这两种写法的效果完全一样。


#### 表达式写法

表达式是实现数据驱动的方式之一，它可以在静态的模板中插入动态的值。
考虑这样一个场景我们需要在页面上显示欢迎信息，并且带上名字，我们会这样写：

```html
<span>Hello,Bob!</span>
```

但是如果换一个人，这样写可能就不太合适，这样写不论是谁都只会显示的“Hello，Bob!”,于是我们可以使用表达式来替换后面的名字：

```HTML
<span>Hello,{{ name }}!</span>

// model.name = 'Joe';
```

这样nodom就会去当前模块实例的model里去寻找名为`name`的property的值，并且用它替换`{{ name }}`。比如这里，我们显示的就是“Hello，Joe！”，于是我们就可以通过改变`name`的值来做到动态渲染后面的人名。

表达式不仅可以解析model里的属性，而且完整的支持了**JavaScript的表达式**。例如，如下的表达式写法都是合法的：

```html
{{ count + 1 }} 

{{ flag ? "flag is true" : "flag is false" }}

{{ arr.reverse().join('-') }}
```

但下面的写法时不会被表达式解析的：

```html
<!-- 控制流不会被解析，使用三元表达式可以代替 -->
{{ if(flag) {return 'flag is true'} }}

<!-- 这不是合法的JavaScript表达式，这是JavaScript语句 -->
{{ let flag = true }}
```

同时在表达式里面可以执行当前模块实例上的方法：

```js
// getStr是模块实例上的方法
getStr(){
	return "Hello，nodom";
}
```

```html
<span>{{ getStr() }}</span>
```

上面的span会被渲染成为“Hello，nodom”。

表达式还可以传递动态的属性值：

```html
<div class={{ tigger ? 'cls1' : 'cls2' }}>
	动态class
</div>
```

> 默认属性值需要使用引号包裹（单引号`'`或者双引号`"`均可），但如果将表达式作为属性值，可以不写引号。

关于表达式的详细信息可以阅读本章的表达式章节。

#### 指令写法

nodom的指令一般以`x-`开头，指令一般用来控制模板的行为，比如我们可以通过`x-show`指令来控制一个DOM元素渲染与否。

```html
<span x-show={{ isShow }}> Hello,nodom!</span>
```

`x-show`指令接收`true`或者`false`，我们可以使用表达式将值传给该指令，这里如果表达式返回为`true`，则会渲染该节点，如果为`false`则不会渲染该节点。

关于指令的详细信息可以阅读本章的指令与指令元素章节。

#### 事件写法

nodom的事件命名为`e-`+原生事件名不写`on`，例如：

```html
<!-- 原生事件onclick 在nodom中的写法为e-click -->
<button e-click="confirm">确定</button>
```

事件以字符串的形式接收一个模块实例上方法的名字，当事件触发时，nodom会调用该方法。

关于事件绑定的详细信息可以阅读本章的事件绑定章节。

### 表达式

在Nodom中，与视图进行数据绑定的最常用形式就是使用**{{}}**(双大括号)，灵感追溯至Mustache库，用来与对应模块实例data内的属性值进行替换，比如：

```html
<div>{{msg}}，I'am Coming</div>
```

对应模块内的data为：

```js
data(){
    return {
        msg:'HelloWorld'
    }
}
```

最终在页面上会变成

```html
HelloWorld,I'am Coming
```

当然，Nodom对JavaScript表达式实现了支持。所以确保双大括号内传入的是**单个JavaScript表达式**。也就是需要返回一个计算结果。

```js
<!-- 取值 -->
{{student.age}}
<!-- 三目运算-->
{{num>0?1:0}}
<!-- 调取JavaScript内置函数-->
{{name.toUpperCase()}}
```

在表达式内，JavaScript常见的内置对象是可用的，比如：Math、Object、Date等。由于表达式的执行环境是一个沙盒，请勿在内部使用用户定义的全局变量，

一些常见非表达式写法包括：赋值，流程控制。**避免**使用他们：

```js
{{ let a = 1 }}
{{ if (true) { return 'HelloWorld!' } }}
```

#### 表达式用法

表达式功能强大，在表达式内，可以访问模块实例(Module)与表达式所在节点对应的数据对象(Model)，赋予了表达式较高的灵活性，常见的用法包括：

* 访问实例数据
* 调用模块方法
* 访问模块属性

```js
例如模块部分代码定义如下：
class Hello extends Module{
    constructor(){
        this.name='hello';
        this.getData=function(){
            return ['星期一'，'星期二'，'星期三'，'星期四''星期五']
        }
    }
    data=()=>{
        return {
            title:'helloWorld'
        }
    }
}
<!-- 表达式语法内，普通的属性名对应模块实例data字段的同名属性值，this指向的即是对应模块实例 -->
访问实例数据：{{title}}//'helloWorld'
调用模块方法：{{this.getData()}} //['星期一'，'星期二'，'星期三'，'星期四''星期五']
访问模块属性：{{this.name}} //'hello'
```

在视图模板内，表达式用途广泛，包括：

* 指令取值
* 普通属性赋值
* 展示数据
* 编写CSS样式(详见CSS支持章节)

```html
<div>
    <!-- 展示数据-->
    <h1>{{title}}</h1>
    <!-- 属性、指令赋值 -->
    <div style={{getCss}} x-if={{flag}}>
</div>
```

如果表达式内的计算结果产生不可预知的错误，默认的，会返回空字符串，确保程序运行时不会出错。

```html
<div>
    <!-- 如果对应模块数据对象内无该字符段，默认会返回空字符串 -->
   {{age}} //''
</div>
```

### 事件绑定

nodom以`e-` + 原生事件名（不写on）的形式来监听DOM事件，接收一个字符串形式的方法名字，当事件触发的时候，nodom会依据此名字去当前模块的实例方法中找到该方法并且在当前模块的上下文中执行它。用法为`e-click="methodName"`。
比如：

```js
export class ModuleA extends Module{
	template(){
	
		return `
		<div>
			<button e-click="addCount">addCount</button>
			<span> {{ count }} </span>
		</div>
		`;
	}
	// model
	data(){
		return {
			count:0
		}
	}
	//  button onclick事件触发回调。
	addCount(model){
		model.count++;
	}

}
```

#### 回调函数的参数

如上个例子所示，回调函数的第一个参数是当前模块实例的model，实际上，回调函数接收了更多的参数：

| 顺序       | 参数                  |
| ---------- | --------------------- |
| 第一个参数 | 当前模块实例的model   |
| 第二个参数 | 事件绑定的虚拟DOM     |
| 第三个参数 | nodom的事件封装nEvent |
| 第四个参数 | 原生事件event         |

```js
	//  事件触发回调。
	addCount(model,vdom,nEvnet,event){
		......
	}
```

#### 事件修饰符

对于事件，可以在接收的字符串中以`:`分隔的形式添加事件修饰符。
事件处理支持三种修饰符：

| 名字   | 作用             |
| ------ | ---------------- |
| once   | 事件只执行一次   |
| nopopo | 禁止冒泡         |
| delg   | 事件代理到父对象 |
| 用法： |                  |

```html
<!-- 事件只执行一次 -->
<button e-click="tiggerClick:once">do something</button>

<!--禁止冒泡-->
<div e-click="outer">
	<div e-click='inner:nopopo'></div>
</div>

<!-- 事件代理到ul -->
<ul>
	<li x-repeat={{rows}} e-click="check:delg">...</li>
</ul>
```



### 指令(Directive)

​	指令用于增强元素的表现能力，有两种使用方式，一种是以"x-"开头，作为元素的属性(attribute)使用，另外一种是把指令名用作标签名，例如<module></module>目前NoDom支持14个指令:module,model,repeat,recur,class,if,else,elseif,endif,show,field,route,router,slot。

#### 指令优先级

指令具有优先级，按照数字从小到大，数字越小，优先级越高。优先级高的指令优先执行。

| 指令名                         | 优先级值 |
| ------------------------------ | -------- |
| model                          | 1        |
| repeat，recur                  | 2        |
| if,else,elseif,endif,show,slot | 5        |
| module                         | 8        |
| field,route,router             | 10       |

#### model指令

model指令用于给view绑定数据，数据采用层级关系，如:需要使用数据项data1.data2.data3，可以直接使用data1.data2.data3，也可以分2层设置分别设置x-model='data1'，x-model='data2'，然后使用数据项data3。下面的例子中描述了x-model的几种用法。
model指令改变了数据层级，则如何用外层的数据呢，NoDom支持从根向下查找数据功能，当需要从根数据向下找数据项时，需要使用"$$"

##### 模版代码

```
<div x-model="user">
      顾客信息：
      <div x-model="name">
            <div>姓氏：{{lastName}}</div>
            <div>名字：{{firstName}}</div>
      </div>
</div>
```

##### js代码

```
data(){ 
	return{ 
		user: { 
			name: { firstName: 'Xiaoming', lastName: 'Zhang' } 
			} 
		} 
	} W
```

#### repeat 指令

repeat指令用于给按照绑定的数组数据重复生成多个相同的dom，每个dom由指定数组索引对应的数据对象或数据进行渲染。使用方式为x-repeat='items|filter',其中items为json数组，filter为过滤器。

##### 数据索引

索引数据项为$index，为避免不必要的二次渲染,index需要单独配置。

##### 模版代码

```
<div x-repeat={{foods1}}>
                    编号：{{$index+1}}，菜名：{{name}}，价格：{{price}}
                    <p>配料列表：</p>
                    <ol>
                        <li x-repeat={{rows}}>食材：{{title}}，重量：{{weight}}</li>
                    </ol>                  
</div>
```

##### js代码

```
data(){
 foods1:[{
                name: '夫妻肺片',
                price: 25,
                rows:[{title:'芹菜',weight:100},{title:'猪头肉',weight:200}]
            }, {
                name: '京酱肉丝',
                price: 22,
                rows:[{title:'瘦肉',weight:100},{title:'葱',weight:200}]
            }, {
                name: '糖醋里脊',
                price: 20,
                rows:[{title:'排骨',weight:200}]
            }]
}
```

#### recur 指令

recur指令用于递归，能够实现一层包一层的结构，在使用时，注意数据中的层次关系即可。

##### 模版代码

```
<div x-recur='ritem'>
			<span class="{{cls}}">{{title}}</span>
			<recur ref/>
</div>
```

##### js代码

```
ritem: {
						title: "第一层",
						cls: "cls1",
						ritem: {
							title: "第二层",
							cls: "cls2",
							ritem: {
								title: "第三层",
								cls: "cls3",
							},
						}
		}
```

#### if/elseif/else/endif指令

if/else指令用于条件渲染，当if指令条件为真时，则渲染该节点。当if指令条件为假时，则进行后续的elseif指令及else指令判断，如果某个节点判断条件为真，则渲染该节点，最后通过endif指令结束上一个if条件判断。

##### 模板代码

```
<div>
    <div>如果discount<0.8，显示价格</div>
    <div x-if={{discount<0.6}}>价格：{{price}}</div>
    <div x-elseif={{discount<0.7}}>价格：{{price}}</div>
    <div x-else={{discount<0.8}}>价格：{{price}}</div>
    <div x-endif></div>
</div>
data(){
    return {
        discount: 0.7,
        price: 200
    }
}
```



#### show指令

show指令用于显示或隐藏view，如果指令对应的条件为真，则显示该view，否则隐藏。使用方式为x-show='condition'。

##### 模板代码

```
<div>
    <button e-click='change'>change</button>
    <div x-show={{show}}>价格：{{price}}</div>
</div>

data(){
    return{
        show:true,
        price:2000
    }
}

```

#### module指令

module指令用于表示该元素为一个模块容器，module指向模块类会作为子模块渲染到该元素内。使用前先创建所需要的moduleA，然后编写完毕后，再用nodom(moduleA,'容器')即可。

##### 模版代码

```
class ModuleA extends Module{ 
	template(){ return `
    <div>这是我的moduleA</div>`}
nodom(ModuleA,'div')
```

#### field指令

field指令用于实现form表单下的输入类型元素，如input、combo、select、textarea等输入元素与数据项之间的双向绑定，即二者中一个改变另一个也会改变。

##### 配置说明

- 绑定单选框radio：多个radio的x-field值必须设置为同一个数据项，同时需要设置value属性，该属性与数据项可能选值保持一致。
- 绑定复选框checkbox：除了设置x-field绑定数据项外，还需要设置yes-value和no-value两个属性，分别对应选中和未选中时所绑定数据项的值。
- 绑定select：多个option选项可以使用x-repeat指令生成，同时使用x-field给select绑定初始数据即可。
- 绑定textarea：直接使用x-field绑定数据项即可。

##### 模板代码

```
<div>
    姓名：<input x-field="name" />
    性别：<input type="radio" x-field="sexy" value="M" />男
    	 <input x-field="sexy" type="radio" value="F" />女
    已婚：<input type="checkbox" x-field="married" yes-value="1" no-value="0" />
    学历：<select x-field="edu">
    		<option x-repeat={{edus}} value="{{eduId}}">{{eduName}}</option>
    	 </select>
    简介:<textarea x-field='intro'></textarea>
</div>

data(){
    return{
    name: 'nodom',
    sexy: 'F',
    married: 1,
    edu: 2,
    birth: '2017-05-11',
    edus: [
        { eduId: 1, eduName: "高中" },
        { eduId: 2, eduName: "本科" },
        { eduId: 3, eduName: "硕士研究生" },
        { eduId: 4, eduName: "博士研究生" },
        ]
    }
} 
```

### 指令元素（Element）

指令元素和指令的使用效果类似，使用方法有一些不同。

#### module元素

module元素用于表示该元素为一个模块容器，module指向模块类会作为子模块渲染到该元素内。使用前先创建所需要的moduleA，然后把模块名作为标签名进行使用。

#### 模板代码

```
<ModuleA xxx='333'>
        <h3 style='color:gold'>
              我自动作为solot节点
        </h3>
</ModuleA>
```

#### for元素

#### recur元素

recur元素和recur指令的功能一样，都用于递归，能够实现一层包一层的结构，在使用时，注意数据中的层次关系即可。

##### 模版代码

```
<recur cond='items' name='r1' class='secondct'>
		<for cond={{items}} >
				<div class='second'>id is:{{id}}-{{title}}</div>
				<recur ref='r1' />
		</for>
</recur>
```

##### js代码

```
data(){
	return{
		ritem2:{
						items:[
							{
								title:'aaa',
								id:1,
								items:[{
									id:1,
									title:'aaa1',
									items:[
										{title:'aaa12',id:12},
										{title:'aaa11',id:11,items:[
											{title:'aaa111',id:111},
											{title:'aaa112',id:112}
										]},
										{title:'aaa13',id:13}
									]}
	}
	]
	}
	}
}
```

#### if/elseif/else/endif元素

- 单个if标签：if标签用于条件判断，需要设置cond属性用于添加条件，当条件为真时渲染该节点，否则隐藏并执行endif。
- if/else标签：当if标签条件为假时，渲染else标签并执行endif。
- if/elseif/else标签：elseif需要设置cond属性。当if标签条件为假时，进行后续的elseif标签的条件判断，当某个条件为真时，则渲染该节点，并执行endif。如果所有elseif标签的条件都为假，则渲染else标签然后执行endif。
- endif标签：结束上一个条件判断。

##### 模板代码

```
<div>
	<div>单个if指令</div>
    <div>如果discount<0.8，显示价格</div>
    <if cond={{discount < 0.8}}>价格：{{price}}</if>
    <endif/>
</div>

<div>
	<div>完整的if/else指令</div>
    <div>如果age<18，显示未成年，否则显示成年</div>
    <if cond={{age<18}}>年龄：{{age}}，未成年</if>
    <else>年龄：{{age}}，成年</else>
    <endif/>
</div>

<div>
	<div>if elseif else</div>
    根据不同分数显示不同等级，<60不及格，60-69及格，70-79中等，80-89良好，>=90优秀
    <if cond={{grade<60}}>不及格</if>
    <elseif cond={{grade>60 && grade<70}}> 及格 </elseif>
    <elseif cond={{grade>70 && grade<80}}> 中等 </elseif>
    <elseif cond={{grade>80 && grade<90}}> 良好 </elseif>
    <else> 优秀 </else>
    <endif/>
</div>

data(){
    return {
        discount: 0.7,
        price: 200,
        age: 20,
        grade: 73,
    }
}
```





### 列表

在我们的日常开发中，渲染一个`列表`是十分常见的应用场景。接下来我们看看，在`Nodom`中是如何来实现`列表`的渲染的。

#### 基础使用

在`Nodom`中，我们提供了两种方式来实现`列表`的渲染。

第一种是通过内置指令`x-reapet`的方式。

第二种方式通过`Nodom`实现的`<for>`标签。回想一下，当你想要渲染一个按钮组件的时候，你会毫不犹豫的想到用`<button>`标签。那么在你想要渲染`列表`组件的时候，`Nodom`也完全支持你使用`<for>`标签。`<for>`标签是`Nodom`的内置的指令元素，含有一个`cond`属性，用来传入需要渲染的列表数据。

`Nodom`会自动帮你将所有数据转换为响应式数据。

```html
<!-- x-repeat 指令 -->
<div class="code">
    菜单：
    <div x-repeat={{foods}} $index='idx'>
        <span>菜名：{{name}}，价格：{{price}}</span>
    </div>
</div>

<!-- <for>标签 -->
<div class="code">
    菜单：
    <for cond="{{foods}}" $index='idx'}}>
        <span>菜名：{{name}}，价格：{{price}}</span>
    </for>
</div>
```

**结果**:

#### 索引号的使用（编号从0开始）

目前，有一个这样的需求，你需要为你的列表模块添加一个编号。所以我们需要知道当前元素的索引、那么我们如何去获取当前索引呢？`Nodom`自动为你当前的`model`注入了`$index`这一变量，用来获取当前索引。但在使用之前，我们需要你指定索引的名字

```html
<div class=tip>索引号的使用（编号从0开始）</div> 
<!-- x-repeat 指令 -->
<div class=code>
    菜单：
    <div x-repeat={{foods}} $index='idx'>
        编号：{{idx}}，菜名：{{name}}，价格：{{price}}
    </div>
</div>

<!-- <for>标签 -->
<div class=code>
    菜单：
    <for cond={{foods}} $index='idx'>
        编号：{{idx}}，菜名：{{name}}，价格：{{price}}
    </for>
</div>
```

**结果**：

**注意**：不论你是否使用，我们都建议你指定`$index`的索引名，否则将造成不可预知的错误。

#### 访问`Model`中的数据

如果你需要访问`data`中的数据，那么直接访问是不行的。因为每一个`x-repeat`复制出来的`module`是独立的`model`，他们与基础的`module`的指向的全局`model`不同，这类`module`会指向自己的独立`model`，你仅能访问`cond`里对象的属性。那我们如何来访问呢？只有在当前`module`中通过`this.model`调用全局`model`来访问`data`中的数据。

```html
<div class=tip>访问 data 中的数据</div>
<div class="code">
    菜单：
    <for cond={{foods}} $index='idx'>
        data中的show: {{this.model.show}}
    </for>
</div>
```



#### 自定义过滤数组

现在，你只想看到`22`元以上的菜，那么，你可以使用一个自定义函数来为你自己筛选这些菜。

```html
<div class=tip>自定义过滤数组</div>
<!-- x-repeat 指令 -->
<div class="code">
    菜单：
    <div x-repeat={{getFood(foods)}} $index='idx'>
        菜名：{{name}}，价格：{{price}}
    </div>
</div>
<!-- <for>标签 -->
<div class="code">
    菜单：
    <for cond={{getFood(foods)}} $index='idx'>
        菜名：{{name}}，价格：{{price}}
    </for>
</div>
```

```js
getFood(arr) {
    return arr.filter(item => item.price > 22);
}
```

**结果**：

或者，你需要将所有的数据排序展示，那么你可以将`getFood`方法修改如下：

```js
getFood(arr) {
	return arr.sort((a,b) => a.price - b.price);
}
```

**结果**：

**注意**：自定义函数中传入的数据已经不是原来`data`中的初始数据了，而是包裹了一层`Proxy`的响应式数据。因此，你将只能调用一些支持的方法。例如：

- `push()`
- `pop()`
- `unshift()`
- `shift()`
- `splice()`
- `sort()`
- `reverse()`
- `filter()`
- `map()`

#### 嵌套列表

有时候，我们会遇到复杂一点的嵌套列表。`Nodom`也能出色的完成这项任务。

```html
<div class=tip>repeat 嵌套</div>
<div class=code>
    菜单：
    <div x-repeat={{foods1}} $index='idx'>
        编号：{{idx+1}}，菜名：{{name}}，价格：{{price}}
        <p>配料列表：</p>
        <ol>
            <li x-repeat={{rows}} $index='idx'>食材：{{title}}，重量：{{weight}}</li>
        </ol>
    </div>
</div>
```

**结果**：

#### `x-repeat` 指令与 `<for>`标签

或许你会有一个疑问，`x-reapt`指令和`<for>`标签有什么不同呢？其实，二者并无什么不同的地方，`<for>`标签其实就是封装了`x-repeat`指令的一个标签。所以，`<for>`标签和`x-repeat`指令在任何时候都可以互换，这全凭你的喜好。

#### `x-repeat`指令和`x-recur`指令

`x-recur`指令可以和`x-repeat`一起使用，更快速的解析`树形结构`的数据。例如，现在你需要写一个树形组件，他的数据格式是这样的

```js
{
  ritem2: {
    items: [
      {
        title: "aaa",
        id: 1,
        items: [
          {
            id: 1,
            title: "aaa1",
            items: [
              { title: "aaa12", id: 12 },
              {
                title: "aaa11",
                id: 11,
                items: [
                  { title: "aaa111", id: 111 },
                  { title: "aaa112", id: 112 },
                ],
              },
              { title: "aaa13", id: 13 },
            ],
          },
          {
            title: "aaa2",
            id: 2,
            items: [
              {
                title: "aaa21",
                id: 21,
                items: [
                  {
                    title: "aaa211",
                    id: 211,
                    items: [
                      { title: "aaa2111", id: 111 },
                      { title: "aaa2112", id: 112 },
                    ],
                  },
                  { title: "aaa212", id: 212 },
                ],
              },
              { title: "aaa22", id: 22 },
            ],
          },
        ],
      },
      {
        title: "bbb",
        id: 2,
        items: [
          {
            title: "bbb1",
            id: 10,
            items: [
              { title: "bbb11", id: 1011 },
              { title: "bbb12", id: 1012 },
            ],
          },
          {
            title: "bbb2",
            id: 20,
            items: [
              { title: "bbb21", id: 201 },
              { title: "bbb22", id: 202 },
            ],
          },
        ],
      },
    ],
  },
};

```

你如果仅仅使用`x-repeat`指令，那么很难去生成一个`树形结构`。还好，`Nodom`帮你做了处理，现在将`x-recur`加入进来。

```html
<h3>递归带repeat</h3>
<div x-model='ritem2'>
    <recur cond='items' name='r1' class='secondct'>
        <for cond={{items}} $index='idx'>
            <div class='second'>id is:{{id}}-{{title}}</div>
            <recur ref='r1' />
        </for>
    </recur>
</div>
```

漂亮，十分简洁的代码就搞定了树形结构。

**结果**:

#### 注意

+ `x-for`指令和`<for>`标签中均只能使用对象数组作为数据。
+ `<for>`标签最终渲染的标签为`<div>`
+ 不要将`<for>`标签和`x-repeat`指令一起使用。

### 虚拟Dom		

​		Nodom通过js进行虚拟dom缓存，在dom树上进行比对然后渲染dom树，进行对dom操作性能的优化，通过状态的改变和与模板容器dom中做比对来进行对dom树的渲染操作。

#### tagName属性

```typescript
/**
 * 元素名，如div
 */
public tagName: string;
```

#### key属性

​		Nodom中虚拟dom的key是唯一的标识，对节点的操作时提供并保证正确的位置，也可以通过key来获取虚拟dom中的值

```typescript
/**
 * key，整颗虚拟dom树唯一
 */
public key: string;
```

#### model属性

```typescript
/**
 * 绑定模型
 */
public model: Model;
```

```typescript
public static renderDom(module:Module,src:VirtualDom,model:Model,parent?:VirtualDom,key?:string):VirtualDom{
    //节点自带model优先级高
    model = src.model?src.model:model;
    let dst:VirtualDom = new VirtualDom(src.tagName,key?src.key+'_'+key:src.key);
```

#### AddEvent()方法			

​		添加事件时，可以使用Nodom虚拟dom中的addEvent方法，如果这个事件已经添加，将不再进行添加操作

```typescript
public addEvent(event: NEvent) {
    if(!this.events){
        this.events = new Map();
    }
    if(!this.events.has(event.name)){
        this.events.set(event.name, [event.id]);
    }else{
        let arr = this.events.get(event.name);
        //已添加的事件，不再添加
        if(arr.indexOf(event.id) === -1){
            arr.push(event.id);
        }
    }
}
```

​		虚拟dom经过diff找出最小差异，批量进行patch，无需手动操作dom元素，极大的提高了页面性能。同时虚拟dom是JS的对象，有利于进行跨平台操作。

## 深入

<!--本章节建议先阅读完模块基础，再来了解核心-->

### 模块传值&Props

为了加强模块之间的联系，Nodom在模块之间提供Props来传递数据。除根组件外，每个模块在进行模板解析时，执行模块实例的template方法时，会将父模块通过dom节点传递的属性以对象的形式作为参数传入，也就是说，子模块可以在自己的template函数内，依据传入的props**动态创建模板**。

```js
<!--模块A  功能：根据父模块依据标签传入props的值展示不同的视图代码-->
class ModuleA extends Module{
      template(props){
          //在template函数内可以进行预处理
          if(props.name=='add'){
              return `<h1>${props.name}<h1>`
          }else{
              return `<h1>none</h1>` 
       }  
    }
}
registModule(ModuleA,'User');
<!-- 根模块 -->
class Main extends Module{
    template(){
        return `
 <ModuleA name='add'></ModuleA>//展示<h1>add</h1>
`
    }
}
```

借助模板字符串的加持，可以包含特定语法（`${expression}`）的占位符，很大程度的拓展了模板代码的灵活度。可以插入原生的JavaScript表达式。

#### 数据传递

Nodom数据传递为单向数据流，props可以实现父模块向子模块的数据传递，但是这是被动的传递方式，如果需要将其保存至子模块内的代理数据对象，可以在传递的属性名前，加上’$'后缀，Nodom会将其传入子模块的代理对象内，实现响应式监听。

```js
<!--模块A  功能：父模块主动传值，将其保存至模块A的代理对象Model内-->
class ModuleA extends Module{
      template(props){
              return `<h1>{{name}}<h1>`
    }
}
registModule(ModuleA,'User');
<!-- 根模块 -->
class Main extends Module{
    template(){
        return `
 <ModuleA $name={{name}}></ModuleA>//展示<h1>Nodom</h1>
`
    }
    data(){
        return {
            name:'Nodom',
        }
    }
}
```

#### 反向传递

由于props的存在，父模块可以暴露外部接口，将其通过props传递给子模块，子模块调用该方法即可实现反向传递的功能。例如:

```js
<!--模块A  功能：点击按钮使父模块的数据改变-->
class ModuleA extends Module{
      template(props){
          this.parentChange=props.add;
             return `<button e-click='change'>点击改变父模块的数据<button>`
    }
    change(){
        this.parentChange(1);
    }
}
registModule(ModuleA,'User');
<!-- 根模块 -->
class Main extends Module{
    template(){
        return `
   count={{sum}}
 <User add={{this.add}}></User>
`
    }
    data(){
        return {
           sum:0,
        }
    }
    //这里需要使用箭头函数，来使该函数的this始终指向根模块，或者使用bind函数绑定this指向
    add=(num)=>{
        this.model.sum+=num;
    }
}
//当点击ModuleA内的按钮，根模块Model对象内的sum值会加一。
```

以此方法可以实现子模块向父模块的数据传递功能。

#### 深层数据传递

对于跨越多个模块层次的数据传递。

可使用第三方**数据发布-订阅**库。

在开发大型项目时，可以使用数据管理库帮助我们管理数据，使数据以可预测的方式发生变化，我们推荐使用团队开发的**kayaks**库，或者其他优化的数据管理库均可。

### 插槽

在实际开发中，插槽功能会较大程度的简化项目难度，插槽作为模板暴露的外部接口，增大了模板的灵活度，更利于模块化开发。Nodom以指令和指令元素的方式实现插槽功能，两者的功能类似。

```html
<!--指令元素的方式使用插槽 -->
<slot>
    <h1>
    title
    </h1>
</slot>
<!-- 指令的形式使用插槽-->
<div x-slot='title'></div>
```



#### 默认插槽

在模块标签内的模板代码会作为待插入的节点，如果子模块内有默认的插入位置```<slot></slot>```,将会将节点插入该位置。如果没有待插入的内容，子模块内```slot```标签将会正常显示。

```js
<!--模块A  父模块待插入的内容，与slot标签进行替换 最终的模板代码为`<button>我是父模块</button>`-->
class ModuleA extends Module{
      template(props){
             return `
                    <slot>
                        我是默认内容
                    </slot>`
    }
}
registModule(ModuleA,'User');
<!-- 根模块  User标签内的所有内容作为待插入的内容-->
class Main extends Module{
    template(){
        return `
  				<User>
					<button>我是父模块</button>
				 </User>
`
    }
}
```

#### 命名插槽

在使用插槽的场景下，很多时候默认插槽不足以完成全部功能。在内置多个插槽的时候，就需要使用命名插槽了。命名插槽就是给插槽定义插槽名，传入的标签需要与插槽名一致才可发生替换。

```js
<!--模块A  父模块待插入的内容，依据name属性与与slot标签进行替换 最终的模板代码为：
`<button>我是父模块的title</button>
<button>我是父模块的footer</button>`
    -->
class ModuleA extends Module{
      template(props){
             return `
					<div>
                    <slot name='title'>
                        我是title
                    </slot>
					<slot name='footer'>
					    我是footer
					</slot>
					</div>`
    }
}
registModule(ModuleA,'User');
<!-- 根模块  User标签内的slot标签内容作为待插入的内容-->
class Main extends Module{
    template(){
        return `
 		 	<User>
				<slot name='title'>
				<button>我是父模块的title</button>
				<slot>
				<slot name='footer'>
				<button>我是父模块的footer</button>
				<slot>
 			</User>
`
    }
}
```

#### 内部渲染插槽

在某些场景中，可能需要将插槽内容在子模块渲染，也就是相当于**传递模板代码**,而不在父模块内渲染。对于这种情况，只需要在子模块的插槽定义处，附加`innerRender`属性即可。

```js
<!--模块A  由于子模块插槽具有innerRender属性，父模块待替换的模板区域不会在父模块内进行渲染，在本模块渲染
    -->
class ModuleA extends Module{
      template(props){
             return `
					<!--最终页面会显示'child' -->
                    <slot innerRender>
                        我是默认内容
                    </slot>`
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'User');
<!-- 根模块  User标签内的所有内容作为待插入的内容-->
class Main extends Module{
    template(){
        return `
  				<User>
					{{title}}
				 </User>
`
    }
    data(){
        return {
            title:'parent'
        }
    }
}
```

### 数据模型model

`model`是实现数据驱动的核心，一个`model`是一个由`Proxy`代理的对象，模块的`model`的数据来源是模块实例的`data()`函数返回的对象。得益于`Proxy`，我们可以实现数据劫持和数据监听，来做到数据改变的时候自动更新渲染。

>关于`Proxy`的详细信息你可以参照[Proxy-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。

在使用的时候，你可以直接把`model`当作对象来操作：

```js
// 模块的数据来源
data(){
	return {
		title:'Hello',
		count:0,
		obj:{
			arr:[1,2,3]
		}
	}
}

// 在其他地方使用model
changeTitle(model){
	model.count++;
}

```

`model`对象里的所有的对象都是一个`model`,而每个`model`保有一个模块列表，当`model`内部的数据变化，会引起该`model`的模块列表中所有模块的渲染，默认`model`的模块列表中只有当前模块，如果你通过`$data`的方式从父模块传入了一个`object`给子模块，那么该`object`也会作为一个`model`传入子模块的`model`中，且这个传入的`model`所持有的模块列表中将会有父模块和子模块。由于是引用传值，所以无论是在父还是在子中改变了`object`，都会触发两个模块的渲染。

#### $set()

大多数情况下你都可以使用操作对象的方式来操作`model`，但是nodom还是在`model`上提供了一个`$set()`方法，来应对一些特殊情况，比如你需要往`model`上设置一个深层次的对象。

```js
data(){
	return {
		data:{
			a:1,
			b:'b'
		}
	}
}

change(model){
	// 会报错，因为不存在data1为undefined
	model.data1.data2.data3 = { a:'a' };
	// 使用$set可以避免该问题，如果你没有这么深层次的对象$set会帮你创建。
	model.$set("data1.data2.data3",{a:'a'});
}
```

#### $watch()

nodom在`model`里提供了`$watch`方法来监视`model`里的数据变化，从而执行你想要执行的操作。

```js
data(){
	return {
		obj:{
			arr:[1,2,3];
		}
	}
}

watch(model){
	model.$watch('obj.arr',(oldVal,newVal)=>{
		console.log('检测到数据变化');
		console.log('oldVal：',oldVal);
		console.log('newVal：',newVal);
	})
}

changArr(model){
	model.obj.arr = [3,2,1];
	// 执行完成之后会看到打印值。
}

unwatch(model){
	// 第三个参数为true表示取消监视，取消监视可以将第二个参数设置为undefined
	model.$watch('obj.arr',undefined,true);
}

```



### 渲染

Nodom的渲染是基于数据驱动的，也就是说只有Model内的数据发生了改变，当前模块才会进行重新渲染的操作。渲染时，Nodom将新旧两次渲染产生的虚拟Dom树进行对比，找到变化的节点，实现最小操作真实Dom的目的。

```js
<!--模块A  由于父模块传入的Props未发生改变，那么父模块的更新不会影响子模块-->
class ModuleA extends Module{
      template(props){
             return `
					<!--最终页面会显示'child' -->
   					${props.title}{{title}}`
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'User');
<!-- 根模块 点击按钮后，由于改变了响应式数据，触发了根模块的渲染-->
class Main extends Module{
    template(){
        return `
  				<button e-click='change'>改变title</button>
				<User title={{title}}></User>
`
    }
    data(){
        return {
            title:'parent'
        }
    }
    change(model){
        model.title='none';
    }
}
```



#### Props的副作用

在使用props的场景下，如果我们传递的属性值发生改变，那么子模块会先触发编译模板的过程,再进行渲染操作，也就是模块重新激活。

特殊的，在Props中，对于传递`Object`类型的数据，Nodom会将其默认为**数据改变**。

```js
<!--模块A  由于父模块传入的Props数据发生了改变，ModuleA重新激活，触发template函数进行编译，再进行渲染-->
class ModuleA extends Module{
      template(props){
             return `
					<!--父模块按钮点击后,最终页面会显示’nonechild' -->
   					${props.title}{{title}}`
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'User');
<!-- 根模块  点击按钮后，由于改变了响应式数据，触发了根模块的渲染-->
class Main extends Module{
    template(){
        return `
  				<button e-click='change'>改变title</button>
				<User title={{title}}></User>`
    }
    data(){
        return {
            title:'parent'
        }
    }
    change(model){
        model.title='none';
    }
}
```

#### 单次渲染模块

如果想要摒弃Props带来的渲染副作用，Nodom提供单次渲染模块。单次渲染模块只有在首次渲染时才会接收Props，随后无论Props如何变化，都不会影响到模块本身。使用方式为在模块标签内附加`renderOnce`属性。

```js
<!--模块A  由于renderOnce属性，Props的改变不会影响到模块A本身-->
class ModuleA extends Module{
      template(props){
             return `
					<!--父模块按钮点击后,最终页面会显示’nonechild' -->
   					${props.title}{{title}}`
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'User');
<!-- 根模块  点击按钮后，由于改变了响应式数据，触发了根模块的渲染-->
class Main extends Module{
    template(){
        return `
  				<button e-click='change'>改变title</button>
				<User renderOnce title={{title}}></User>`
    }
    data(){
        return {
            title:'parent'
        }
    }
    change(model){
        model.title='none';
    }
}
```

### 自定义

#### 自定义指令

nodom提供`createDirective`接口来自定义指令。

```javascript
createDirective(
	'directiveName', 
	function(module, dom, src){
		......
	},
	11 
)

```

`createDirective`接收三个参数

- 第一个参数是`name`，`string`类型，指令的名字，使用指令的时候需要在前面加上`x-`;
- 第二个参数是`handler`，`Function`类型,处理指令逻辑的方法，nodom会给这个方法传三个参数。
  1. `module`，当前模块的实例；
  2. `dom`，当前节点本次渲染的虚拟dom节点；
  3. `src`，当前节点的在originTree中的虚拟dom节点。
- 第三个参数是`priority`,`number`类型，默认值为10，可以不传，1-10为保留字段，数字越大优先级越低。

#### 自定义元素

自定义元素需要继承`DirectiveElement`类，且需要加入在`DirectiveElementManager`中注册。

```javascript
// 定义自定义元素
class MYELEMENT extends DirectiveElement{
	constructor(node,module){
        super(node,module);
        
		......
    }
}
	
// 注册自定义元素
// add 接收一个自定义类或者自定义类数组
DirectiveElementManager.add(MYELEMENT);
```

定义自定义元素的构造器接收两个参数：

- 第一个参数`node`,该自定义元素的虚拟dom节点；
- 第二个参数`module`,当前模块的实例。

### 动画与过渡

我们使用`x-animation`指令管理动画和过渡，该指令接收一个存在于model上的对象，其中包括`tigger`属性和`name`属性。

- `name`属性的值就是你过渡或者动画的类名；
- `tigger`为过渡的触发条件。

过渡分为`enter`和`leave`，触发`enter`还是`leave`由`tigger`的值触发

- `tigger`为`true`，触发`enter`；
- `tigger`为`false`,触发`leave`。

对于`enter`过渡，需要你提供以`-enter-active`、`-enter-from`、`-enter-to`为后缀的一组类名，当然在传入给`animation`指令的对象中你只需要提供前面的名字，`x-animation`在工作中会自动的为你加上这些后缀。这些规则对于`leave`过渡同理。

`tigger`为`true`时，指令首先会在元素上添加`-enter-from`和`-enter-active`的类名，然后再下一帧开始的时候添加`-enter-to`的类名，同时移除掉`-enter-from`的类名。

`tigger`为`false`时，处理流程完全一样，只不过添加的是以`-leave-from`、`-leave-active`、`-leave-to`为后缀的类名。

下面我们分别举一个过渡和一个动画的例子：

- `x-animation`管理过渡

```html
<style>
	.shape-enter-active,
	.shape-leave-active {
		transition: all 1s ease;
	}
	.shape-enter-from,
	.shape-leave-to {
		height: 100px;
		width: 100px;
	}
	.shape-enter-to,
	.shape-leave-from {
		height: 200px;
		width: 200px;
	}
</style>
```

```js
class Module1 extends Module {
	template() {
		return `
	<div>
		<button e-click="tiggerTransition">tiggerTransition</button>
		<div x-aniamtion={{transition}}>
			......
		</div>
	</div>
		`;
	}
	data() {
		return {
			transition: {
				name: "shape",
				tigger: true,
			},
		};
	}
}
```

- `x-animation`管理动画

> 对于动画，后缀为`-from`和`-to`的类名没有那么重要，如果你对元素在执行动画前后的状态没有要求，那么可以不用提供以这两个后缀结尾的类名，尽管如此，x-animation指令还是会帮你添加这些后缀结尾的类名，以防止其他因素触发了模块的更新导致动画异常触发的情况。（x-animation检测这些类名来判断动画或者过渡的执行状态）

```html
<style>
.myfade-enter-active {
	animation-name: myfade;
	animation-duration: 1s;
}
.myfade-leave-active {
	animation-name: myfade;
	animation-duration: 1s;
	animation-direction: reverse;
}
@keyframes myfade {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
```

```js
class Module1 extends Module {
	template() {
		return `
		<div>
			<button e-click="tiggerAnimation">tiggerAnimation</button>
			<div x-aniamtion={{animation}}>
				......
			</div>
		</div>
		`;
	}
	data() {
		return {
			animation: {
				name: "myfade",
				tigger: true,
				// type的值默认为'transition'，如果是动画则需要指明
				type:'aniamtion',
			},
		};
	}
}
```

对于部分常用的过渡效果，我们已经将其封装进入了nodomui.css文件，你只需要全局引入该css文件即可。
提供的过渡校效果见下表：

| name             | 效果                        |
| ---------------- | --------------------------- |
| fade             | 渐入渐出                    |
| scale-fixtop     | 固定上面缩放                |
| scale-fixleft    | 固定左边缩放                |
| scale-fixbottom  | 固定底边缩放                |
| scale-fixright   | 固定右边缩放                |
| scale-fixcenterX | 固定以X轴为对称轴往中间缩放 |
| scale-fixcenterY | 固定以Y轴为对称轴往中间缩放 |
| fold-height      | 折叠高度                    |
| fold-width       | 折叠宽度                    |

#### 进入/离开动画

在传入`x-aniamtion`指令的对象里面有一个属性`isAppear`（默认值为`true`）可以用来配置当前的过渡/动画是否是进入离开过渡/动画。

- 若为`true`，则表示在离开动画播放完成之后会隐藏该元素（dispaly：none);
- 若为`false`,则表示在离开动画播放完成之后不会隐藏该元素。

#### 钩子函数

在传入`x-aniamtion`指令的对象里面有一个`hooks`属性，用于配置过渡/动画执行前后的钩子函数。这两个函数的名字分别为`before`和`after`。
他们的触发时机为:

- `before`触发动画/过渡之前。
- `after`触发动画/过渡之后。

例如上面这个`shape`过渡的例子：

```js
class Module1 extends Module {
	template() {
		return `
	<div>
		<button e-click="tiggerTransition">tiggerTransition</button>
		<div x-aniamtion={{transition}}>
			......
		</div>
	</div>
		`;
	}
	data() {
		return {
			transition: {
				name: "shape",
				tigger: true,
				hooks:{
					// 钩子函数的this指向model,第一个参数为module
					// 过渡执行前钩子函数
					before(module){
						console.log(module)
					},
					// 过渡执行后钩子函数
					after(module){
						console.log(module)
					}
				}
			},
		};
	}
}
```

#### 过渡/动画控制参数

传入`x-animation`指令的对象不止上述提到的这些，还有一些控制参数，下表是所有可以传入的属性所示：

| name           | 作用                                     | 可选值                              | 默认值     | 必填                                |
| -------------- | ---------------------------------------- | ----------------------------------- | ---------- | ----------------------------------- |
| tigger         | 触发动画                                 | true/false                          | true       | 是                                  |
| name           | 过渡/动画名（不包含-enter-active等后缀） | -                                   | 无         | 是                                  |
| isAppear       | 是否是进入离开过渡/动画                  | true/false                          | true       | 否                                  |
| type           | 是过渡还是动画                           | 'aniamtion'/'transition'            | transition | 否                                  |
| duration       | 过渡/动画的执行时间                      | 同css的duration的可选值             | '0s'       | 如果提供的css类里指明了时间则可不填 |
| delay          | 过渡/动画的延时时间                      | 同css的delay的可选值                | -          | 否                                  |
| timingFunction | 过渡/动画的时间函数                      | 同css的timingFunction的可选值       | 'ease'     | 否                                  |
| hooks          | 过渡/动画执行前后钩子函数                | before/after函数或者enter/leave对象 | 无         | 否                                  |

#### 进入/离开分开配置

对于一个元素的过渡/动画 我们可以分开配置不同的效果。这样传入`x-animation`指令的对象的写法会又所不同。
例如：

```js
class Module1 extends Module {
	template() {
		return `
	<div>
		<button e-click="tiggerTransition">tiggerTransition</button>
		<div x-aniamtion={{transition}}>
			......
		</div>
	</div>
		`;
	}
	data() {
		return {
	transition: {
				tigger: true, // 必填
				name: {
					enter: "scale-fixtop",
					leave: "scale-fixleft",
				},
				duration: {
					enter: "0.5s",
					leave: "0.5s",
				},
				delay: {
					enter: "0.5s",
					leave: "0.5s",
				},
				timingFunction: {
					enter: "ease-in-out",
					leave: "cubic-bezier(0.55, 0, 0.1, 1)",
				},
				hooks: {
					enter: {
						before(module) {
							console.log("scale-fixtop前", module);
						},
						after(module) {
							console.log("scale-fixtop后", module);
						},
					},
					leave: {
						before(module) {
							console.log("scale-fixleft前", module);
						},
						after(module) {
							console.log("scale-fixleft后", module);
						},
					},
				},
			},
		};
	}
}
```



## 路由

Nodom内置了路由功能，可以配合构建单页应用，用于模块间的切换。你需要做的是将模块映射到路由 。并指定最终在哪里渲染它们。

#### 创建路由

Nodom提供`createRoute`方法，用于注册路由。以`Object`配置的形式指定路由的路径、对应的模块、子路由等。

以下是一个简单的路由示例：

```html
<!-- 点击触发路由跳转-->
<div x-route='/main'>page1</div>
<!-- 指定路由模块渲染的位置-->
<div x-router>
```

```js
import {createRoute} from './nodom.js';
//这里默认Hello为一个完整的模块
import Hello from'./route/hello.js';
//创建路由
createRoute({
    path:'/main',
    //指定路由对应的模块
    module:Hello
});
```

这样就可以实现简单的路由功能了。

#### 嵌套路由

在实际应用中，通常由多层嵌套的模块组合而成。配置对象内`routes`属性，以数组的方式注册子路由。例如：

```js
import {createRoute} from './nodom.js';
//这里默认Hello为一个完整的模块
import Main from'./route/hello.js';
import MTop from'./route/top.js';
import MBottom from'./route/bottom.js';
createRoute({
    path:'/main',
    //指定路由对应的模块
    module:Module，
    routes:[
    {
     path:'/top',
    //指定路由对应的模块
    module:MTop， 
	},{
     path:'/bottom',
    //指定路由对应的模块
    module:MBottom，
}
    ]
});
```

可以发现，每个配置对象内均可设置子路由，于是，你就能开始嵌套多层路由了。

#### 路由跳转

借助`x-route`指令，用户无需手动控制路由跳转。但在一些情况下，需要手动操作路由跳转，Nodom提供两种方式手动跳转：

* `Router.go`
* `Router.redirect`

用来切换路由，实现路由的跳转。

#### 路由传值

如果想要实现路由传值，只需在路径内以`：params`配置。例如：

```js
import {createRoute} from './nodom.js';
//这里默认Hello为一个完整的模块
import Hello from'./route/hello.js';
//创建路由
createRoute({
    path:'/main：id',
    //指定路由对应的模块
    module:Hello
});
```

Nodom将通过路由传的值放入模块的数据对象模型(Model)的`$route`中。

路由模块中可以通过`$route.data`获取path传入的值。

```html
<!--跳转模块 -->
<div>
<div x-route='/main/1'>跳转至模块Hello</div>
    <div x-router></div>
</div>
<!-- 路由模块Hello-->
<div>
    <!-- 值为1-->
   {{$route.data.id}} 
</div>

```

#### 路由事件

##### 单路由事件

每个路由可设置：

* `onEnter`事件 ，`onEnter`事件在路由进入时执行,

* `onLeave`事件，`onLeave`事件在路由离开时执行。 

执行时传入第一个参数：当前模块的根模型对象(Model)。

如：从/r1/r2/r3 切换到 /r1/r4/r5。
则`onLeave`响应顺序为r3 `onLeave`、r2 `onLeave`。
`onEnter`事件则从上往下执行执行顺序为 r4 `onEnter`、 r5 `onEnter`。

例如：

```js
import {createRoute} from './nodom.js';
//这里默认Hello为一个完整的模块
import Hello from'./route/hello.js';
//创建路由
createRoute({
    path:'/main',
    module:Hello,
    onLeave:function(model){
        console.log('我执行了onleave函数');
    },
    onEnter:function(model){
         console.log('我执行了onEnter函数');
    }
});
```





##### 全局路由事件

通过设置 `Router.onDefaultEnter` 和`Router.onDefaultLeave` 事件作为全局路由事件，执行方式与单个路由事件执行方式相同，只是会作用于每个路由。

#### 默认路由

浏览器刷新时，会从服务器请求资源，nodom路由在服务器没有匹配的资源，则会返回404。通常的做法是: 在服务器拦截资源请求，如果确认为路由，则做特殊处理。
假设主应用所在页面是/web/index.html，当前路由对应路径为/webroute/member/center。刷新时会自动跳转到/member/center路由。相应浏览器和服务器代码如下：

##### 浏览器代码

```js
import {Router,Module} from './nodom.js';
class Main extends Module{
    ...
    //在根模块中增加onFirstRender事件代码
    onFirstRender:function(module){
        let path;
        if(location.hash){
            path = location.hash.substr(1);
        }
        //默认home ，如果存在hash值，则把hash值作为路由进行跳转，否则跳转到默认路由
        path = path || '/home';
       Router.go(path);
   	}
	...
}

```

##### 服务器代码

服务器代码为[noomi框架](http://www.nodom.cn/webroute/tutorial/www.noomi.cn)示例代码，其它如java、express做法相似。
如果Nodom路由以'/webroute'开头,服务器拦截到请求后，分析资源路径开始地址是否以'/webroute/'开头，如果是，则表示是nodom路由，直接执行重定向到应用首页，hash值设定为路由路径(去掉‘/webroute’)。

```js
@Instance({
    name:'routeFilter'
})
class RouteFilter{
    @WebFilter('/*',2)
    do(request:HttpRequest,response:HttpResponse){
        const url = require("url");
        let path = url.parse(request.url).pathname;
        //拦截资源
        if(path.startsWith('/webroute/')){
            response.redirect('/web/index.html#' + path.substr(9));
            return false;
        }
        return true;
    }
}

export{RouteFilter};
```

### 生态

#### NodomUI

