import React, { useState, useEffect } from 'react'
import { dispatch, inject } from '../store'
import {storeA} from './storeA'
const obj = {a:1}
const obj2 = obj
obj2.abc = 123
function A(props) {
    const [count, setCount] = useState(0)
    const [list, setList] = useState(props.list)
    // useEffect(() => {
    //     // dispatch({
    //     //     name: 'workbook',
    //     //     type: 'getList',
    //     //     payload: {
    //     //         params: null
    //     //     }
    //     // })
    //     storeA.effects.getList()
        
    //     storeA.state$.subscribe(store => {
    //         setList(store.list)
    //     })

    // }, [])

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
                storeA.effects.addList({
                    name: `${Math.random() * 1000}`,
                    id: Math.random()
                })
                setCount(count + 1)
            }}>点击</button>

        </div>
    )
}
function mapStateToProps (state,props){
    return {
        list: state.workbook.list
    }
}
export default inject(mapStateToProps)(A)