import * as React from 'react';
import { NodeItem } from './interface'

interface NodeProps {
    item: NodeItem
}
export default class Node extends React.Component<NodeProps>  {
    constructor(props: NodeProps) {
        super(props)
        this.state = {

        }
    }
    renderArrow = () => {
        const {
            item
        } = this.props
        const style = { marginLeft: `${item.level * 10}px`,cursor: 'pointer' }
        if (item.hasChildren) {
            if (!item.open) {
                return <span style={style} >+</span>
            }
            return <span style={style} >-</span>
        }
        return <span style={style} ></span>
    }
    render() {
        const {
            item
        } = this.props

        return <div>
            
            {this.renderArrow()}
            <span >{item.name}</span>
        </div>
    }
}