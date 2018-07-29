import Vue from './core/Vue';
const vue = new Vue({
    ele:"#app",
    data:{
        a:1,
        b:2
    }
});
vue._data.a = {
    aa: {
        aaa:123
    }
}
console.log(vue._data.a,vue.a)
