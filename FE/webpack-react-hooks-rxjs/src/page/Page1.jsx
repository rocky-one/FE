import React, { Component } from 'react'
// import A from '../container/A'
// import B from '../container/B'
// import C from '../container/C'
import Tree from '../components/tree'
class Page1 extends Component {
    constructor() {
        super();
        this.myRefC = React.createRef();
    }
    componentDidMount() {
       
    }
    render() {
        return <div className="Page1">
           {/* <A />
           <B />
           <C ref={this.myRefC}/> */}
           <Tree data={[{
                name: '1',
                parentId: null,
                id: '1',
                open: true,
                children: [
                    {
                        parentId: '1',
                        id: '1.1',
                        name: '1-1',
                        children: [
                            {
                                name: '1-1-1',
                                id:'1.1.1',
                                parentId: '1.1'
                            }
                        ]
                    },
                    {
                        parentId: '1',
                        id: '1.2',
                        name: '1-2',
                        open: true,
                        children: [
                            {
                                name: '1-1-2',
                                id:'1.1.2',
                                parentId: '1.2'
                            }
                        ]
                    }
                ]
            },
            {
                name: '2',
                parentId: null,
                id: '2',
                open: true,
                children: [
                    {
                        name: '2.2',
                        id: '2.2',
                        parentId: '2'
                    }
                ]
            }]} />
        </div>
    }
}

export default Page1;