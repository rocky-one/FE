import React, { useState, useEffect } from 'react'
<<<<<<< HEAD
import { storeA, dispatch } from '../store'


export default function A() {
=======
import { dispatch, inject } from '../store'
import {stmA} from './storeA'
function A() {
>>>>>>> fb74ae8c050e3dab798d80035a763236f77c86f6

    const [count, setCount] = useState(0)
    const [list, setList] = useState([])
    useEffect(() => {
        // dispatch({
        //     name: 'workbook',
        //     type: 'getList',
        //     payload: {
        //         params: null
        //     }
        // })
        storeA.model.effect.getList()
        
        storeA.state$.subscribe(store => {
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
                // dispatch({
                //     name: 'workbook',
                //     type: 'addList',
                //     payload: {
                //         params: {
                //             name: `${Math.random() * 1000}`,
                //             id: Math.random()
                //         }
                //     }
                // })
                storeA.model.effect.addList({
                    name: `${Math.random() * 1000}`,
                    id: Math.random()
                })
                setCount(count + 1)
            }}>点击</button>

        </div>
    )
}

export default inject()(A)