import {isObject} from './utils';
class Observe {
    constructor(data){
        // super();
        this.initObserve(data);
    }
    initObserve(data){
        Object.keys(data).forEach(key=>{
            let value = data[key];
            let child = null;
            if(isObject(value)){
                observes(value);
            }
            Object.defineProperty(data,key,{
                enumerable: true,
                get(){
                    return value;
                },
                set(newValue){
                    if(newValue === value) return;
                    value = newValue;
                    if(isObject(newValue)){
                        child = observes(newValue);
                    }
                }
            })
        })
    }
    
}
export const observes = (data) => {
    return new Observe(data)
}
export default observes;