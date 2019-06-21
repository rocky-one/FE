import { BehaviorSubject } from 'rxjs'
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { Rx } from 'rxjs'
const obs$ = ajax.getJSON(`https://api.github.com/users?per_page=5`).pipe(
  map(userResponse => console.log('users: ', userResponse))
);
obs$.subscribe(res=>{
    console.log(res,456)
})

class StoreFactory {
    constructor(state$, option) {
        this.name = option.name
        this.state = option.state || {}
        this.state$ = state$
        this.producer = option.producer
        this.effect = option.effect
    }

    runProducer = (action) => {
        //this.state = 
        this.producer[action.type](action, this.state)
        //this.state$.next(this.state)
    }

    runEffect = (action) => {
        this.state = this.effect[action.type](action.payload.params)
        this.state$.next(this.state)
    }
}

const storeMap = {}

export const stm = (model) => {
    const state$ = new BehaviorSubject(model.state)
    const store = new StoreFactory(state$, model)
    storeMap[model.name] = store
    return state$
}

export function dispatch(action) {
    const run = action.payload.data ? storeMap[action.name]['runProducer'] : storeMap[action.name]['runEffect']
    
    run(action)
}

export const stmA$ = stm({
    name: 'workbook',
    state: {
        list: []
    },
    producer: {
        getList: (action, state) => {
            console.log(action,'action')
            state.list = action.paload.data
            return state
        },
        addList: (action, state) => {
            state.list.push(action.payload.data)
            return state
        }
    },
    effect: {
        getList: (params) => {
            ajax(`https://api.github.com/users?per_page=5`).pipe(
                map(res => {
                    console.log(res, 'res')
                    dispatch({
                        name: 'workbook',
                        type: 'getList',
                        payload: {
                            data: [{
                                name: `${Math.random() * 10000}`,
                                id: Math.random()
                            }, {
                                name: `${Math.random() * 1000}`,
                                id: Math.random()
                            }]
                        }
                    })
                })
            )
        }
    }
})