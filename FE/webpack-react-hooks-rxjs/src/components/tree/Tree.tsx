import * as React from 'react'
import HandleTree from './HandleTree'
import { HandleTreeInterface, NodeItem, TransformItem } from './interface'
import Node from './Node'
import './tree.css'
interface TreeProps<T> {
    data: T[],
    onOpen?: (item: NodeItem) => void,
    onClose?: (item: NodeItem) => void,
    loadData?: (item: NodeItem) => Promise<void>,
    width?: number,
    height?: number,
    nodeHeight?: number,
    treeRef?: any,
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
    treeRef: any
    componentDidMount() {
        this.handleTree = new HandleTree({
            data: this.props.data
        })
        this.setState({
            data: this.handleTree.getViewData()
        })
    }
    onOpen = (item: NodeItem) => {
        const {
            loadData,
        } = this.props
        if (!item.requested) {
            if (loadData && typeof loadData === 'function') {
                loadData(item).then(child => {
                    this.handleTree.insertChild(item, child)
                    this.setState({
                        data: this.handleTree.getViewData()
                    })
                })
            }
        } else {
            this.handleTree.open(item)
            this.setState({
                data: this.handleTree.getViewData()
            })
        }

    }
    onClose = (item: NodeItem) => {
        this.handleTree.close(item)
        this.setState({
            data: this.handleTree.getViewData()
        })
    }
    setTreeRef = (node: any) => {
        if (!this.treeRef) {
            this.treeRef = node
            this.setState({})
        }
    }
    onScroll = () => {
        this.setState({})
    }
    renderChild = () => {
        if (!this.treeRef) return null
        const {
            data
        } = this.state
        const {
            nodeHeight = 30,
        } = this.props
        const height = this.treeRef.offsetHeight
        const startIndex = Math.floor(this.treeRef.scrollTop / nodeHeight)
        let viewDataLen = Math.ceil(height / nodeHeight) + 1
        let end = false
        if (startIndex + viewDataLen >= data.length) {
            viewDataLen-=1
            end = true
        }
        const newData = data.slice(startIndex, startIndex + viewDataLen)
        const sumHeight = nodeHeight * data.length
        const topHeight = startIndex * nodeHeight
        const middleHeight = height + (end ? 0 : nodeHeight)
        const bottomHeight = sumHeight - middleHeight - topHeight
        return [
            <div key="top" style={{ height: `${topHeight}px` }}></div>,
            <div key="middle" style={{ height: `${middleHeight}px`, overflow: 'hidden' }}>
                {
                    newData.map((item: NodeItem) => <div key={item.id} >
                        <Node item={item}
                            onOpen={this.onOpen}
                            onClose={this.onClose}
                            nodeHeight={nodeHeight} />
                    </div>)
                }
            </div>,
            <div key="bottom" style={{ height: `${bottomHeight}px` }}></div>
        ]
    }
    render() {
        const {
            width,
            height,
        } = this.props
        return <div className="list"
            style={{
                width: width ? `${width}px` : 'auto',
                height: height ? `${height}px` : 'auto',
                overflow: 'auto',
            }}
            ref={this.setTreeRef}
            onScroll={this.onScroll}>
            {this.renderChild()}
        </div>
    }
}