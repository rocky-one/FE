import { Watcher, WatcherArr } from './Observe';
// 解析 {{}} 中的值 
const getBraceValue = (data, braceStr) => {
    let list = braceStr.split('.'); // 对象 a.b => [a,b]
    let value = data;
    list.forEach(key => { // 循环取出 this.a.b
        // 数组情况下不解析
        if (value[key]) {
            value = value[key]
        }
    });
    return value;
}
// class vForInsertNode {
//     constructor(cm,id){

//     }
// }
const createId = (data) => {
    let idArr = [];
    data.forEach(item => {
        idArr.push(Math.random().toString())
    });
    return idArr;
}
const vForInsertNode = (vm, newExp, that, uuid, insertParentNode) => {
    const oldNode = that['old'+uuid];
    const cloneNode = oldNode.cloneNode(true);
    cloneNode.removeAttribute('v-for');
    let parentNode = null;
    let nextSibling = null;
    let idArr = that[uuid];
    idArr.forEach(id => {
        let nodeId = document.getElementById(id);
        if (nodeId) {
            if (!parentNode) {
                parentNode = nodeId.parentNode;
            }
            nextSibling = nodeId.nextSibling;
            parentNode.removeChild(nodeId);
        }
    });
    let text = cloneNode.textContent;
    let reg = /\{\{(.*)\}\}/;
    let exp = null;
    let value = '';
    if (reg.test(text)) {
        let exps = RegExp.$1.split('.');
        exps.splice(0, 1);
        exp = exps.join('.');
    }
    let newData = vm[newExp];
    if (parentNode || nextSibling) {
        that[uuid] = idArr = createId(newData);
        newData.forEach((item, index) => {
            let cNode = cloneNode.cloneNode(true);
            value = getBraceValue(item, exp);
            cNode.setAttribute('id', idArr[index]);
            cNode.textContent = value;
            if (nextSibling) {
                parentNode.insertBefore(cNode, nextSibling);
            } else if (parentNode) {
                parentNode.appendChild(cNode);
            } 
            // else {
            //     insertParentNode.appendChild(cNode);
            // }
        });
    }

}
class Compile {
    constructor(ele, vm) {
        vm.$ele = document.querySelector(ele);
        let fragment = document.createDocumentFragment();
        let child = vm.$ele.firstChild;
        const that = this;
        while (child) {
            fragment.appendChild(child);
            child = vm.$ele.firstChild;
        }
        function replace(fragment) {
            Array.from(fragment.childNodes).forEach((node) => {
                let text = node.textContent;
                let reg = /\{\{(.*)\}\}/;
                //文本类型
                if (node.nodeType === 3 && reg.test(text)) {

                    let value = getBraceValue(vm, RegExp.$1);
                    new Watcher(vm, RegExp.$1, (v) => {
                        node.textContent = text.replace(/\{\{(.*)\}\}/, v);
                    });
                    node.textContent = text.replace(/\{\{(.*)\}\}/, value);
                }
                // 节点类型
                if (node.nodeType === 1) {
                    let nodeAttrs = node.attributes;
                    let next = node.nextSibling;
                    Array.from(nodeAttrs).forEach(attr => {
                        let name = attr.name;
                        let exp = attr.value;
                        //v-for item in list
                        if (name.indexOf('v-for') === 0) {
                            let expList = exp.split(' ');
                            let newExp = expList[expList.length - 1];
                            let data = vm[newExp];
                            const uuid = Math.random().toString();
                            that['old'+uuid] = node.cloneNode(true);
                            const cloneNode = node.cloneNode(true);
                            cloneNode.removeAttribute('v-for');
                            node.parentNode.removeChild(node);
                            let idArr = createId(data);
                            that[uuid]=idArr;
                            new WatcherArr(vm, idArr, newExp, () => {
                                vForInsertNode(vm, newExp, that, uuid, node.parentNode || fragment)
                            });
                            data.forEach((n, index) => {
                                let insertParentNode = node.parentNode || fragment;
                                let value = '';
                                if (reg.test(text)) {
                                    let exps = RegExp.$1.split('.');
                                    exps.splice(0, 1);
                                    let newExps = exps.join('.');
                                    value = getBraceValue(n, newExps);
                                }
                                let cNode = cloneNode.cloneNode(true);
                                cNode.setAttribute('id', idArr[index]);
                                cNode.textContent = value;
                                if (next) {
                                    insertParentNode.insertBefore(cNode, next);
                                } else {
                                    insertParentNode.appendChild(cNode);
                                }
                            })
                        }
                    })
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