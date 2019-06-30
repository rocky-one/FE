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
            if(action.payload.data){
                const s = state
                state.list = [...s.list, action.payload.data]
                return state
            }
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
                    data: action.payload.params
                }
            })
        }
    }
})

export const storeB = createStore({
    name: 'workbookB',
    state: {
        list: [{ name: '咕噜B', id: 3 }],  
        list2: [{ name: 'gitB', id: 3234 }]
    },
    reducers: {
        getList: (action, state) => {
            state.list = action.payload.data
            return state
        },
        addList: (action, state) => {
            //if(action.payload.data){
                state.list.push(action.payload.data)
            //}
            return state
        }
    },
    effects: {
        getList: (params) => {
            setTimeout(() => {
                dispatch({
                    name: 'workbookB',
                    type: 'getList',
                    payload: {
                        data: [{ name: 'jjjjBBB', id: 3 }]
                    }
                })
            }, 1000)
        },
        addList: (action, state) => {
            dispatch({
                name: 'workbookB',
                type: 'addList',
                payload: {
                    data: action.payload.params
                }
            })
        }
    }
})