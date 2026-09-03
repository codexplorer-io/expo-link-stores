# AGENTS.md - `@codexporer.io/expo-link-stores` Instructions

## Package Overview
`@codexporer.io/expo-link-stores` enables cross-linking `react-sweet-state` store actions across decoupled packages without circular dependencies.

## Key Exports
- `linkStores(storesMap)`: Function to register store actions globally.
- `actions`: Sweet state store actions (`setLinkedStores`, `getLinkedStores`, `getLinkedStore`).
- `initialState`, `selector`.

## Instructions for AI Agents
- Register all linked stores at root app startup.
- In submodules consuming linked stores, check existence of `getLinkedStore('<storeName>')` before calling actions.
