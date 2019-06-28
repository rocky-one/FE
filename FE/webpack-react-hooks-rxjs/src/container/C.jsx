import React, { Component } from 'react'
import { inject } from '../store'
class C extends Component {
    constructor() {
        super();
    }
    componentDidMount() {
    }
    render() {
        return <div>
           C模块
        </div>
    }
}

function mapStateToProps (state,props){
    return {
        list: state.workbook.list
    }
}
export default inject(mapStateToProps)(C)
