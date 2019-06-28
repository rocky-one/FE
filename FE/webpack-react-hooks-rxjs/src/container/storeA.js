import { createStore, dispatch } from '../store'

export const storeA = createStore({
    name: 'workbook',
    state: {
        list: [{ name: '咕噜', id: 3 }],  
        list2: [{ name: 'git', id: 3234 }]
    },
    reducers: {
        getList: (action, state) => {
            state.list = action.payload.data
            return state
        },
        addList: (action, state) => {
            state.list.push(action.payload.data)
            return state
        }
    },
    effects: {
        getList: (params) => {
            setTimeout(() => {
                dispatch({
                    name: 'workbook',
                    type: 'getList',
                    payload: {
                        data: [{ name: 'jjjj', id: 3 }]
                    }
                })
            }, 1000)
        },
        addList: (action, state) => {
            dispatch({
                name: 'workbook',
                type: 'addList',
                payload: {
                    data: { name: Math.random(), id: Math.random() }
                }
            })
        }
    }
})