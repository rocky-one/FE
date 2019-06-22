import { BehaviorSubject, queueScheduler, Observable, concat, isObservable, of } from 'rxjs'
import { ajax } from 'rxjs/ajax';
import { map, mergeMap, concatMap, delay } from 'rxjs/operators';


// source
//   .pipe(
//     // 只是为了确保 meregeMap 的日志晚于 concatMap 示例
//     delay(5000),
//     mergeMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
//   )
//   .subscribe(val => console.log(`With mergeMap: ${val}`));
// const log = console.log;
// queueScheduler.schedule(() => {
//     setTimeout(() => {
//         log(1)
//     },12)
// });
// log(2);
// queueScheduler.schedule(() => log(3));

const users = ajax({
    url: 'https://httpbin.org/delay/2',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'rxjs-custom-header': 'Rxjs'
    },
    body: [{ name: '哈哈', id: 1 }, { name: '哈哈2', id: 2 }]
})
const users2 = ajax({
    url: 'https://httpbin.org/delay/2',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'rxjs-custom-header': 'Rxjs'
    },
    body: {
        rxjs: 2
    }
})
const users3 = Observable.create(observer => {
    observer.next('Semlinker');
});

const getList2 = (params) => {
    return ajax({
        url: 'https://httpbin.org/delay/2',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'rxjs-custom-header': 'Rxjs'
        },
        body: {
            rxjs: 111
        }
    })
}

const getList3 = (params) => {
    return ajax({
        url: 'https://httpbin.org/delay/2',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'rxjs-custom-header': 'Rxjs'
        },
        body: {
            rxjs: 222
        }
    })
}
const obs = [users, users2, users3]
// concat(...obs).subscribe(detail => console.log(detail));

// 发出延迟值
// const source = of(2200, 2000);
// const example = source.pipe(
//   concatMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
// );
//  example.subscribe(val =>
//   console.log(`With concatMap: ${val}`)
// );



of(1).pipe(
    map(res => {
        return getList2(res)
    }),
    mergeMap(res => {
        console.log(res,345)
        return getList3(res).pipe(map(res => res))
    })
).subscribe(res => {
    console.log(res, 'ress')
})


// getList2().pipe(
//     map(res => {
//         return res
//     })
// ).pipe(
//     map(res => {
//         console.log(res,345)
//         return getList3(res)
//     })
// ).subscribe(res => {    
//     console.log(res, 'ress')
// })



// const obs$ = ajax(`https://httpbin.org/delay/2`).pipe(
//   map(userResponse => console.log('users: ', userResponse))
// );
// obs$.subscribe(res=>{
//     console.log(res,456)
// })

// ajax.getJSON(`https://api.github.com/users?per_page=5`).pipe(
//     map(res => {
//         console.log(res, 'res')
//     })
// ).subscribe(res => console.log(res, 99))


class StoreFactory {
    constructor(state$, option) {
        this.name = option.name
        this.state = option.state || {}
        this.state$ = state$
        this.producer = option.producer
        this.effect = option.effect
    }

    runProducer = (action) => {

        this.state = this.producer[action.type](action, this.state)
        this.state$.next(this.state)
    }

    runEffect = (action) => {
        this.effect[action.type](action.payload.params)
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
    if (action.payload.hasOwnProperty('data')) {
        storeMap[action.name]['runProducer'](action, storeMap[action.name].state)
    } else {
        storeMap[action.name]['runEffect'](action, storeMap[action.name].state)
    }
}

export const stmA$ = stm({
    name: 'workbook',
    state: {
        list: []
    },
    producer: {
        getList: (action, state) => {
            state.list = action.payload.data
            return state
        },
        addList: (action, state) => {
            state.list.push(action.payload.data)
            return state
        }
    },
    effect: {
        getList: (params) => {
            users.subscribe(res => {
                console.log(res, 'res')
                dispatch({
                    name: 'workbook',
                    type: 'getList',
                    payload: {
                        data: JSON.parse(res.response.data)
                    }
                })
            })
        }
    }
})