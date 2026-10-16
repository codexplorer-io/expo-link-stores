# AGENTS.md — `@codexporer.io/expo-link-stores` Instructions

## Package Overview

`@codexporer.io/expo-link-stores` enables cross-linking `react-sweet-state` store actions across decoupled packages without circular dependencies or tight package coupling.

---

## Peer Dependencies

All peer dependencies must be installed in consuming projects (none are optional):
- `lodash`: `*`

---

## Key Exports

- `linkStores(linkedStores)`: Function iterating through a map of store actions, invoking `setLinkedStores(linkedStores)` on each.
- `initialState`: Store state slice defining `{ linkedStores: undefined }`.
- `actions`: Store actions:
  - `setLinkedStores(linkedStores)`: Saves the linked stores map into local state.
  - `getLinkedStores()`: Returns the linked stores map.
  - `getLinkedStore(store)`: Returns the action object for a specific linked store.
- `selector`: State selector that clones state and deletes `linkedStores` to prevent unnecessary component re-renders.

---

## Instructions for AI Agents

- **Store Definition**: Spread `...initialState` into `initialState` and `...actions` into `actions` when defining sweet-state stores that need to communicate across packages.
- **Root Linking**: Register all linked store action hooks once during app initialization at the root layout/initializer using `linkStores({ name: actions })`.
- **Safe Invocation**: In submodules consuming linked stores, always use optional chaining (`getState().linkedStores?.<name>?.action?.()`) to guard against unlinked or isolated test environments.

