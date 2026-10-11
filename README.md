# `@codexporer.io/expo-link-stores`

Cross-linking utility for `react-sweet-state` stores across decoupled packages, enabling store actions to communicate without circular dependencies or tight package coupling.

## Installation & Peer Dependencies

```bash
yarn add @codexporer.io/expo-link-stores
```

Peer dependencies:
- `lodash` (`*`)
- `react-sweet-state` (`*`)

## Quick Start

### 1. Register Stores at Application Root

At application startup, register decoupled stores using `linkStores()`:

```tsx
import { useEffect } from 'react';
import { linkStores } from '@codexporer.io/expo-link-stores';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';
import { useMessageDialogActions } from '@codexporer.io/expo-message-dialog';

export function StoreLinker() {
  const [, loadingDialogActions] = useLoadingDialogActions();
  const [, messageDialogActions] = useMessageDialogActions();

  useEffect(() => {
    linkStores({
      loadingDialog: loadingDialogActions,
      messageDialog: messageDialogActions
    });
  }, [loadingDialogActions, messageDialogActions]);

  return null;
}
```

### 2. Consuming Linked Stores in Submodules

Submodules that integrate `@codexporer.io/expo-link-stores` into their own `react-sweet-state` stores can access linked actions:

```tsx
import {
  initialState as linkedStoresInitialState,
  actions as linkedStoresActions,
  selector as linkedStoresSelector
} from '@codexporer.io/expo-link-stores';
import { createStore } from 'react-sweet-state';

export const Store = createStore({
  initialState: {
    ...linkedStoresInitialState,
    items: []
  },
  actions: {
    ...linkedStoresActions,
    fetchMedia: () => async ({ getState, dispatch }) => {
      // Access decoupled loading dialog without direct dependency
      const loadingDialog = getState().linkedStores?.loadingDialog;
      loadingDialog?.show({ message: 'Fetching images...' });

      try {
        const items = await api.getMedia();
        dispatch(setItems(items));
      } finally {
        loadingDialog?.hide();
      }
    }
  }
});
```

## API Reference

### `linkStores(storesMap: Record<string, StoreActions>): void`
Registers an object dictionary of store actions. Iterates through each store and invokes `setLinkedStores(storesMap)` to establish bidirectional links.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `storesMap` | `Record<string, any>` | Map of store names to store action objects |

### Store Helper Exports

| Export | Type | Description |
| :--- | :--- | :--- |
| `initialState` | `{ linkedStores?: Record<string, any> }` | Initial state slice to spread into a sweet-state store |
| `actions.setLinkedStores` | `(stores: any) => ({ setState }) => void` | Action saving linked stores map into local store state |
| `actions.getLinkedStores` | `() => ({ getState }) => any` | Action returning all linked stores |
| `actions.getLinkedStore` | `(storeName: string) => ({ getState }) => any` | Action retrieving a specific linked store action object |
| `selector` | `<T>(state: T) => T` | State selector omitting `linkedStores` to avoid re-render loops |

## Guidelines

1. **One-Time Linking**: Register all global stores once during application boot (e.g. inside an initializer component mounted inside the root ThemeProvider).
2. **Safe Optional Chaining**: When consuming linked store actions in submodules, always use optional chaining (`getState().linkedStores?.<name>?.action?.()`) to guard against uninitialized states in tests or standalone runs.

## License

MIT