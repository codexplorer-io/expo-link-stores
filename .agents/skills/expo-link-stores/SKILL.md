---
name: expo-link-stores
description: Instructions for cross-linking react-sweet-state stores across decoupled packages using @codexporer.io/expo-link-stores.
---

# `@codexporer.io/expo-link-stores` Skill

## Overview
`@codexporer.io/expo-link-stores` enables cross-linking `react-sweet-state` store actions across decoupled packages without circular dependencies or tight package coupling.

---

## Peer Dependencies

All peer dependencies are required and must be installed in consuming projects (none are optional):
- `lodash`: `*`

---

## When to Use
- Allowing independent packages (like image pickers, camera modules, or session recorders) to trigger global dialogs or snackbars without importing them directly.
- Orchestrating multi-package workflows through sweet-state store actions.

---

## Required Setup

### 1. Store Definition (In Submodules)

Spread `initialState` and `actions` into your store definition, and pass `selector` to your hook:

```tsx
import { createStore, createHook } from 'react-sweet-state';
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

export const useStore = createHook(Store, {
  selector: linkedStoresSelector
});
```

### 2. Linking at Root Application Bootstrap

Register linked store action hooks at root application startup:

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

---

## API Reference

### Functions & Exports

| Export | Type | Description |
| :--- | :--- | :--- |
| `linkStores` | `(linkedStores: Record<string, any>) => void` | Broadcasts store action map across all registered stores by calling `setLinkedStores` on each |
| `initialState` | `{ linkedStores?: Record<string, any> }` | Store state slice to spread into store definition (`{ linkedStores: undefined }`) |
| `actions.setLinkedStores` | `(linkedStores: any) => ({ setState }) => void` | Action saving linked stores map into local store state |
| `actions.getLinkedStores` | `() => ({ getState }) => any` | Action helper returning all linked stores dictionary |
| `actions.getLinkedStore` | `(store: string) => ({ getState }) => any` | Action helper retrieving a specific linked store action object by key |
| `selector` | `<T>(state: T) => T` | Selector cloning state and removing `linkedStores` to prevent unnecessary component re-renders |

---

## Critical Rules & Guidelines

1. **Always Link at Boot**: Call `linkStores()` at application start before decoupled packages attempt to access linked store actions.
2. **Safe Optional Chaining**: In submodules consuming linked actions, always check `getState().linkedStores?.<name>?.action?.()` before invoking methods.
3. **Selector Usage**: Always use `selector` with `createHook` so state subscribers do not re-render when other linked stores trigger updates.
4. **All Peer Dependencies Required**: Consuming projects must install `lodash` without marking it as optional.
