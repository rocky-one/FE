## react事件机制 ##

1. react将所有的事件都代理到document上，然后统一由dispatchEvent触发。
2. 合成事件是由冒泡机制不断冒泡的顶层执行相应的事件回调，react中的e.stopPropagation是经过包装后的并不是原生的stopPropagation。
3. 合成事件(阻止冒泡)不会影响原生事件。因为调用的是react自己的e.stopPropagation。
4. 原生事件(阻止冒泡)会影响合成事件。因为react合成事件是基于冒泡实现的，原生的不冒泡了自然影响react的事件机制。
5. react中e.nativeEvent才是原生的event对象， e.nativeEvent.stopImmediatePropagation可以阻止重复绑定的事件执行。