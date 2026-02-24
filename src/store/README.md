# Store

State management logic for libraries like Zustand or Redux.

Examples:
- authStore.ts - Authentication state
- userStore.ts - User data state
- uiStore.ts - UI state (modals, notifications, etc.)

Example with Zustand:
```typescript
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```
