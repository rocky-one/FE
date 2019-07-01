import { HandleTreeInterface } from './interface'
import { bfTree } from './utils'

export default class HandleTree implements HandleTreeInterface {
    constructor(option: any) {
        this.transData(option.data)
    }
    private data = {}
    private transData = (data: []) => {
        bfTree(data, (item: any) => {
            
        })
    }
}