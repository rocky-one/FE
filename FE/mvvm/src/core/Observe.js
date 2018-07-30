import { isObject } from './utils';
// class Dep {
//     constructor(option){
//         this.subs = [];
//     }
//     addSub(sub){
//         this.subs.push(sub)
//     }
//     notify(){
//         this.subs.forEach(sub=>{
//             sub.update()
//         })
//     }
// }
// class Watcher{
//     constructor(fn){
//         this.fn=fn;
//     }
//     update(){
//         this.fn();
//     }
// }
class Observe {
    constructor(data) {
        // super();
        console.log(data,'data')
        this.initObserve(data);
    }
    initObserve(data) {
        Object.keys(data).forEach(key => {
            let value = data[key];
            let child = null;
            if (isObject(value)) {
                new Observe(value);
            }
            Object.defineProperty(data, key, {
                enumerable: true,
                get() {
                    return value;
                },
                set(newValue) {
                    if (newValue === value) return;
                    value = newValue;
                    if (isObject(newValue)) {
                        child = new Observe(value);
                    }
                }
            });
        })
    }

}
export const observes = (data) => {
    if(typeof data !=='object') return
    return new Observe(data)
}
export default Observe;