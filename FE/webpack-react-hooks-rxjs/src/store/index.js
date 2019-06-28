<<<<<<< HEAD
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

const getUsers = ajax({
    url: 'https://httpbin.org/delay/2',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'rxjs-custom-header': 'Rxjs'
    },
    body: [{ name: '哈哈', id: 1 }, { name: '哈哈2', id: 2 }]
})




class StoreFactory {
    constructor(state$, option) {
        this.name = option.name
        this.state = option.state || {}
        this.state$ = state$
        this.reducers = option.reducers
        this.effect = option.effect
    }
    runReducer = (action) => {
        this.state = this.reducers[action.type](action, this.state)
        this.state$.next(this.state)
    }
    runEffect = (action) => {
        this.effect[action.type](action.payload.params)
    }

=======
import { BehaviorSubject } from "rxjs";
import React from 'react'
class StoreFactory {
  constructor(state$, option) {
    this.name = option.name;
    this.state = option.state || {};
    this.state$ = state$;
    this.reducers = option.reducers;
    this.effects = option.effects;
  }
  runReducer = action => {
    this.state = this.reducers[action.type](action, this.state);
    this.state$.next(this.state);
  };
  runEffect = action => {
    this.effects[action.type](action.payload.params);
  };
>>>>>>> fb74ae8c050e3dab798d80035a763236f77c86f6
}

class modelMap {
  constructor(option) {
    this.modelMap = {};
  }
  add = (modelName, store) => {
    if (this.modelMap[modelName]) {
      throw "Template name already exists";
    }
    this.modelMap[modelName] = store;
  };
  remove = modelName => {
    if (this.modelMap[modelName]) {
      this.modelMap[modelName] = null;
	  delete this.modelMap[modelName];
	  return true
	}
	return false
  };
  getModelMap = () => {
    return this.modelMap;
  };
  getModelState = modelName => {
    if (this.modelMap[modelName]) {
      return this.modelMap[modelName].state;
    }
    return null;
  };
}

const mIns = new modelMap();

export const createStore = model => {
  const state$ = new BehaviorSubject(model.state);
  const store = new StoreFactory(state$, model);
  mIns.add(model.name, store);
  return {
    state$,
    effects: store.effects
  };
};

export const removeStore = modelName => {
  return mIns.remove(modelName);
};

export const dispatch = (action) => {
  if (action.payload.hasOwnProperty("data")) {
    mIns.modelMap[action.name]["runReducer"](
      action,
      mIns.getModelState(action.name)
    );
  } else {
    mIns.modelMap[action.name]["runEffect"](
      action,
      mIns.getModelState(action.name)
    );
  }
}

export const getStore = (storeName) => {
  return mIns.getModelState(storeName);
}

<<<<<<< HEAD
export function getState(storeName) {
    return mIns.getModelState(storeName)
}

export const storeA = creatStore({
    // store 名称 需唯一
    name: 'workbook',
    // 组件 state 
    state: {
        list: [{ name: '咕噜', id: 3 }]
    },
    // 处理state 生成新的state
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
    // 副作用处理
    effect: {
        getList: (params) => {
            getUsers.subscribe(res => {
                dispatch({
                    name: 'workbook',
                    type: 'getList',
                    payload: {
                        data: JSON.parse(res.response.data)
                    }
                })
            })
        },
        addList: (params) => {
            dispatch({
                name: 'workbook',
                type: 'addList',
                payload: {
                    data: params
                }
            })
=======
export const inject = () => {
    return (Com) => {
        return (props) => {
            console.log(Com, props)
            return <Com {...props} />
>>>>>>> fb74ae8c050e3dab798d80035a763236f77c86f6
        }
    }
    
}