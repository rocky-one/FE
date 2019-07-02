import * as React from 'react';
import HandleTree from './HandleTree'

new HandleTree({
    data:[{
        name:1,
        parentId: null,
        id: 1,
        children: [
            {
                parentId:1,
                id:1.1,
                name: '1-1',
                children: [
                    {
                        name: '1-1-1',
                        parentId: 1.1
                    }
                ]
            }
        ]
    },
    {
        name:2,
        parentId: null,
        id:2,
        children:[
            {
                name: 2.2,
                id: 2.2,
                parentId: 2
            }
        ]
    }]
})
interface TreeProps {
    data: any[]
}
export default class Tree extends React.Component<TreeProps, any> {
    
    render() {
        const {
            data
        } = this.props

        return <div className="list">
            {data.map(item=><div key={item.id}>{item.name}</div>)}
        </div>
    }
}