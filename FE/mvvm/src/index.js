import Vue from './core/Vue';
const vue = new Vue({
    ele:"#app",
    data:{
        a:1,
        b:{
            c:8
        },
        list:[{h:8},{h:9}]
    }
});

setTimeout(()=>{
    console.log(vue,'vue')
    vue.a = '哈哈';
    vue.b.c = '12';
    vue.list.push({
        h:10
    });
   const aNode = document.getElementById('a');
},1000);