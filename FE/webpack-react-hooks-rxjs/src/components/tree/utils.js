export function bfTree(tree = [], cb) {
    let queue = [],
        level = 0
    for (let i = 0; i < tree.length; i++) {
        tree[i].level = 0
        queue.push(tree[i])
    }
    while (queue.length != 0) {
        let item = queue.shift()
        cb && cb(item)
        if (item.children) {
            for (let i = 0; i < item.children.length; i++) {
                item.children[i].level = item.level + 1
                queue.push(item.children[i])
            }
        }
    }
}