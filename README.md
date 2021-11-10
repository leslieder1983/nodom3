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

Nodom是一款用于构建用户界面的前端`MVVM`模式框架，Nodom支持按需、渐进式引入。不论是体验Nodom还是构建复杂的单页应用，Nodom均完全支持。

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

Nodom支持渐进式开发，框架内部会将传入的容器作为框架处理的入口。所以，传入你的元素选择器作为渲染的容器，将该容器完全交给Nodom托管。

例如有一节点：

```html
<div id="app">   
</div>
```

我们将其称为根节点，如果需要将一个Nodom模块渲染到根节点，只需要编写元素选择器，依序传入Nodom方法内，第一个参数为定义的模块类，第二个参数为Dom选择器。

```js
nodom(HelloWorld, "#app");
```

Nodom会将传入模块渲染至传入的选择器。

### 模块基础

NoDom以模块为单位进行应用构建，一个应用由单个或多个模块组成。。

#### 模块定义

模块定义需要继承Module类。定义模块时，为提升模块重用性，通过template（）方法返回字符串形式模板代码，建议使用模板字符串。

通过data()方法返回数据对象，还可以自定义模块方法。    

  示例代码如下：

```javascript
		class Module1 extends Module{
            //Nodom会将模板代码编译成虚拟 DOM ，再渲染至真实DOM上
			template(){
				return `
                    <div>
					    <span class='name'>Hello,{{ name}}</span> &nbsp;
					    <button e-click='change'>change</button>
                    </div>
				`
			}
            //定义模块需要的数据
			data(){
				return {
					name:'nodom',
				}
			}	
            //自定义模块方法
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
|                           |                          |       |          |

#### 

#### 生命周期图示

![nodom生命周期](D:\User_zhao\App_file\Google_file\nodom生命周期.jpg)


### 模板语法

nodom采用基于HTML的模板语法。

#### 基础写法

模板的写法遵循两个基本的原则：

- 所有的标签都应该闭合，没有内容的标签可以写成自闭合标签；
  ```html
  <!-- 闭合标签 -->
  <div>Something</div>
  <!-- 自闭合标签 -->
  <ModuleA />
  ```
- 所有模块的模板都应该有一个根节点。
  ```html
  <!-- 外层div作为该模块的根 -->
    <div> 
        <!-- 模板代码 -->
        template code...
    </div>
  ```

同样的，Nodom支持原生HTML语法，例如：

```html
<span>hello</span>

<div class="cls1 cls2"> <p> Something </p> </div>

......
```

#### 模块写法

在模板里使用之前已经定义好的模块是一个常见的需求，在模板中有两种方式使用已经定义好的模块:

- 使用modules属性注册模块，然后直接使用模块的类名；
  ```js
  import {ModuleA} from "moduleA.js"
  class Main extends Module{
	  template(){
	  	return `
		<div>
			<!-- 直接使用类名 -->
			  <ModuleA />
		</div>
		`
	  }
      ......
		// 使用modules注册子模块
      modules = [ModuleA];
  }
  ```
- 使用`registModule`API注册模块，并且使用`registModule`注册模块时的提供的别名。
  ```js
  import {registModule} from "nodom.js"
  import {ModuleA} from "modulea.js"
	// 给ModuleA起了一个别名mod-a
  registModule(ModuleA,'mod-a');
  class ModuleA extends Module{
      template(){
	  	return `
			<div>
			<!-- 使用别名 -->
				<mod-a />
			</div>
		`
	  }
  }
  ```
两种写法的效果完全一样。

#### 表达式写法

表达式是实现数据绑定的方式之一。

比如在构建用户欢迎界面的时候：

```html
......

<h1>Hello,Bob!</h1>

......
```

页面会显示用户Bob的的欢迎信息`Hello，Bob！`，当切换用户时，页面还是显示用户Bob的欢迎信息，这显然是不合理的。如果希望根据用户名来显示不同的欢迎信息，需要将用户名`userName`绑定到模板中，实现动态渲染用户名：

```HTML
<h1>Hello,{{ userName }}!</h1>

