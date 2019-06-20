import { BehaviorSubject } from 'rxjs'

export const store$ = new BehaviorSubject({
    list: [{ name: 1, id: 1 }, { name: 2, id: 2 }]
})