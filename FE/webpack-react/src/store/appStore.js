import {
    observable,
    computed,
    action,
} from 'mobx';

export class AppState {
    @observable count = 0;

    @observable name = 'rocky';

    @computed get msg() {
        return `${this.name} say cont ${this.count}`;
    }

    @action add() {
        this.count += 1;
    }

    @action changeName(name) {
        this.name = name;
    }
}

const appStore = new AppState();

export default appStore;
