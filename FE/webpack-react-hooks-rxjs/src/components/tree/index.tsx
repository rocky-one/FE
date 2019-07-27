import * as React from 'react'
import HandleTree from './HandleTree'
import { HandleTreeInterface, TreeData, NodeItem, TransformItem } from './interface'
import Node from './Node'

interface TreeProps<T> {
    data: T[]
}
interface TreeState<T> {
    data: Array<NodeItem>
}

export default class Tree<T> extends React.Component<TreeProps<T>, TreeState<T>> {
    constructor(props: TreeProps<T>) {
        super(props)
        this.state = {
            data: []
        }
    }
    handleTree: any
    componentDidMount() {
        this.handleTree = new HandleTree({
            data: this.props.data
        })
        this.setState({
            data: this.handleTree.getViewData()
        })
    }
    renderArrow = () => {
        
    }
    render() {
        const {
            data
        } = this.state
        return <div className="list">
            {data.map((item: NodeItem) => <div key={item.id} >
                <Node item={item} />
            </div>)}
        </div>
    }
}