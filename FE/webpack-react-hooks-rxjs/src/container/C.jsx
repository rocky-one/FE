import React, { Component } from 'react'
import { inject } from '../store'
class C extends Component {
    constructor(props) {
        super(props);
        this.state={
            list:[]
        }
    }
    static displayName = 'C'
    
    componentDidMount() {
    }
    setList = () =>{
        this.setState({
            list:[{name:33333,id:4}]
        })
    }
    render() {
        return <div>
            C模块
            {this.state.list.map(item=><div key={item.id}>{item.name}</div>)}
        </div>
    }
}
function mapStateToProps(state, props) {
    return {
        list: state.workbook.list
    }
}
export default inject(mapStateToProps, { forwardedRef: true })(C)
