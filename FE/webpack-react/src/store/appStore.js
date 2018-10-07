import {
    observable,
    computed,
    action,
} from 'mobx';

export default class AppStore {
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

    toJson() {
        return {
            count: this.count,
            name: this.name,
        }
    }
}

// const appStore = new AppState();

// export default appStore;