// model.userName = 'Joe';
```

这样Nodom就会去当前模块实例的`model`里去寻找为`userName`的值，并且用它替换`{{ userName }}`。这样就能够通过操作`userName`的值来显示不同用户的欢迎信息。



> 默认标签的属性值需要使用引号包裹（单引号`'`或者双引号`"`均可），但如果将表达式作为属性值，可以不写引号。
>  如：`<div class="cls1 cls2" name={{userName}}></div>`

关于表达式的详细信息可以阅读本章的表达式章节。

#### 指令写法

Nodom的指令以`x-`开头，指令用来增强模板的功能，比如，`x-show`指令用于控制一个元素是否渲染。

```html
<span x-show={{ isShow }}> Hello,nodom!</span>
```

`x-show`指令接收`true`或者`false`，可以使用表达式为其传值，如果表达式的值为`true`，则会渲染该元素，如果为`false`则不会渲染该元素。

关于指令的详细信息可以阅读本章的指令与指令元素章节。

#### 事件写法

Nodom的事件命名为`e-`+`原生事件名`，例如：

```html
<!-- click事件 在nodom中的写法为e-click -->
<button e-click="confirm">确定</button>
```

事件接收一个模块实例上方法的名，当事件触发时，Nodom会执行该方法。

关于事件绑定的详细信息可以阅读本章的事件绑定章节。


### 表达式
> 为描述方便,接下来将模块实例中对data函数返回的数据对象做响应式处理后的对象，称为Model，  
> 也就是说data函数返回的数据会存在于Model内。 
 
在Nodom中，与视图进行数据绑定的最常用形式就是使用双大括号。Nodom将其称为表达式，灵感追溯至Mustache库，用来与对应模块实例的Model内的属性值进行替换。比如：

```html
<div>{{msg}}，I'm Coming</div>
```

模块实例中对应的data函数为：

```js
data(){
    return {
        msg:'HelloWorld'
    }
}
```

最终在页面上会变为：

```html
HelloWorld,I'm Coming
```

当然，Nodom对原生的JavaScript表达式实现了支持。所以确保双大括号内传入的是**单个JavaScript表达式**。也就是其需要返回一个计算结果。

```js
<!-- 取值 -->
{{student.age}}
<!-- 三目运算-->
{{num>0?1:0}}
<!-- 调取JavaScript内置函数-->
{{name.toUpperCase()}}
```

在表达式内，JavaScript常见的内置对象是可用的，比如：Math、Object、Date等。由于表达式的执行环境是一个沙盒，请勿在内部使用用户定义的全局变量。

一些常见非表达式写法包括：赋值，流程控制。**避免**使用他们：

```js
{{ let a = 1 }}
{{ if (true) { return 'HelloWorld!' } }}
```

#### 表达式用法
表达式功能强大，在表达式内，可以访问模块实例与表达式所在节点对应的Model，赋予了表达式较高的灵活性，常见的用法包括：

* 获取实例数据
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
<!-- 表达式语法内，普通的属性名对应当前节点对应的Model对象内的同名属性值，this指向的即是对应模块实例 -->
获取模块实例数据：{{title}}//'helloWorld'
调用模块方法：{{this.getData()}} //['星期一'，'星期二'，'星期三'，'星期四''星期五']
访问模块属性：{{this.name}} //'hello'
```

在视图模板内，表达式用途广泛，包括：

* 指令取值
* 数据预处理
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
    <!-- 如果对应Model内无该字段，默认会返回空字符串 -->
    <!-- 页面显示''-->
    {{age}} 
</div>
```

### 事件绑定

Nodom使用了专门的事件类`NEvent`来处理Dom的事件操作，在模板中以`e-`开头，如：`e-click`、`e-mouseup`等。事件支持所有HTML元素标准事件，接收一个模块实例上的方法名作为事件处理方法，如：`e-click="methodName"`，当事件触发的时，Nodom会执行该方法。具体用法如下：
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

