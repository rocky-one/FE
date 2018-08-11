import { isObject } from './utils';
const arrList = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

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
            if (data[k]) {
                data = data[k]
            }
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
class WatcherArr {
    constructor(vm, idArr, exp, fn) {
        this.vm = vm;
        this.idArr = idArr;
        this.fn = fn;
        Dep.target = this;
        vm[exp].splice(0, 0);
        Dep.target = null;
    }
    update() {
        let data = this.vm;
        this.fn(data);
    }
}
export { Watcher, WatcherArr }
class Observe {
    constructor(data) {
        this.initObserve(data);
    }
    initObserve(data) {
        const type = Object.prototype.toString.call(data);
        if (type == '[object Object]') {
            this.observeObj(data);
        } else if (type == '[object Array]') {
            this.observeArray(data);
        }
        return;
    }
    observeObj(data) {
        let dep = new Dep();

        Object.keys(data).forEach(key => {
            let value = data[key];
            let child = null;
            let that = this;
            if (isObject(value) || Array.isArray(value)) {
                this.initObserve(value);
            }
            Object.defineProperty(data, key, {
                enumerable: true,
                get() {
                    Dep.target && dep.addSub(Dep.target)
                    return value;
                },
                set(newValue) {
                    if (newValue === value) return;
                    value = newValue;
                    if (isObject(newValue) || Array.isArray(newValue)) {
                        child = that.initObserve(value);
                    }
                    dep.notify();
                }
            });
        })
    }
    observeArray(data) {
        let arrayPrototype = Object.create(Array.prototype);
        const dep = new Dep();
        arrList.forEach(key => {
            const original = arrayPrototype[key]
            Object.defineProperty(arrayPrototype, key, {
                value: function (newValue) {
                    Dep.target && dep.addSub(Dep.target);
                    let proto = original.apply(data, arguments);
                    dep.notify();
                    return proto;
                },
                enumerable: true,
                writable: true,
                configurable: true,
            })
        });
        data.__proto__ = arrayPrototype;
    }
}
export const observes = (data) => {
    if (typeof data !== 'object') return
    return new Observe(data)
}
export default Observe;