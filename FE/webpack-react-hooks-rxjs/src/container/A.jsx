import React, { useState, useEffect } from 'react'
import { stmA, dispatch } from '../store'


export default function A() {

    const [count, setCount] = useState(0)
    const [list, setList] = useState([])
    useEffect(() => {
        
        dispatch({
            name: 'workbook',
            type: 'getList',
            payload: {
                params: null
            }
        })
        stmA.state$.subscribe(store => {
            console.log(stmA.state$.getValue(),4455)
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
                dispatch({
                    name: 'workbook',
                    type: 'addList',
                    payload: {
                        data: {
                            name: `${Math.random() * 1000}`,
                            id: Math.random()
                        }
                    }
                })
                setCount(count + 1)
            }}>点击</button>

        </div>
    )
}