与原生事件使用不同，Nodom中不需要指定事件参数，事件方法会自带四个参数。参数如下所示：


| 序号 | 参数名 | 描述                  |
| ---- | ------ | --------------------- |
| 1    | model  | dom对应的model        |
| 2    | dom    | 事件对象对应的虚拟dom |
| 3    | nEvent | Nodom事件对象         |
| 4    | event  | html原生事件对象      |

代码如下：
```js
	//  事件触发回调。
	addCount(model,vdom,nEvnet,event){
		......
	}
```

#### 事件修饰符

在传入事件处理方法的时，可以以`:`分隔的形式指定事件修饰符。
事件处理支持三种修饰符：

| 名字   | 作用             |
| ------ | ---------------- |
| once   | 事件只执行一次   |
| nopopo | 禁止冒泡         |
| delg   | 事件代理到父对象 |

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

指令用于增强元素的表现能力，以"x-"开头，以设置元素属性(attribute)的形式来使用。指令具有优先级，按照数字从小到大，数字越小，优先级越高。优先级高的指令优先执行。

目前NoDom支持以下几个指令:

| 指令名 | 指令优先级 | 指令描述                           |
| ------ | ---------- | ---------------------------------- |
| model  | 1          | 绑定数据                           |
| repeat | 2          | 按照绑定的数组数据生成多个相同节点 |
| recur  | 2          | 生成嵌套结构                       |
| if     | 5          | 条件判断                           |
| else   | 5          | 条件判断                           |
| elseif | 5          | 条件判断                           |
| endif  | 5          | 结束判断                           |
| show   | 5          | 显示视图                           |
| slot   | 5          | 插槽                               |
| module | 8          | 加载模块                           |
| field  | 10         | 双向数据绑定                       |
| route  | 10         | 路由跳转                           |
| router | 10         | 路由占位                           |



#### Model 指令

model指令用于给view绑定数据，数据采用层级关系，如:需要使用数据项data1.data2.data3，可以直接使用data1.data2.data3，也可以分2层设置分别设置x-model='data1'，x-model='data2'，然后使用数据项data3。下面的例子中描述了x-model的几种用法。
model指令改变了数据层级，则如何用外层的数据呢，NoDom支持从根向下查找数据功能，当需要从根数据向下找数据项时，需要使用"$$"

模板代码

```
<div x-model="user"> <!-- 绑定数据 --!>
    顾客信息：
    <div x-model="name">
        <div>姓氏：{{lastName}}</div>
        <div>名字：{{firstName}}</div>
     </div>
</div>
```

```
data(){ 
	return{ 
		user: { 
			name: { firstName: 'Xiaoming', lastName: 'Zhang' } 
		} 
	} 
} 
```

#### Repeat 指令

Repeat指令用于给按照绑定的数组数据生成多个dom节点，每个dom由指定的数据对象进行渲染。使用方式为x-repeat={{item}}，其中items为数组对象。

数据索引

索引数据项为$index，为避免不必要的二次渲染,index需要单独配置。

模板代码

```
<!-- 绑定数组数据 --!>
<div x-repeat={{foods1}}>
    编号：{{$index+1}}，菜名：{{name}}，价格：{{price}}
    <p>配料列表：</p>
    <ol>
        <li x-repeat={{rows}}>食材：{{title}}，重量：{{weight}}</li>
    </ol>                  
</div>
```

```
data(){
 	foods1:[{
         name: '夫妻肺片',
         price: 25,
         rows:[{title:'芹菜',weight:100},{title:'猪头肉',weight:200}]}, 
         {
            name: '京酱肉丝',
            price: 22,
            rows:[{title:'瘦肉',weight:100},{title:'葱',weight:200}]},
          {
            name: '糖醋里脊',
            price: 20,
            rows:[{title:'排骨',weight:200}]}
]}
}
```

#### Recur 指令

recur指令生成树形节点，能够实现嵌套结构，在使用时，注意数据中的层次关系即可。recur也可以通过使用recur元素来实现嵌套结构。

