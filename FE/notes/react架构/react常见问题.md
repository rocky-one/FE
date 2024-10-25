## react
1. class组件和函数组件
2. 数据驱动UI，单项数据流
3. 虚拟dom，diff对比
4. 

### 受控组件和非受控组件
1. 受控组件：表单数据由react state管理，我们可以控制state的具体值。
2. 非受控组件：表单数据由Dom管理，没有state管理，例如input是用户输入，无法控制。

### 高阶组件
一个函数接受一个组件作为参数，最终返回一个组件出去。
优点：
    1. 代码逻辑复用
    2. 渲染劫持(权限控制)
    3. props更改，增强
缺点：
    1. props容易被覆盖


### render过程
1. 分为两大阶段render阶段和commit阶段
2. react.createElement生成vdom，初次渲染根据vdom生成fiber Tree。如果是更新渲染，新的vdom和老的fiber进行对比。
3. render阶段是构造fiber结构和diff对比的过程，这个过程可以中断。
4. commit阶段根据render阶段的计算结果进行dom渲染，此过程不可中断。


### React.forwardRef
1. 使得父组件可以访问子组件的ref
2. useImperativeHandle暴露一些子组件的方法给父组件使用
```
const InputEl = forwardRef((props: {}, ref: Ref<any>): JSX.Element=>{
    const inputEl: MutableRefObject<any> = useRef();

    useImperativeHandle(ref, ()=>({//第一个参数：暴露哪个ref；第二个参数：暴露什么
        value: (inputEl.current as HTMLInputElement).value,
        getType: () => (inputEl.current as HTMLInputElement).type,
        focus: () => (inputEl.current as HTMLInputElement).focus()
    }));

    return(
        <input ref={inputEl} type="text" {...props}/>
    )
})

```


### react 组件错误拦截
```
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

```
1. 事件不能被errorBoundary捕获
2. 异步错误不能被捕获
3. 自身错误不能捕获，只能捕获子组件错误

## 生命周期

挂载过程：

constructor
getDerivedStateFromProps
render
componentDidMount


更新过程：

getDerivedStateFromProps
shouldComponentUpdate
render
getSnapshotBeforeUpdate
componentDidUpdate


卸载过程：
componentWillUnmount

## 生命周期替换
componentWillReceiveProps => getDerivedStateFromProps （props发生变化的生命周期）

componentWillUpdate => getSnapshotBeforeUpdate(render前执行)，返回的值会被传到 componentDidUpdate的第三个参数中


## useEffect和useLayoutEffect区别
1. useEffect 是异步执行的，而useLayoutEffect是同步执行的。
2. useEffect 的执行时机是浏览器完成渲染之后，而 useLayoutEffect 的执行时机是浏览器把内容真正渲染到界面之前，和 componentDidMount 等价。解决闪烁问题


