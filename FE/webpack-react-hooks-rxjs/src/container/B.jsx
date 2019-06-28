import React, { useState, useEffect } from 'react'
import { dispatch, inject } from '../store'
import {storeA} from './storeA'

function B(props) {
    const [count, setCount] = useState(0)
    const [list2, setList] = useState(props.list2)
    // useEffect(() => {
    //     storeA.state$.subscribe(store => {
    //         setList(store.list)
    //     })
    // }, [])
    return (
        <div>
            <div>B模块</div>
            <div>count: {count}</div>
            <button onClick={() => { setCount(count + 1) }}>点击</button>
            {
                list2.map(item => <div key={item.id}>{item.name}</div>)
            }
        </div>
    )
}

function mapStateToProps (state){
    return {
        list2: state.workbook.list2
    }
}
export default inject(mapStateToProps)(B)