```
<!-- 绑定数组数据 --!>
<div x-recur='ritem'>
			<span class="{{cls}}">{{title}}</span>
			<recur ref/>
</div>
<recur cond='items' name='r1' class='secondct'>
		<for cond={{items}} >
				<div class='second'>id is:{{id}}-{{title}}</div>
				<recur ref='r1' />
		</for>
</recur>
```

```
data(){
    ritem: {
       title: "第一层",
       cls: "cls1",
       ritem: {
          title: "第二层",
          cls: "cls2",
          ritem: {
             title: "第三层",
             cls: "cls3"
         		 }
              }
     },
    ritem2:{
		items:[{
				title:'aaa',
				id:1,
				items:[{
					id:1,
					title:'aaa1',
					items:[{
						title:'aaa12',id:12},{
						title:'aaa11',id:11,items:[
						{title:'aaa111',id:111},
						{title:'aaa112',id:112}]},
						{title:'aaa13',id:13}]}
	}
	]
	}      
}
```

#### If/Elseif/Else/Endif 指令

指令用法

- 指令说明：if/else指令用于条件渲染，当if指令条件为true时，则渲染该节点。当if指令条件为false时，则进行后续的elseif指令及else指令判断，如果某个节点判断条件为true，则渲染该节点，最后通过endif指令结束上一个if条件判断。

模板代码

```
<div>
	<!--  --!>
    <div>如果discount<0.8，显示价格</div>
    <!-- 使用if指令判断discount是否小于0.6 --!>
    <div x-if={{discount<0.6}}>价格：{{price}}</div>
    <!-- if指令条件为false，进行elseif指令判断 --!>
    <div x-elseif={{discount<0.7}}>价格：{{price}}</div>
    <!-- elseif指令为false，进行else判断 --!>
    <div x-else={{discount<0.8}}>价格：{{price}}</div>
    <div x-endif></div>
</div>
```

```
data(){
    return {
        discount: 0.7,
        price: 200
    }
}
```

标签用法

- 需要设置cond属性用于添加判断条件。

模板代码

```
<div>
	<!-- 单个if指令 --!>
    <div>如果discount<0.8，显示价格</div>
    <!-- 判断discount是否小于0.8 --!>
    <if cond={{discount < 0.8}}>价格：{{price}}</if>
    <endif/>
</div>

<div>
	<!-- 完整的if/else指令 --!>
    <div>如果age<18，显示未成年，否则显示成年</div>
    <!-- 判断age是否小于18 --!>
    <if cond={{age<18}}>年龄：{{age}}，未成年</if>
    <!-- if条件为false，进入else判断 --!>
    <else>年龄：{{age}}，成年</else>
    <endif/>
</div>

<div>
	<!-- if elseif else --!>
    根据不同分数显示不同等级，<60不及格，60-69及格，70-79中等，80-89良好，>=90优秀
    <!-- 判断grade是否小于60 --!>
    <if cond={{grade<60}}>不及格</if>
    <!-- if条件为false，进入elseif判断 --!>
    <elseif cond={{grade>60 && grade<70}}> 及格 </elseif>
    <!-- 上一个elseif条件为false，进入该elseif判断 --!>
    <elseif cond={{grade>70 && grade<80}}> 中等 </elseif>
    <!-- 上一个elseif条件为true，渲染该节点，结束判断 --!>
    <elseif cond={{grade>80 && grade<90}}> 良好 </elseif>
    <else> 优秀 </else>
    <endif/>
</div>
```

```
data(){
    return {
        discount: 0.7,
        price: 200,
        age: 20,
        grade: 73,
    }
}
```

#### Show 指令

show指令用于显示或隐藏视图，如果指令对应的条件为true，则显示该视图，否则隐藏。使用方式为x-show='condition'。

模板代码

```
<div>
    <div x-show={{show}}>价格：{{price}}</div>
</div>
```

```
data(){
    return{
        show:true,
        price:2000
    }
}
```

#### Module 指令

