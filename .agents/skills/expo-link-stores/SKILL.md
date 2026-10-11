---
name: expo-link-stores
description: Instructions for cross-linking react-sweet-state stores across decoupled packages using @codexporer.io/expo-link-stores.
---

# `@codexporer.io/expo-link-stores` Skill

## Overview
`@codexporer.io/expo-link-stores` enables cross-linking `react-sweet-state` store actions across decoupled packages without circular dependencies or tight package coupling.

---

## When to Use
- Allowing independent packages (like image pickers, camera modules) to trigger global dialogs (like `loadingDialog` or `messageDialog`) without importing them directly.
- Orchestrating multi-package workflows through sweet-state store actions.

---

## Required Setup

Register linked stores at root application bootstrap:

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
| `linkStores` | `(storesMap: Record<string, any>) => void` | Broadcasts store action map across all registered stores |
| `initialState` | `{ linkedStores?: Record<string, any> }` | Store state slice to spread into store definition |
| `actions.getLinkedStore` | `(name: string) => ({ getState }) => any` | Action helper retrieving a specific linked store |
| `actions.getLinkedStores` | `() => ({ getState }) => any` | Action helper returning all linked stores |
| `selector` | `<T>(state: T) => T` | Selector removing `linkedStores` to prevent unnecessary re-renders |

---

## Critical Rules & Guidelines
1. **Always Link at Boot**: Call `linkStores()` at application start before decoupled packages attempt to access linked store actions.
2. **Safe Optional Chaining**: In submodules consuming linked actions, always check `linkedStores?.[name]` before calling methods.
