---
name: expo-link-stores
description: Instructions for cross-linking react-sweet-state stores across decoupled packages using @codexporer.io/expo-link-stores.
---

# `@codexporer.io/expo-link-stores` Skill

## Overview
`@codexporer.io/expo-link-stores` facilitates cross-store communications in decoupled submodules using `react-sweet-state` without creating circular dependencies.

## Key Utility Export

```typescript
import { linkStores } from '@codexporer.io/expo-link-stores';
```

## Setup & Implementation Pattern

Call `linkStores` once at app startup inside the root container (`App.tsx` or root layout component):

```typescript
import React, { useEffect } from 'react';
import { linkStores } from '@codexporer.io/expo-link-stores';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';

export function RootStoreLinker() {
  const [, loadingDialogActions] = useLoadingDialogActions();

  useEffect(() => {
    linkStores({
      loadingDialog: loadingDialogActions,
    });
  }, [loadingDialogActions]);

  return null;
}
```

## How Decoupled Packages Consume Linked Stores

Within submodules (e.g. `@codexporer.io/expo-image-picker`), retrieve linked store actions safely:

```javascript
// Inside a sweet-state action:
const loadingDialog = dispatch(getLinkedStore('loadingDialog'));
if (loadingDialog) {
  loadingDialog.show({ message: 'Processing image...' });
}
```

## Implementation Rules
1. **Initialize at Root**: Always call `linkStores` in the root app entry point.
2. **Safe Invocation**: Always check if `getLinkedStore('<name>')` exists before invoking methods in decoupled submodules.
