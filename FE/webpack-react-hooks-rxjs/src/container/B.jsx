import React, { useState, useEffect } from 'react'
import { stmA } from '../store'
export default function B() {
    const [count, setCount] = useState(0)
    const [list, setList] = useState([])
    useEffect(() => {
        stmA.state$.subscribe(store => {
            setList(store.list)
        })
    }, [])
    return (
        <div>
            <div>B模块</div>
            <div>count: {count}</div>
            <button onClick={() => { setCount(count + 1) }}>点击</button>
            {
                list.map(item => <div key={item.id}>{item.name}</div>)
            }
        </div>
    )
}