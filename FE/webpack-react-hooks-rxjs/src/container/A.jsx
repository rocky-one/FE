import React, { useState, useEffect } from 'react'
import { dispatch, inject } from '../store'

function A(props) {
    // const [list, setList] = useState(props.list)
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
    console.log(999)
    return (
        <div>
            <div>A模块</div>

            {
                props.list.map(item => <div key={item.id}>{item.name}</div>)
            }
            <button onClick={() => {
                dispatch({
                    name: 'workbook',
                    type: 'addList',
                    payload: {
                        params: {
                            name: `${Math.random() * 1000}`,
                            id: Math.random()
                        }
                    }
                })
                // dispatch({
                //     name: 'workbookB',
                //     type: 'addList',
                //     payload: {
                //         params: {
                //             name: `${Math.random() * 1000}`,
                //             id: Math.random()
                //         }
                //     }
                // })
            }}>点击</button>

        </div>
    )
}
function mapStateToProps(state, props) {
    return {
        list: state.workbook.list
    }
}

export default inject(
    (state, props) => ({
        list: state.workbook.list
    }),
    {
        storeName: ['workbook', 'workbookB'],
        propsShallowEqual: true,
        // propsDeepEqual: true,
    }
)(A)