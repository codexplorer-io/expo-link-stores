# `@codexporer.io/expo-link-stores`

Utility package for cross-linking `react-sweet-state` store actions across decoupled submodules and host application stores.

## Prerequisites

Ensure `react-sweet-state` and `lodash` are installed in your workspace:

```bash
yarn add react-sweet-state lodash
```

## Usage Example

Initialize cross-linked stores at application startup:

```typescript
import React, { useEffect } from 'react';
import { linkStores } from '@codexporer.io/expo-link-stores';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';

export function RootAppInitializer() {
  const [, loadingDialogActions] = useLoadingDialogActions();

  useEffect(() => {
    linkStores({
      loadingDialog: loadingDialogActions
    });
  }, [loadingDialogActions]);

  return null;
}
```

## Consuming Linked Stores in Submodules

```javascript
import { getLinkedStore } from '@codexporer.io/expo-link-stores';

// Inside sweet-state action:
export const performTask = () => ({ dispatch }) => {
  const loadingDialog = dispatch(getLinkedStore('loadingDialog'));
  if (loadingDialog) {
    loadingDialog.show({ message: 'Loading...' });
  }
};
```