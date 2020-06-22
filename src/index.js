import forEach from 'lodash/forEach';

export const initialState = {
    linkedStores: undefined
};

export const actions = {
    setLinkedStores: linkedStores => ({ setState }) => setState({ linkedStores }),
    getLinkedStores: () => ({ getState }) => getState().linkedStores,
    getLinkedStore: store => ({ getState }) => getState().linkedStores[store]
};

export const selector = state => {
    const newState = { ...state };
    newState.linkedStores = undefined;
    delete newState.linkedStores;
    return newState;
};

export const linkStores = linkedStores => {
    forEach(linkedStores, storeActions => {
        storeActions.setLinkedStores(linkedStores);
    });
};
