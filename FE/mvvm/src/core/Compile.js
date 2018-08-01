import { Watcher } from './Observe'
class Compile {
    constructor(ele, vm) {
        vm.$ele = document.querySelector(ele);
        let fragment = document.createDocumentFragment();
        let child = vm.$ele.firstChild;
        while (child) {
            fragment.appendChild(child);
            child = vm.$ele.firstChild;
        }
        function replace(fragment) {
            Array.from(fragment.childNodes).forEach((node) => {
                let text = node.textContent;
                let reg = /\{\{(.*)\}\}/
                if (node.nodeType === 3 && reg.test(text)) {
                    let list = RegExp.$1.split('.'); // 对象 a.b => [a,b]
                    let data = vm;
                    list.forEach(key => { // 循环取出 this.a.b
                        data = data[key]
                    });
                    console.log('new')
                    new Watcher(vm,RegExp.$1,(v)=>{
                        node.textContent = text.replace(/\{\{(.*)\}\}/, v);
                    });
                    node.textContent = text.replace(/\{\{(.*)\}\}/, data);
                }
                if (node.childNodes) {
                    replace(node)
                }
            })
        }
        replace(fragment)
        vm.$ele.appendChild(fragment);
    }
}
export default Compile;