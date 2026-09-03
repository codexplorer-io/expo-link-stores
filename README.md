# `@codexporer.io/expo-link-stores`

Utility package for cross-linking `react-sweet-state` store actions across decoupled submodules and application stores.

## Usage Example

Initialize cross-linked stores at application startup:

```typescript
import { linkStores } from '@codexporer.io/expo-link-stores';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';

// In root startup hook / component:
const [, loadingDialogActions] = useLoadingDialogActions();

useEffect(() => {
  linkStores({
    loadingDialog: loadingDialogActions
  });
}, [loadingDialogActions]);
```