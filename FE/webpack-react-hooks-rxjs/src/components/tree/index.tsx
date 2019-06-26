import * as React from 'react';

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