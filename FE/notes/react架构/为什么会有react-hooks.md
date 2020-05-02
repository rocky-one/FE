## 为什么会有react-hooks ##

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