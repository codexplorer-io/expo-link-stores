---
name: expo-link-stores
description: Instructions for cross-linking react-sweet-state stores across decoupled packages using @codexporer.io/expo-link-stores.
---

# `@codexporer.io/expo-link-stores` Skill

## Overview
`@codexporer.io/expo-link-stores` facilitates cross-store communications in decoupled submodules using `react-sweet-state` without creating circular package dependencies.

---

## Primary Exports

```typescript
import { 
  linkStores, 
  initialState, 
  actions, 
  selector 
} from '@codexporer.io/expo-link-stores';
```

---

## Root Setup & Implementation Pattern

Call `linkStores` once at app startup inside the root container (e.g. `_layout.tsx` or `App.tsx`):

```typescript
import React, { useEffect } from 'react';
import { linkStores } from '@codexporer.io/expo-link-stores';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';
import { useMessageDialogActions } from '@codexporer.io/expo-message-dialog';

export function RootStoreLinker() {
  const [, loadingDialogActions] = useLoadingDialogActions();
  const [, messageDialogActions] = useMessageDialogActions();

  useEffect(() => {
    if (loadingDialogActions || messageDialogActions) {
      linkStores({
        loadingDialog: loadingDialogActions,
        messageDialog: messageDialogActions,
      });
    }
  }, [loadingDialogActions, messageDialogActions]);

  return null;
}
```

---

## How Decoupled Packages Consume Linked Stores

Within submodules (e.g. `@codexporer.io/expo-image-picker`), include the base linked store state, actions, and selector in the sweet-state Store definition:

```typescript
import { createStore } from 'react-sweet-state';
import { initialState, actions } from '@codexporer.io/expo-link-stores';

const Store = createStore({
  initialState: {
    ...initialState,
    // module specific state
  },
  actions: {
    ...actions,
    uploadFile: () => ({ dispatch }) => {
      // Safely access linked store:
      const loadingDialog = dispatch(actions.getLinkedStore('loadingDialog'));
      if (loadingDialog) {
        loadingDialog.show({ message: 'Uploading...' });
      }
    }
  }
});
```

---

## Implementation Rules
1. **Initialize at Root**: Always call `linkStores` during app bootstrap when linking shared actions like `loadingDialog` and `messageDialog`.
2. **Safe Invocation**: Always verify that `getLinkedStore('<name>')` exists before invoking methods in decoupled submodules.
3. **No Circular Dependencies**: Use linked stores instead of importing concrete store instances across decoupled submodule boundaries.
