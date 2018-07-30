let child = null;
class Compile{
    constructor(ele,vm){
        vm.$ele = document.querySelector(ele);
        let fragment= document.createDocumentFragment();
        child = vm.$ele.firstChild;
        // Array.from(child).forEach((node)=>{
        //     fragment.appendChild(node);
        //     vm.$ele.removeChild(node);
        // })
        while(child){
            fragment.appendChild(child);
            child = vm.$ele.firstChild;
        }
        function replace(fragment){
            Array.from(fragment.childNodes).forEach((node)=>{
                let text = node.textContent;
                let reg = /\{\{(.*)\}\}/
                if(node.nodeType ===3 && reg.test(text)){
                    console.log(RegExp.$1,'111')
                }
                if(node.childNodes){
                    replace(node)
                }
            })
        }
        replace(fragment)
        vm.$ele.appendChild(fragment);
    }
}
export default Compile;