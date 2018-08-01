import Vue from './core/Vue';
const vue = new Vue({
    ele:"#app",
    data:{
        a:1,
    }
});

setTimeout(()=>{
    console.log(vue,'vue')
    vue.a = '哈哈';
    // vue.b.c = '12'
},3000);