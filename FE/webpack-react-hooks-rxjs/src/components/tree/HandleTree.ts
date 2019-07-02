import { HandleTreeInterface } from './interface'
import { bfTree } from './utils'

export default class HandleTree implements HandleTreeInterface {
    constructor(option: { data: any; }) {
        this.transData(option.data)
    }
    private data = {}
    private transData = (data: []) => {
        const dat = this.data
        bfTree(data, (item: any) => {
            let pId = item.parentId || 'root'
            if (!dat[item.level]) {
                dat[item.level] = {}
                dat[item.level][pId] = []
            }
            dat[item.level][pId].push(item)
        })
        this.data = dat
        console.log(this.data,345)
    }
}