module指令用于表示该元素为一个模块容器，module指令数据对应的模块会被渲染至该元素内。使用方式为x-module='模块类名'，Nodom会自动创建实例并将其渲染。

模版代码

```
<!-- 这里的Title为一个完整的Nodom模块-->
import Title from './src/dist';
class ModuleA extendsModule{ 
	template(){ 
        return `
        <!-- 将Title模块渲染至当前div-->
        <div x-module='Title'></div>
        `
    }

```

#### Field 指令

- 指令说明：field指令用于实现输入类型元素，如input、select、textarea等输入元素与数据项之间的双向绑定。

配置说明

- 绑定单选框radio：多个radio的x-field值必须设置为同一个数据项，同时需要设置value属性，该属性与数据项可能选值保持一致。
- 绑定复选框checkbox：除了设置x-field绑定数据项外，还需要设置yes-value和no-value两个属性，分别对应选中和未选中时所绑定数据项的值。
- 绑定select：多个option选项可以使用x-repeat指令生成，同时使用x-field给select绑定初始数据即可。
- 绑定textarea：直接使用x-field绑定数据项即可。

模板代码

```
<div>
	<!-- 绑定name数据项 --!>
    姓名：<input x-field="name" />
    <!-- 绑定sexy数据项 --!>
    性别：<input type="radio" x-field="sexy" value="M" />男
    	 <input x-field="sexy" type="radio" value="F" />女
    <!-- 绑定married数据项 --!>
    已婚：<input type="checkbox" x-field="married" yes-value="1" no-value="0" />
    <!-- 绑定edu数据项，并使用x-field指令生成多个option --!>
    学历：<select x-field="edu">
    		<option x-repeat={{edus}} value="{{eduId}}">{{eduName}}</option>
    	 </select>
</div>
```

```
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

**注意**：自定义函数中传入的数据已经不是原来`data`中的初始数据了，而是做了响应式处理的响应式数据。针对会引起响应式数据改变的数组方法，Nodom都提供了支持。例如：

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

Nodom通过js对象的方式实现对真实Dom的映射，通过虚拟Dom树的比对更新，达到最小操作真实Dom的目的。

#### tagName属性

```typescript
/**
 * 元素名，如div
 */
