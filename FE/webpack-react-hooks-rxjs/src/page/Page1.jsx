import React, { Component } from 'react'
import A from '../container/A'
import B from '../container/B'
import C from '../container/C'
import Tree from '../components/tree'
class Page1 extends Component {
    constructor() {
        super();
        this.myRefC = React.createRef();
    }
    componentDidMount() {
        console.log(this.myRefC,'smyRef')
    }
    render() {
        return <div className="Page1">
           <A />
           <B />
           <C ref={this.myRefC}/>
           <Tree data={[{name:123,id:1}]} />
        </div>
    }
}

export default Page1;