## 为什么会有react-hooks ##

* 解决函数组件状态存储或者说缓存函数组件内部状态问题。react想放弃class组建使用函数组件，首先要解决的就是函数重新执行内部声明的变量会被重置的问题。

* 解决class组件逻辑复用难，或者说不够干净问题。class组件逻辑一般使用高阶组件，但是高阶组件需要依赖class模式，一个业务逻辑并不涉及UI效果时，确要依赖class组件模式就会很奇怪。
使得业务逻辑代码变得复杂，并且会有嵌套深问题。

* 解决react组件生命周期引起的逻辑重复和散落各个地方。下面代码，我们需要在componentDidMount和componentDidUpdate两个生命周期里调用getList方法。逻辑重复而且要再不同的生命周期里做不同的处理。
```javascript
componentDidMount () {
    this.getList(this.props.id)
 }
 componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.getList(this.props.id)
    }
 }
 getList = (id) => {
    fetch(id)
      .then((res) => this.setState({
        list: res.data
      }))
  }
```

* 逻辑共享，消除了react原来高阶组件嵌套的问题，把公用的业务逻辑封装成hooks。
```javascript
function useGetList (id) {
  const [ list, setList ] = React.useState([])

  React.useEffect(() => {
    fetch(id)
      .then((res) => {
        setList(res.data)
      })
  }, [id])

  return [ repos ]
}
// 这样每个组件都可以共用这个hooks

function Component1 ({ id }) {
  const [ list ] = useRepos(id)
  ...
}
function Component2 ({ id }) {
  const [ list ] = useRepos(id)
  ...
}

```

* hooks里消除了react中类的概念、繁琐的生命周期、bind问题。