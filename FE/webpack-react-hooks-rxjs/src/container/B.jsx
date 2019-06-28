import React, { useState, useEffect } from 'react'
<<<<<<< HEAD
import { storeA } from '../store'
=======
import {stmA} from './storeA'
>>>>>>> fb74ae8c050e3dab798d80035a763236f77c86f6
export default function B() {
    const [count, setCount] = useState(0)
    const [list, setList] = useState([])
    useEffect(() => {
        storeA.state$.subscribe(store => {
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

