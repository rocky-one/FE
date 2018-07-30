import Observe from './Observe';
import Compile from './Compile';

class Vue {
    constructor(options = {}) {
        // super(options);
        this.$options = options;
        // 通过set get 只能访问带下划线的属性 否则报错
        this._data = this.$options.data || {};

        this.observes = new Observe(this._data);
        Object.keys(this._data).forEach(key => {
            this.proxyData(key);
        });
        new Compile(this.$options.ele,this)
    }
    // 数据代理到 this上
    proxyData(key) {
        const self = this;
        Object.defineProperty(self, key, {
            enumerable: true,
            get() {
                return self._data[key]
            },
            set(newValue) {
                self._data[key] = newValue
            }
        })
    }
}

export default Vue;
