import { isObject } from './utils';
class Dep {
    constructor(option) {
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub)
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}
class Watcher {
    constructor(vm, exp, fn) {
        this.vm = vm;
        this.exp = exp;
        this.fn = fn;
        Dep.target = this;
        let data = vm;
        let list = exp.split('.');
        list.forEach(k => {
            data = data[k]
        });
        Dep.target = null;
    }
    update() {
        let data = this.vm;
        let list = this.exp.split('.');
        
        list.forEach(k => {
            data = data[k]
        });
        this.fn(data);
    }
}
export { Watcher }
class Observe {
    constructor(data) {
        // super();
        this.initObserve(data);
    }
    initObserve(data) {
        let dep = new Dep();
        Object.keys(data).forEach(key => {
            let value = data[key];
            let child = null;
            if (isObject(value)) {
                new Observe(value);
            }
            Object.defineProperty(data, key, {
                enumerable: true,
                get() {
                    console.log(Dep.target,1122)
                    Dep.target && dep.addSub(Dep.target)
                    return value;
                },
                set(newValue) {
                    if (newValue === value) return;
                    value = newValue;
                    if (isObject(newValue)) {
                        child = new Observe(value);
                    }
                    dep.notify();
                }
            });
        })
    }

}
export const observes = (data) => {
    if (typeof data !== 'object') return
    return new Observe(data)
}
export default Observe;