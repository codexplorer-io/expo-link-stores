# `@codexporer.io/expo-link-stores`

Cross-linking state utility designed for `react-sweet-state` stores across decoupled packages, enabling store actions to communicate without circular dependencies or tight package coupling.

---

## Peer Dependencies

All peer dependencies are required and must be installed in consuming projects (none are optional):
- `lodash`: `*`

---

## Installation

```bash
yarn add @codexporer.io/expo-link-stores
```

---

## Architecture Overview

When building modular React Native/Expo architectures, feature packages (such as image pickers or media creators) often need to invoke global actions (such as dialogs or snackbars) without directly importing or depending on those UI packages.

`@codexporer.io/expo-link-stores` solves this by providing:
1. `initialState`: Declares `{ linkedStores: undefined }` on store definitions.
2. `actions`: Provides `setLinkedStores`, `getLinkedStores`, and `getLinkedStore(storeName)`.
3. `selector`: Clones state and strips `linkedStores` so consuming React components do not trigger unnecessary re-renders when other linked store instances update.
4. `linkStores`: Iterates over a dictionary of store actions and invokes `setLinkedStores(storesMap)` on each, establishing bidirectional links.

---

## Quick Start

### 1. Register Stores at Application Root

At application startup (e.g., inside an initializer or layout component), link decoupled stores using `linkStores()`:

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

### 2. Integrating in Decoupled Stores

In packages defining a `react-sweet-state` store:

```tsx
import { createStore } from 'react-sweet-state';
import {
  initialState as linkedStoresInitialState,
  actions as linkedStoresActions,
  selector as linkedStoresSelector
} from '@codexporer.io/expo-link-stores';

export const Store = createStore({
  initialState: {
    ...linkedStoresInitialState,
    items: []
  },
  actions: {
    ...linkedStoresActions,
    fetchMedia: () => async ({ getState, dispatch }) => {
      // Access decoupled loading dialog actions without direct package dependency
      const loadingDialog = getState().linkedStores?.loadingDialog;
      loadingDialog?.show?.({ message: 'Fetching images...' });

      try {
        const items = await api.getMedia();
        dispatch(setItems(items));
      } finally {
        loadingDialog?.hide?.();
      }
    }
  }
});
```

---

## API Reference

### `linkStores(linkedStores: Record<string, any>): void`

Broadcasts a map of store action objects across all stores in the map by calling `setLinkedStores(linkedStores)` on each:

```ts
linkStores({
  loadingDialog: loadingDialogActions,
  messageDialog: messageDialogActions
});
```

---

### Store Helper Exports

| Export | Type | Description |
| :--- | :--- | :--- |
| `initialState` | `{ linkedStores?: Record<string, any> }` | Initial state slice defining `{ linkedStores: undefined }` |
| `actions.setLinkedStores` | `(linkedStores: any) => ({ setState }) => void` | Action saving the linked stores dictionary into store state |
| `actions.getLinkedStores` | `() => ({ getState }) => any` | Action returning all linked stores dictionary |
| `actions.getLinkedStore` | `(store: string) => ({ getState }) => any` | Action returning a specific linked store's action object by key |
| `selector` | `<T>(state: T) => T` | Selector that clones state and removes `linkedStores` to prevent re-render cascading |

---

## Guidelines

1. **One-Time Linking**: Register all global stores once during application boot (e.g. inside an initializer component mounted near the app root).
2. **Safe Optional Chaining**: When consuming linked store actions in submodules, always use optional chaining (`getState().linkedStores?.<name>?.action?.()`) to guard against uninitialized states during isolated testing or standalone runs.

---

## License

MIT