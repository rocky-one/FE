import React, { Component } from 'react'
import A from '../container/A'
import B from '../container/B'
import Tree from '../components/tree'
class Page1 extends Component {
    constructor() {
        super();
    }

    render() {
        return <div className="Page1">
           <A a={1} />
           <B />
           <Tree data={[{name:123,id:1}]} />
        </div>
    }
}

export default Page1;