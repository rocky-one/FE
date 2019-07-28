import React, { Component } from 'react'
// import A from '../container/A'
// import B from '../container/B'
// import C from '../container/C'
import Tree from '../components/tree/Tree'
const data = [{
    name: '1',
    parentId: null,
    id: '1',
    open: true,
    children: [
        {
            parentId: '1',
            id: '1.1',
            name: '1-1',
            isLeaf: true,
        },
        {
            parentId: '1',
            id: '1.2',
            name: '1-2',
            open: true,
            children: [
                {
                    name: '1-1-2',
                    id: '1.1.2',
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
}]
for (let i = 0; i < 100; i++) {
    data.push({
        name: (3 + i).toString(),
        parentId: null,
        id: (3 + i).toString(),
    })
}
class Page1 extends Component {
    constructor() {
        super();
        this.myRefC = React.createRef();
    }
    componentDidMount() {

    }
    loadData = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([{
                    name: '哈哈',
                    id: '1.1.1',
                    parentId: '1.1',
                }])
            }, 1000)
        })
    }
    onOpen = (item) => {
        console.log(item, 'onOpen')
    }
    render() {
        return <div className="Page1">
            {/* <A />
           <B />
           <C ref={this.myRefC}/> */}
            <Tree data={data}
                onOpen={this.onOpen}
                loadData={this.loadData}
                width={200}
                height={300}
                nodeHeight={30} />
        </div>
    }
}

export default Page1;