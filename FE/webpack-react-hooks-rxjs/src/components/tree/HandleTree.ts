import { HandleTreeInterface, TreeData, NodeItem, TransformItem } from './interface'
import { bfTree, dfsTree } from './utils'

export default class HandleTree implements HandleTreeInterface {
    constructor(option: { data: any; }) {
        this.mapData(option.data)
        this.initViewData()
        //this.data = dfsTree(option.data)
    }
    private data: Array<NodeItem>
    private viewData: Array<NodeItem>

    public getData = () => this.data
    public getViewData = () => this.viewData
    private treeData: TreeData = {}

    private getShowChildData = (item) => {
        const mapData = this.treeData[item.level + 1][item.id]
        const child = []
        dfsTree(mapData, c => {
            const {
                children,
                ...other
            } = c
            if (item.level + 1 == c.level) {
                child.push(other)
                if (!c.open) return false
            } else {
                child.push(other)
            }

        })
        return child
    }
    private initViewData = () => {
        const dataMap = this.treeData['0']
        const data = Object.values(dataMap)
        this.viewData = data[0].map(item => {
            const {
                children,
                ...other
            } = item
            return other
        })
        for (let i = 0; i < this.viewData.length; i++) {
            const item = this.viewData[i]
            if (item.open && item.hasChildren) {
                const child = this.getShowChildData(item)
                let len = child.length
                this.viewData.splice(i + 1, 0, ...child)
                i += len
            }
        }
        // dfsTree(this.viewData, (item: NodeItem) => {
        //     if (item.open) {
        //         item.children = this.treeData[item.level][item.parentId]
        //     }
        // })

    }
    private mapData = (data: []) => {
        const dat = this.treeData
        bfTree(data, (item: NodeItem) => {
            const parentId = item.parentId || 'root'
            const level = item.level
            if (!dat[level]) dat[level] = {}
            if (!dat[level][parentId]) dat[level][parentId] = []
            if (item.children) {
                item.hasChildren = true
            }
            dat[`${level}`][parentId].push(item)
        })
        this.treeData = dat
    }
}