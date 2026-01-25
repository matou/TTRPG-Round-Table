# AI Coding Agent Instructions for TTRPG Round Table

## Project Overview
TTRPG Round Table is a React-based initiative tracker for tabletop RPG sessions. It manages a list of combat participants with editable initiative scores, names, and HP (current/max) values. The app automatically sorts participants by initiative in descending order.

## Tech Stack & Build System
- **Framework**: React 19 with Vite 7 (module type)
- **Styling**: CSS (dark theme, ~139 lines in `src/App.css`)
- **Linting**: ESLint 9 with React hooks and refresh plugins
- **Build**: `npm run build` → `vite build`
- **Development**: `npm run dev` → `vite dev`
- **Linting**: `npm run lint` → `eslint .`

## Architecture & Component Structure

### App Component (`src/App.jsx`)
**Single source of truth**: Manages participant and tags state with React hooks (`useState`). Data flows unidirectionally:
- `participants`: Array of objects with shape: `{ id, name, initiative, hpCurrent, hpMax, tags: [] }`
  - `tags` array contains tag IDs that reference the global `tags` state
- `tags`: Array of tag objects with shape: `{ id, name, color }`
- `nextTagId`: Counter for generating unique tag IDs
- `addParticipant()`: Appends new participant with auto-incremented ID and empty tags array
- `removeParticipant(id)`: Filters by ID
- `updateParticipant(id, field, value)`: Immutable state update pattern using `.map()`
- `addTag(tagName)`: Creates new tag if not duplicate (case-insensitive); auto-assigns next color from `COLOR_PALETTE`
- `addTagToParticipant(participantId, tagId)`: Adds tag ID to participant's tags array
- `removeTagFromParticipant(participantId, tagId)`: Removes tag ID from participant's tags array
- `getTagColor(tagId)` / `getTagName(tagId)`: Lookup helpers

**Color palette**: 10-color cycle (`COLOR_PALETTE`) auto-assigned to new tags in creation order. Colors wrap around.

**Rendering pattern**:
- Participants sorted DESC by initiative (`sort((a, b) => b.initiative - a.initiative)`) on every render
- Tags cell displays colored label badges with × button to remove
- "+ Add Tag" button toggles `TagManager` popup for selected participant
- Empty state handled with conditional: `participants.length === 0 ? ...`
- Uses semantic `<table>` with `<thead>` and `<tbody>` for accessibility

### TagManager Component (`src/TagManager.jsx`)
Modal interface for adding tags to a participant. Allows:
- **Selecting existing tags**: Shows all created tags as colored buttons; clicking adds to participant
- **Creating new tags**: Text input with auto-assigned color from palette; color cannot be customized (design intent)
- Keyboard support: Enter key in input creates tag

Props:
- `tags`: All available tags
- `onAddExistingTag(tagId)`: Callback when user selects existing tag
- `onCreateNewTag(tagName)`: Callback when user creates new tag (App handles color assignment)
- `onClose()`: Closes the panel

## CSS & Styling Conventions
- **Dark theme**: `#1a1a1a` background, `#e0e0e0` text, `#555` borders
- **Hover/Active states**: Subtle color shifts (e.g., remove button: `#5a1a1a` → `#6a2a2a` → `#4a1a1a`)
- **Remove button**: Red-tinted (`#5a1a1a`), always `min-width: 32px; height: 32px`
- **Tags**: Colored badges with contrasting text (`color: #000`), include remove button (× symbol)
- **Table inputs**: Gray background (`#2a2a2a`), inherit text color, 3px border-radius
- **Responsive**: All inputs use `width: 100%` within table cells
- **TagManager modal**: `.tag-manager` positioned absolutely below "+ Add Tag" button with dark background and shadow

## Critical Workflows
1. **Development**: `npm run dev` starts Vite dev server with HMR enabled
2. **Linting**: Always run `npm run lint` before commits; ESLint covers React hooks and refresh rules
3. **Build**: `npm run build` outputs to dist/ (Vite default)
4. **Testing**: No test framework configured—additions should consider vitest compatibility

## Key Patterns & Conventions
- **Immutable updates**: Never mutate arrays directly; use spread operator and `.map()`/`.filter()`
- **Uncontrolled edge cases**: Handle missing values with nullish coalescing (`??`) or OR (`||`)
- **Semantic HTML**: Use proper table structure; buttons include `aria-label` for remove actions
- **No external state management**: All state lives in App component—keep it that way for simplicity
- **CSS class naming**: BEM-lite (e.g., `.participants-table`, `.hp-input-container`, `.remove-button`)

## Common Tasks
- **Adding a field to participants**: Add to initial object in `addParticipant()`, update `updateParticipant()` mapping, add table cell with input, update CSS
- **Styling tweaks**: Modify dark theme colors in `App.css` (maintain contrast ratio ≥4.5:1)
- **Adding/modifying tags**: Update `addTag()` and tag-related callbacks in App; tag colors come from `COLOR_PALETTE`
- **New features**: Keep single component per file; avoid splitting App unless state grows beyond participant+tag management