public tagName: string;
```

#### key属性

Nodom中虚拟dom的key是唯一的标识，对节点的操作时提供并保证正确的位置，也可以通过key来获取虚拟dom中的值

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

添加事件时，可以使用Nodom虚拟dom中的addEvent方法，如果这个事件已经添加，将不再进行添加操作

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

虚拟dom经过diff找出最小差异，批量进行patch，无需手动操作dom元素，极大的提高了页面性能。同时虚拟dom是JS的对象，有利于进行跨平台操作。

## 深入

<!--本章节建议先阅读完模块基础，再来了解核心-->
#### 模块注册

根模块的注册除外，Nodom为其余模块提供两种注册方式：

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
 	<!-- 使用模块A-->
	<ModuleA></ModuleA>
	<!-- 使用模块B-->
	<ModuleB></ModuleB>
 `
 }
}
```

* *registModule*方法  
  registModule方法可以给待注册模块设置**别名**，在模板代码中使用模块时，既可以使用模块类名作为标签名引入，也可以使用注册的别名作为标签名引入。


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
### 模块传值&Props

为了加强模块之间的联系，Nodom在模块之间提供Props来传递数据。除根模块外，每个模块在进行模板代码解析，执行模块实例的template方法时，会将父模块通过dom节点传递的属性以对象的形式作为参数传入，也就是说，子模块可以在自己的template函数内，依据传入的props**动态创建模板**。

```js
<!--模块A  功能：根据父模块依据标签传入props的值展示不同的视图代码-->
class ModuleA extends Module{
      template(props){
          //在template函数内可以进行模板预处理
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
        <!-- 展示<h1>add</h1>-->
        <ModuleA name='add'></ModuleA>
`
    }
}
```

借助模板字符串的加持，可以使用包含特定语法（`${expression}`）的占位符，很大程度的拓展了模板代码的灵活度。在占位符内可以插入原生的JavaScript表达式。

#### 数据传递

Nodom数据传递为单向数据流，Props可以实现父模块向子模块的数据传递，但是这是被动的传递方式，如果需要将其保存至子模块内的代理数据对象，可以在传递的属性名前，加上`$`前缀，Nodom会将其传入子模块的根Model内，实现响应式监听。
> 注意：以$前缀开头的Props属性，如果对应的是一个Model对象，该Model对象存在于两个模块内，Model内数据的改变会造成两个模块的渲染。

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
        <!-- 展示<h1>Nodom</h1>-->
        <ModuleA $name={{name}}></ModuleA>
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

由于Props的存在，父模块可以暴露外部接口，将其通过Props传递给子模块，子模块调用该方法即可实现反向传递的功能。例如:

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

在开发大型项目时，可以使用数据管理库帮助我们管理数据，使数据以可预测的方式发生变化，我们推荐使用Nodom团队开发的**kayaks**库，或者其他优秀的数据管理库均可。

### 插槽

在实际开发中，插槽功能会较大程度的降低应用开发难度，插槽作为模板暴露的外部接口，增大了模板的灵活度，更利于模块化开发。Nodom以指令和自定义元素的方式实现插槽功能，两者的功能类似。

```html
<!--自定义元素的方式使用插槽 -->
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

### 数据模型(Model)

`Model`作为模块数据的提供者，绑定到模块的数据模型都由`Model`管理。`Model`是一个由`Proxy`代理的对象，`Model`的数据来源有两个：
- 模块实例的`data()`函数返回的对象;
- 父模块通过`$data`方式传入的值。

`Model`会深层代理内部的`object`类型数据。

基于`Proxy`，Nodom可以实现数据劫持和数据监听，来做到数据改变时候的响应式更新渲染。
> 关于`Proxy`的详细信息请参照[Proxy-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。

在使用的时，可以直接把`Model`当作对象来操作：

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
> Model在管理数据的时候会新增部分以`$`开头的数据项和方法，所以在定义方法和数据时，尽量避免使用`$`开头的数据项和方法名。
#### Model与模块渲染

每个`Model`存有一个模块列表，当`Model`内部的数据变化时，会引起该`Model`的模块列表中所有模块的渲染。默认`Model`的模块列表中只有`Model`所在的模块，如果需要`Model`触发多个模块的渲染，则需要将对应模块添加到`Model`对应的模块列表中(绑定方式查看API ModelManager.bindToModule)。

#### $set()

Nodom在`Model`上提供了一个`$set()`方法，来应对一些特殊情况。例如,需要往`Model`上设置一个深层次的对象。

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
	// 会报错，因为data1为undefined
	model.data1.data2.data3 = { a:'a' };
	// 使用$set可以避免该问题，如果不存在这么深层次的对象$set会帮你创建。
	model.$set("data1.data2.data3",{a:'a'});
}
```

#### $watch()

Nodom在`Model`里提供了`$watch`方法来监视`Model`里的数据变化，当数据变化时执行指定的操作。

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

特殊的，在Props中，对于传递`Object`类型的数据，每次渲染,Nodom会将该模块默认为**数据改变**。

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

### Css支持

​	**Nodom对Css提供额外的支持。**

* 在模板代码中的 `<style></style>` 标签中直接写入Css样式，示例代码如下：

```js
class Module1 extends Module {
    template() {
        return plate = `
				<div>
                    <h1 class="test">Hello nodom!</h1>
                    <style>
                        .test {
                            color: red;
                        }
                    </style>
                </div>`;
       }
}
```

* 在模板代码中的 `<style></style>` 标签中的通过表达式调用函数返回Css样式代码串，示例代码如下：

```js
class Module1 extends Module {
     template() {
         let plate = `
			<div>
                <h1 class="test">Hello nodom!</h1>
                <style>{{css()}}</style>
            </div>`;
     }
     css() {
         return `
			.test {
				color: red;
			}`;
     }
}
```

* 在模块模板中的 `<style></style>` 标签中通过@import url('css url路径')引入Css样式文件，示例代码如下：

```js
class Module1 extends Module {
     template() {
            let plate = `
				<div>
                    <h1 class="test">Hello nodom!</h1>
                    <style>
                        @import url('./style.css')
                    </style>
                </div>
			`;
     }
}
```

* 在模块模板代码中需要样式的节点中直接写Css样式，示例代码如下：

```js
class Module1 extends Module {
     template() {
            let plate = `
				<div>
                    <h1 style="color: red;" class="test">Hello nodom!</h1>
                </div>
			`;
     }
}	
```

**scope属性** 

​	给节点添加该属性后，Nodom会自动在Css选择器前加前置名。使Css样式的作用域限定在当前模块内，不会污染其它模块。

​	示例代码如下：

```js
class Module1 extends Module {
     template() {
            let plate = `
				<div>
                    <h1 class="test">Hello nodom!</h1>
                    <style scope="this">
                        @import url('./style.css')
                    </style>
                </div>
			`;
     }
}
```

### Cache

Nodom提供了缓存功能，缓存空间是一个Object，以key-value的形式存储在内存中；

- key的类型是string，支持多级数据分割，例如：China.captial；
- value支持任意类型的数据。

用户可以自行选择将常用的内容存储在缓存空间，例子如下：

```javascript
GlobalCache.set("China.captial","北京")
```

根据键名从缓存中读取数据，例子如下：

```javascript
GlobalCache.get("China.captial")
```

根据键名从缓存中移除，例子如下：

```javascript
GlobalCache.remove("China.captial")
```

另外，还提供将指令实例，指令参数，表达式实例，事件实例，事件参数，渲染树虚拟dom，html节点，dom参数进行操作。具体使用参考API文档。

对渲染树虚拟dom的操作如下所示。

将渲染树虚拟dom存储在内存中：

```javascript
// 引入模块
import { ObjectManager } from '../dist/nodom.js'
let om = new ObjectManager(module)
```

```javascript
om.saveElement(dom)
```

根据提供的键名获取内存中对应的渲染树虚拟dom：

```javascript
om.getElement(key)
```

根据提供的键名将对应的渲染树虚拟dom从内存中移除：

```javascript
om.removeElement(key)
```

### 自定义

#### 自定义指令

Nodom提供`createDirective`接口来自定义指令。

```javascript
createDirective(
	'directiveName', 
	function(module, dom, src){
		......
	},
	11 
)

```

`createDirective`接收的参数列表如下：

| 序号 | 参数名   | 类型     | 描述                                                               |
| ---- | -------- | -------- | ------------------------------------------------------------------ |
| 1    | name     | string   | 指令的名字，使用时需要在前面加上`x-`                               |
| 2    | handler  | Function | 处理指令逻辑的方法，接收三个参数，参数列表见`handler`参数列表      |
| 3    | priority | number   | 指令优先级，默认为10，可以不传，1-10为保留字段，数字越大优先级越低 |

`handler`函数接收的参数列表如下:

| 序号 | 参数名 | 类型       | 描述                          |
| ---- | ------ | ---------- | ----------------------------- |
| 1    | module | Module     | 当前模块的实例                |
| 2    | dom    | VirtualDom | 本次渲染的虚拟dom             |
| 3    | src    | VirtualDom | 该节点在originTree中的虚拟dom |

#### 自定义元素

自定义元素需要继承`DirectiveElement`类，且需要在`DirectiveElementManager`中注册。

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

定义自定义元素的构造器接收的参数列表如下：

| 序号 | 参数名 | 描述                      |
| ---- | ------ | ------------------------- |
| 1    | node   | 该自定义元素的虚拟Dom节点 |
| 2    | module | 当前模块实例              |




### 动画与过渡

Nodom使用`x-animation`指令管理动画和过渡，该指令接收一个存在于`Model`上的对象，其中包括`tigger`属性和`name`属性。

- `name`属性的值就是过渡或者动画的类名；
- `tigger`为过渡的触发条件。

过渡分为`enter`和`leave`，触发`enter`还是`leave`由`tigger`的值决定

- `tigger`为`true`，触发`enter`；
- `tigger`为`false`,触发`leave`。

对于`enter`过渡，需要提供以`-enter-active`、`-enter-from`、`-enter-to`为后缀的一组类名。在传入给`x-animation`指令的对象中只需要将名字传入给`name`属性，而不必添加后缀，`x-animation`在工作时会自动的加上这些后缀。这些规则对于`leave`过渡同理。

`tigger`为`true`时，指令首先会在元素上添加`-enter-from`和`-enter-active`的类名，然后再下一帧开始的时候添加`-enter-to`的类名，同时移除掉`-enter-from`的类名。

`tigger`为`false`时，处理流程完全一样，只不过添加的是以`-leave-from`、`-leave-active`、`-leave-to`为后缀的类名。

下面是一个过渡的例子和一个动画的例子：

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

> 对于动画，后缀为`-from`和`-to`的类名没有那么重要，如果对元素在执行动画前后的状态没有要求，那么可以不用提供以这两个后缀结尾的类名，尽管如此，x-animation指令还是会添加这些后缀结尾的类名，以防止其他因素触发了模块的更新导致动画异常触发的情况。（x-animation检测这些类名来判断该元素动画或者过渡的执行状态）

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
提供的过渡效果见下表：

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

在传入`x-aniamtion`指令的对象属性中设置`isAppear`（默认值为`true`）属性，可以配置当前的过渡/动画是否是进入离开过渡/动画。

- 若为`true`，则表示在离开动画播放完成之后会隐藏该元素（dispaly：none);
- 若为`false`,则表示在离开动画播放完成之后不会隐藏该元素。

#### 钩子函数

在传入`x-aniamtion`指令的对象里中设置`hooks`属性，可以配置过渡/动画执行前后的钩子函数。且这两个函数名字固定，分别为`before`和`after`。
他们的触发时机为:
- `before`触发动画/过渡之前。
- `after`触发动画/过渡之后。
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

| name           | 作用                      | 可选值                              | 默认值       | 必填 |
| -------------- | ------------------------- | ----------------------------------- | ------------ | ---- |
| tigger         | 触发动画                  | true/false                          | true         | 是   |
| name           | 过渡/动画名（不包含后缀） | -                                   | 无           | 是   |
| isAppear       | 是否是进入离开过渡/动画   | true/false                          | true         | 否   |
| type           | 是过渡还是动画            | 'aniamtion'/'transition'            | 'transition' | 否   |
| duration       | 过渡/动画的执行时间       | 同css的duration的可选值             | ''           | 否   |
| delay          | 过渡/动画的延时时间       | 同css的delay的可选值                | '0s'         | 否   |
| timingFunction | 过渡/动画的时间函数       | 同css的timingFunction的可选值       | 'ease'       | 否   |
| hooks          | 过渡/动画执行前后钩子函数 | before/after函数或者enter/leave对象 | 无           | 否   |

#### 分别配置`enter`/`leave`

对于一个元素的过渡/动画可以分开配置不同的效果。
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

可以发现，每个配置对象内均可设置子路由，那么就可以实现嵌套多层路由了。

#### 路由跳转

借助`x-route`指令，用户无需手动控制路由跳转。但在一些情况下，需要手动控制路由跳转，Nodom提供两种方式手动跳转：

* `Router.go`
* `Router.redirect`

用来切换路由，实现路由的跳转。

#### 路由传值

如果想要实现路由传值，只需在路径内以`:params`配置。例如：

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

Nodom将通过路由传的值放入模块根Model的`$route`中。

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

执行时传入第一个参数：当前模块的根Model。

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
一款基于Nodom的组件库。
#### Kayaks
数据管理库，用于开发大型项目。
#### Nodom VsCode插件
提供模板代码高亮功能，以及其他多种辅助功能。
