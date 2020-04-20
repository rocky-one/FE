## js执行上下文-函数栈 ##

**先来说一说一个函数执行的过程:**

    function fn1(i){
        var a = 'tom'
        var fn2 = function(){}
        function fn3(){}
    }
    fn1(100) 



1.函数预处理阶段: 创建变量对象(VO),刚开始调用时内部代码还未开始执行,用来存储方法用到的参数、内部函数声明、变量(var).

	VO = {
	    scopChain: {},
	    variableObject: {
	        arguments: {
	            0: 100,
	            length: 1
	        },
	        i: 100,
	        fn3: function fn3(),
	        a: undefined,
	        fn2: undefined
	    },
	    this: {}
	}


2.函数执行阶段:激活变量对象(VO),也就是给上一个阶段的变量对象赋值,相当于创建了AO这个对象,可以理解AO是被激活了的VO,此时可以访问VO里存的变量了.此时也就能解释变量提升的问题了.在var之前访问这个变量其实访问的相当于第一阶段初始化的值为undefined.

	VO = {
	    scopChain: {},
	    variableObject: {
	        arguments: {
	            0: 100,
	            length: 1
	        },
	        i: 100,
	        fn3: function fn3(){},
	        a: 'tom',
	        fn2: function fn2(){}
	    },
	    this: {}
	}

**为什么函数会被提升?**

变量声明是在编译阶段，而真正的赋值是在执行阶段。

Brendan Eich(javascript创始人)给出了解释,函数提升为了解决递归相互调用的问题。看下面代码,a方法里调用b,b方法里调用a。

    function a(){
    	//...
    	b()
    }
    
    function b(){
    	//...
    	a()
    }
如果函数不被提升,那么当a方法执行的时候,b还未被声明就会报错,所以为了解决这个问题就有了函数提升.不过在项目开发中还是遵循自上而下的顺序,也就是先声明后使用,这样保证代码的稳定性减少错误.

**Execution Context:函数执行环境（或执行上下文），简称EC**

**上下文分类:**

  - Global 全局代码
  - Fuction 函数内部代码
  - Eval eval内部代码
  
  一个上下文包括: 变量对象、作用域链、this

**Execution Context Stack: 函数执行环境栈**

执行栈的特定是后进先出,浏览器打开一个页面是首先进入的是全局上下文,当调用一个函数fn1时这个函数会被压入到栈中,如果这个函数中又调用了函数fn2,那么fn2会被压入栈顶 等到fn2的函数执行完后,fn2被移除栈.此时的控制权回到了下一个栈内,继续执行fn1后面的代码,直到全局上下文.

    function foo(i) {
      if (i < 0) return;
      console.log('begin:' + i);
      foo(i - 1);
      console.log('end:' + i);
    }
    foo(2);
    
    // 输出:
    // begin:2
    // begin:1
    // begin:0
    // end:0
    // end:1
    // end:2
解析:
foo(2)执行放入栈中,console.log('begin:' + 2);由于递归所以后续console没有被调用,foo(1)被推入栈中,直到foo(-1)时不再递归自己,此时开始出栈,foo(-1)出栈,执行环境交到下一个栈,下一个栈是foo(0),执行console.log('begin:' + 0);继续出栈foo(1),直到全局上下文.


