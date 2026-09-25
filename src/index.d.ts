export interface LinkedStoresState {
    linkedStores?: Record<string, any>;
}

export const initialState: LinkedStoresState;

export const actions: {
    setLinkedStores: (linkedStores: any) => ({ setState }: any) => void;
    getLinkedStores: () => ({ getState }: any) => any;
    getLinkedStore: (store: string) => ({ getState }: any) => any;
};

export const selector: <T = any>(state: T) => T;

export const linkStores: (linkedStores: Record<string, any>) => void;
