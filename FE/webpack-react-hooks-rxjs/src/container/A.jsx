import React, { useState, useEffect } from 'react'
import { store$ } from '../store'
export default function A() {
    const [count, setCount] = useState(0)
    const [list, setList] = useState([])
    useEffect(() => {
        store$.subscribe(store => {
            setList(store.list)
        })
    }, [])
    return (
        <div>
            <div>A模块</div>
            <div>count: {count}</div>
            {
                list.map(item => <div key={item.id}>{item.name}</div>)
            }
            <button onClick={() => {
                store$.next({ list: [{ name: 11, id: 1 }, { name: 22, id: 2 }] })
                setCount(count + 1)
            }}>点击</button>
        </div>
    )
}