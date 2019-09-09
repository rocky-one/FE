## js普通函数和箭头函数的区别 ##

1. 箭头函数没有prototype, 所有自身也就没有this,this继承自上一层函数的this
2. 箭头函数不能被new,因为箭头函数没有constructor
3. 如果箭头函数是在全局下声明的,那么this指向window
4. 箭头函数的this是在定义时就确定了的,并且后面不能修改this的指向,想要修改this可以修改箭头函数的上层函数的this来实现
5. 箭头函数的this指向上一层普通函数时,arguments也会继承那个普通函数,箭头函数this指向window时使用arguments会报未声明的错误
