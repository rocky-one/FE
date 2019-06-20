import React, { Component } from 'react'
import A from '../container/A'
import B from '../container/B'
class Page1 extends Component {
    constructor() {
        super();
    }

    render() {
        return <div className="Page1">
           <A />
           <B />
        </div>
    }
}

export default Page1;