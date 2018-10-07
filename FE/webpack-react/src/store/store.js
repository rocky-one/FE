import AppStoreClass from './appStore';

export const AppStore = AppStoreClass;

export default AppStore;

export const createStoreMap = () => ({
    appStore: new AppStore(),
})
