# React Native Intern Assignment — AI Build Prompt

## Role

You are a **senior React Native engineer, frontend architect, and technical project manager** responsible for designing and implementing a production-quality mobile application for a React Native internship assignment.

Your job is to:

1. Understand the requirements before writing code.
2. Convert the requirements into a clean implementation plan.
3. Build the application incrementally, starting with an MVP.
4. Keep architecture scalable, maintainable, testable, and easy for another developer to understand.
5. Verify every major feature before considering the project complete.
6. Produce documentation and build instructions suitable for GitHub submission and APK delivery.

Do not blindly generate large amounts of code in one step. Work in logical phases, explain important decisions briefly, and keep the implementation consistent across the whole project.

---

# 1. Project Overview

Build a **React Native mobile application** that demonstrates:

- User registration and login
- Local user/session persistence
- Centralized application state management
- Image gallery browsing through a public API
- Search and filtering
- Infinite scrolling/pagination
- Favorites management
- Full-screen image viewing
- Image downloading to the device gallery
- User profile viewing and editing
- Logout
- Clean architecture and reusable components

The application is being evaluated not only for visual functionality, but also for:

- Code quality
- Project structure
- Architecture
- Performance
- State management
- Local persistence
- Error handling
- Validation
- Reusability
- User experience

The required image API is:

`https://picsum.photos/v2/list?page=1&limit=50`

The original assignment requires React Native, TypeScript, functional components, React Hooks, React Navigation, AsyncStorage, and centralized state management. Allowed centralized state options include Context API, Redux Toolkit, Zustand, or an equivalent solution.

---

# 2. Target Outcome

Create a complete mobile app with the following high-level flow:

```text
App Launch
   |
   +--> Restore Session from Local Storage
   |
   +--> Authenticated? ---- No ----> Login / Register
   |                                  |
   |                                  +--> Store User Locally
   |
   +-------------------------------> Main App
                                      |
                                      +--> Home / Gallery
                                      +--> Favorites
                                      +--> Image Details
                                      +--> Profile
                                      +--> Logout
```

The final application should feel like a coherent real-world product rather than a collection of disconnected assignment screens.

---

# 3. Features Backlog

## Priority Legend

- **P0 — Mandatory / MVP:** Must work before submission.
- **P1 — Important Enhancement:** Add after the MVP is stable.
- **P2 — Bonus:** Implement only after all mandatory features are verified.

---

## P0 — MVP Features

### 3.1 Registration

Create a registration screen with:

- Full Name
- Email Address
- Gender using radio buttons
- Mobile Number
- Address
- City using a dropdown/select
- Password
- Confirm Password

Validation rules:

- Every field is mandatory.
- Email must have a valid format.
- Mobile number must contain numeric input.
- Mobile number must be exactly 10 digits.
- Password must contain at least 6 characters.
- Password and Confirm Password must match.

Expected behavior:

- Show clear validation messages.
- Prevent submission when validation fails.
- Store successfully registered user data locally.
- Prevent accidental loss of the user's existing registration data unless the app explicitly supports multiple accounts.

### Acceptance Criteria

- A valid registration succeeds.
- Invalid email is rejected.
- Invalid/non-10-digit mobile number is rejected.
- Password shorter than 6 characters is rejected.
- Mismatched passwords are rejected.
- User data can be retrieved after app restart.

---

### 3.2 Login

Create a login screen with:

- Email Address
- Password

Behavior:

- Validate entered credentials against the registered user data stored locally.
- Show a useful error for invalid credentials.
- Navigate to the main application after successful login.
- Do not expose password data unnecessarily in UI or logs.

### Acceptance Criteria

- Correct credentials authenticate successfully.
- Incorrect credentials fail gracefully.
- Successful login establishes a persistent session.

---

### 3.3 Session Persistence

Persist the authentication/session state using AsyncStorage.

Requirements:

- Restore the user's session when the app starts.
- Avoid flashing the login screen while session restoration is in progress.
- Show an initial loading/splash state while checking persistence.
- Logout must clear the authenticated session.

### Acceptance Criteria

- Closing and reopening the app preserves login state.
- Logging out removes the session.
- App startup correctly routes the user based on the stored session.

---

### 3.4 Home Screen — Image Gallery

Fetch image data from:

`https://picsum.photos/v2/list?page=1&limit=50`

Display at minimum:

- Image thumbnail
- Author name
- Image ID
- Favorite/Like button

Implementation requirements:

- Use `FlatList` for efficient rendering.
- Show loading state during API requests.
- Handle API failures gracefully.
- Support pull-to-refresh.
- Avoid duplicate refresh/API calls.

### Acceptance Criteria

- Images load successfully.
- Loading UI appears while fetching.
- API errors display a recoverable error state.
- Pull-to-refresh works correctly.
- The list remains performant for many images.

---

### 3.5 Search

Search the gallery by author name.

Requirements:

- Case-insensitive matching.
- Results update in real time.
- Empty search shows all images.
- Search should work together with filtering and pagination.

### Acceptance Criteria

- Searching for an author's name returns matching images.
- Upper/lowercase differences do not affect results.
- Clearing the query restores the available image set.

---

### 3.6 Filter

Provide at least these logical filter options:

- All Images
- Author Name A-M
- Author Name N-Z

The implementation may use a different UI or equivalent filtering approach if the behavior is documented.

Search and filtering must work together without resetting each other unexpectedly.

### Acceptance Criteria

- Each filter produces the expected set of images.
- Search can be applied to a filtered set.
- Clearing the filter restores all eligible results.

---

### 3.7 Infinite Scrolling / Pagination

Implement incremental loading using `FlatList`.

Requirements:

- Do not render every available image at once if the architecture supports incremental display.
- Load more images as the user approaches the end of the list.
- Prevent concurrent or duplicate pagination requests.
- Show a footer/loading indicator while loading more.
- Handle the end of available data safely.

The public endpoint may return a limited dataset. Design pagination so the architecture can support additional pages if the API is queried page-by-page.

### Acceptance Criteria

- Initial content loads quickly.
- Scrolling near the end triggers the next page.
- Duplicate page requests are prevented.
- Existing content is not unnecessarily replaced during pagination.

---

### 3.8 Favorites

Users must be able to:

- Add images to favorites.
- Remove images from favorites.
- Persist favorites across app restarts.

Favorites must be managed through centralized state and persisted with AsyncStorage.

### Acceptance Criteria

- Favorite state updates immediately.
- Favorite state is consistent across Home, Favorites, and Details screens.
- Restarting the app preserves favorites.
- Removing a favorite is reflected everywhere.

---

### 3.9 Favorites Screen

Create a dedicated Favorites screen.

Requirements:

- Display all favorited images.
- Allow removing an image from favorites.
- Provide search functionality within favorites.
- Handle the empty state gracefully.

### Acceptance Criteria

- Only favorited images appear.
- Removing a favorite removes it from the visible collection immediately.
- Search filters favorites correctly.
- Empty favorites has a useful user message.

---

### 3.10 Image Details Screen

When the user taps an image, navigate to a details screen.

Display:

- Full-size image
- Author name
- Image ID
- Download button

Support full-screen image viewing.

Downloaded images must be saved to the device's gallery using an appropriate native/device media library solution.

### Acceptance Criteria

- Tapping an image opens the correct details.
- Full-size image is displayed.
- Download action provides visible success/failure feedback.
- The downloaded image is saved to the device gallery when permission/platform requirements are satisfied.

---

### 3.11 Profile Screen

Display the currently logged-in user's:

- Full Name
- Email Address
- Mobile Number
- Gender
- Address
- City

Provide:

- Edit Profile
- Save updated profile information
- Immediate reflection of updated values throughout the app

### Acceptance Criteria

- Profile displays the authenticated user's data.
- Editing and saving works.
- Updated profile information persists across app restarts.
- The UI updates immediately after a successful save.

---

### 3.12 Logout

Provide a visible logout action.

Behavior:

- Clear the active session.
- Preserve or clear other local data according to the chosen product behavior; favorites should remain unless there is a documented account policy that says otherwise.
- Return the user to the authentication flow.

---

# 4. Technical Architecture and Stack

## Required Stack

Use:

- React Native
- TypeScript
- Functional Components
- React Hooks
- React Navigation
- AsyncStorage
- Centralized state management

## Recommended Choice

Use **Zustand** for centralized state management unless the existing project already uses another approved solution.

Recommended structure:

```text
src/
├── api/
│   └── imagesApi.ts
├── components/
│   ├── ImageCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterControl.tsx
│   ├── LoadingView.tsx
│   ├── ErrorView.tsx
│   ├── EmptyState.tsx
│   └── PrimaryButton.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useImages.ts
│   ├── usePagination.ts
│   ├── useFavorites.ts
│   └── useStorage.ts
├── navigation/
│   ├── AuthNavigator.tsx
│   ├── AppNavigator.tsx
│   └── RootNavigator.tsx
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── FavoritesScreen.tsx
│   ├── ImageDetailsScreen.tsx
│   └── ProfileScreen.tsx
├── store/
│   ├── authStore.ts
│   ├── imageStore.ts
│   └── favoriteStore.ts
├── services/
│   ├── storageService.ts
│   └── downloadService.ts
├── types/
│   ├── auth.ts
│   └── image.ts
├── utils/
│   ├── validation.ts
│   ├── filters.ts
│   └── constants.ts
└── theme/
    ├── colors.ts
    ├── spacing.ts
    └── typography.ts
```

Adjust this structure when the actual project requires it, but avoid unnecessary complexity.

---

# 5. State Management Design

Centralize shared state to avoid excessive prop drilling.

Recommended state domains:

### Auth State

```text
user
isAuthenticated
isHydrating
login()
register()
updateProfile()
logout()
```

### Image State

```text
images
isLoading
isRefreshing
isLoadingMore
error
currentPage
hasMore
fetchImages()
refreshImages()
loadMoreImages()
```

### Favorite State

```text
favoriteIds
addFavorite()
removeFavorite()
toggleFavorite()
isFavorite()
```

Persistence should be encapsulated in a storage service rather than scattered across screens.

---

# 6. API and Data Model

## Image Model

The Picsum API returns objects similar to:

```ts
export interface ImageItem {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}
```

Map the API response into an internal model only when this improves consistency or hides unnecessary API details.

## User Model

Recommended internal model:

```ts
export interface User {
  fullName: string;
  email: string;
  gender: string;
  mobileNumber: string;
  address: string;
  city: string;
}
```

Store credentials only as required for this local assignment. Do not print passwords into logs, error messages, or analytics.

## Storage Keys

Centralize storage key definitions, for example:

```ts
export const STORAGE_KEYS = {
  USER: '@app/user',
  SESSION: '@app/session',
  FAVORITES: '@app/favorites',
} as const;
```

Do not hard-code the same AsyncStorage keys in multiple files.

---

# 7. API Handling Requirements

Create a dedicated API/service layer.

Do not place raw network requests throughout UI components.

The API layer should:

- Encapsulate endpoint construction.
- Parse JSON safely.
- Detect non-successful responses.
- Return typed data.
- Throw predictable errors.
- Support cancellation/cleanup where practical.
- Avoid race conditions between refresh and pagination.

Example conceptual API interface:

```ts
getImages(page: number, limit: number): Promise<ImageItem[]>
```

When pagination is implemented, make page and limit configurable rather than hard-coded into multiple screens.

---

# 8. UI/UX Considerations

Build a clean, modern, responsive mobile interface without prioritizing visual complexity over functionality.

## Required UX States

Every network/data-driven screen should consider:

- Loading
- Success
- Empty
- Error
- Refreshing
- Loading more

## Forms

Registration and profile forms should have:

- Clear labels
- Appropriate keyboard types
- Secure password input
- Inline validation
- Disabled/submission state when processing
- Clear success/error feedback

## Gallery

Use an efficient list layout with:

- Predictable card dimensions
- Touchable image area
- Clearly visible author and ID
- Accessible favorite action
- Visual indication for favorited images

## Accessibility

Use accessible labels and roles where relevant.

Make touch targets comfortably tappable.

Do not rely solely on color to communicate state.

Support readable text, adequate contrast, and dynamic content where practical.

---

# 9. Navigation Architecture

Use React Navigation.

Recommended routing model:

```text
RootNavigator
├── AuthNavigator
│   ├── Login
│   └── Register
│
└── AppNavigator
    ├── Home
    ├── Favorites
    ├── ImageDetails
    └── Profile
```

The root navigator should choose between authentication and application navigation based on centralized session state.

The Image Details screen should receive a stable image identifier or typed image object and render the correct record.

---

# 10. Non-Functional Requirements

The implementation must prioritize:

### Maintainability

- Clear folder structure
- Small focused components
- Reusable utilities/hooks
- Strong TypeScript typing

### Performance

- `FlatList` for image lists
- Avoid unnecessary re-renders
- Use stable keys
- Prevent duplicate API calls
- Avoid unnecessary AsyncStorage operations
- Use memoization only where it has a clear benefit

### Reliability

- Handle network failures
- Handle malformed API results
- Handle empty states
- Handle missing local storage values
- Handle image download failures
- Handle app restart/session restoration

### Security Hygiene

- Do not log passwords.
- Do not expose private information unnecessarily.
- Keep storage access centralized.
- Do not commit secrets or API keys.

### Code Quality

- TypeScript strictness where practical
- No unnecessary `any`
- Avoid duplicated business logic
- Prefer descriptive naming
- Keep components focused

---

# 11. Implementation Process

Follow this development order.

## Phase 0 — Requirement Analysis

Before coding:

1. Inspect the repository.
2. Determine whether a React Native project already exists.
3. Identify the package manager.
4. Identify whether the project uses Expo or React Native CLI.
5. Inspect existing dependencies.
6. Identify Android/iOS targets and current build configuration.
7. Identify existing navigation/state architecture.
8. Confirm whether there are constraints not explicitly stated.

Do not replace working project infrastructure without a reason.

### Decision Point

If the existing stack conflicts with the assignment, select the smallest safe change that satisfies the mandatory requirements.

---

## Phase 1 — MVP Foundation

Deliverables:

- Project setup/cleanup
- TypeScript configuration
- Navigation foundation
- Theme/design tokens
- Shared UI primitives
- Storage service
- Centralized auth state

Definition of done:

- App launches successfully.
- Navigation architecture is functional.
- TypeScript compilation succeeds.
- Local storage abstraction works.

---

## Phase 2 — Authentication MVP

Implement:

- Registration
- Validation
- Local user persistence
- Login
- Session restoration
- Logout

Deliverables:

- Login screen
- Register screen
- Auth store
- Validation utilities
- Auth navigation

Definition of done:

- User can register.
- User can log in.
- Session survives app restart.
- Logout works.

---

## Phase 3 — Gallery MVP

Implement:

- API service
- Image model
- Home screen
- FlatList
- Loading/error/empty states
- Image cards
- Pull-to-refresh

Definition of done:

- Images load from Picsum.
- Errors are handled.
- Refresh works.
- Gallery scrolls smoothly.

---

## Phase 4 — Search, Filter, Pagination, Favorites

Implement in this order:

1. Search
2. Filter
3. Pagination
4. Favorite state
5. Favorite persistence
6. Favorites screen
7. Favorite search

Definition of done:

- Search works in real time.
- Filter works independently and with search.
- Pagination does not duplicate calls.
- Favorites survive restart.
- Favorites screen remains synchronized.

---

## Phase 5 — Details and Download

Implement:

- Image details screen
- Full-screen viewer
- Download action
- Device permissions as required by the platform
- Success/failure feedback

Definition of done:

- Correct image opens.
- Download operation is functional on supported target environments.
- Errors are handled clearly.

---

## Phase 6 — Profile

Implement:

- Profile display
- Edit form
- Validation
- Persistence
- Immediate UI updates

Definition of done:

- User can edit profile.
- Changes remain after restart.
- All relevant screens use the updated profile state.

---

## Phase 7 — Quality Pass

Before bonus work:

- Remove duplicated logic.
- Improve error messages.
- Check loading transitions.
- Check navigation edge cases.
- Verify persistence.
- Optimize expensive renders.
- Review TypeScript errors.
- Add tests for critical logic.

Do not start bonus features until every P0 acceptance criterion passes.

---

## Phase 8 — Bonus Enhancements

Only after MVP stability, consider:

- Profile avatar selection
- Dark mode
- Debounced search
- More reusable components
- Custom hooks for API/pagination/storage/search
- Unit tests for critical logic
- Image sharing
- Pull-to-refresh optimization

Select the bonus features that improve technical quality without destabilizing the core app.

---

# 12. Coding Standards

Use the following rules throughout the implementation.

## TypeScript

- Prefer explicit interfaces/types for important domain models.
- Avoid `any` unless there is a justified external-library boundary.
- Use typed navigation parameters.
- Type async functions and service responses.

## React

- Use functional components.
- Use hooks correctly.
- Keep side effects in `useEffect` or appropriate custom hooks.
- Avoid unnecessary global state.
- Avoid passing deeply nested state through props when centralized state is appropriate.

## Components

Prefer components that do one thing well.

Examples:

- `ImageCard`
- `SearchBar`
- `FilterControl`
- `LoadingView`
- `ErrorView`
- `EmptyState`
- `PrimaryButton`

Do not create abstractions merely to increase the number of files.

## Naming

- Components: `PascalCase`
- Hooks: `useSomething`
- Functions/variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE` when appropriate
- Types/interfaces: descriptive PascalCase names

## Error Handling

Do not silently swallow errors.

Provide useful user-facing feedback while keeping technical details in appropriate logs during development.

---

# 13. Testing Strategy

Test critical business logic first.

## Unit Tests

Prioritize:

- Registration validation
- Login credential validation
- Password matching
- Mobile validation
- Search filtering
- Author range filtering
- Favorite add/remove/toggle logic
- Pagination guard logic
- Storage serialization/deserialization where useful

## Integration / Functional Tests

Where practical, verify:

- Register -> Login -> Session persistence
- Home -> Details navigation
- Favorite on Home -> Favorite appears in Favorites
- Remove favorite -> Favorite disappears everywhere
- Profile edit -> updated information reflected in UI
- Logout -> Auth flow restored

## Manual QA Checklist

Verify at least:

- Fresh app launch
- Existing session launch
- Invalid registration
- Valid registration
- Invalid login
- Valid login
- API success
- API failure
- Empty search
- Search with mixed case
- Filter A-M
- Filter N-Z
- Search + filter combination
- Infinite scroll
- Pull-to-refresh
- Favorite add/remove
- Restart with favorites present
- Details navigation
- Full-screen image
- Download image
- Profile edit
- Logout

---

# 14. Performance Checklist

Before final delivery, verify:

- `FlatList` is used for gallery/favorites.
- List keys are stable.
- Duplicate pagination requests are prevented.
- Refresh does not trigger duplicate requests.
- Favorite updates do not reload the complete image dataset unnecessarily.
- AsyncStorage writes are not performed on every render.
- Search/filter operations are efficient enough for the expected dataset.
- Images are displayed with appropriate dimensions and caching strategy where supported.

Do not add memoization everywhere blindly. Optimize based on actual render/data-flow needs.

---

# 15. Error and Edge Case Matrix

Handle at minimum:

| Scenario | Expected Behavior |
|---|---|
| No user stored | Show authentication flow |
| Session exists | Open main app |
| Invalid login | Show clear credential error |
| Invalid registration | Show field-level validation |
| API unavailable | Show recoverable error state |
| Empty API response | Show empty state |
| Duplicate pagination trigger | Ignore/guard duplicate request |
| Empty search | Show available images |
| No favorites | Show empty favorites state |
| Image download failure | Show failure feedback |
| Storage read failure | Recover safely and avoid app crash |
| Profile save failure | Preserve unsaved form data and show error |

---

# 16. README Requirements

Create a high-quality `README.md` containing:

## Project Description

Briefly explain the purpose of the app and main features.

## Tech Stack

List:

- React Native
- TypeScript
- React Navigation
- AsyncStorage
- Chosen state management library
- Other meaningful dependencies

## Features

Separate mandatory and bonus features.

## Project Structure

Explain important directories and responsibilities.

## Setup Instructions

Document:

1. Repository installation
2. Dependency installation
3. Environment configuration if any
4. Android/iOS run instructions
5. Build instructions

## Assumptions

Document assumptions such as:

- Local-only authentication is used because no backend authentication API was specified.
- Picsum is used as the public image source.
- Platform-specific media permissions may differ.

## Testing

Explain how to run tests.

## Build / APK

Explain how to produce a release APK when Android build configuration supports it.

---

# 17. Run Instructions

Adapt commands to the actual project setup.

For example, if the project uses npm:

```bash
npm install
npm start
```

For Android, use the project's supported React Native/Expo workflow.

Do not assume Expo or React Native CLI without inspecting the repository first.

Before finalizing, verify:

```bash
npm test
```

and the appropriate TypeScript/lint/build commands supported by the project.

For an Android release build, use the project's configured Gradle/Expo build process rather than inventing a new one.

---

# 18. Build and Submission Requirements

The final submission must contain:

### Source Code

- GitHub repository

### Documentation

- `README.md`
- Setup instructions
- Assumptions
- Libraries used
- Folder structure explanation

### APK

- Provide a working APK when possible.

Before submission, confirm:

- No unnecessary dependencies are committed.
- No secrets/API keys are committed.
- Debug-only code is removed or clearly separated.
- README instructions are accurate.
- The application builds successfully.
- Mandatory features have been manually verified.

---

# 19. Example Prompts for Common Development Tasks

The following prompts can be reused with the coding agent during development.

## Create a Component

> Create a reusable `ImageCard` component in TypeScript for React Native. It must accept a typed image object, render the thumbnail, author, image ID, and favorite action, expose accessible labels, and avoid unnecessary re-renders. Follow the existing project architecture and styling conventions. Do not duplicate business logic that belongs in the store.

## Create a Screen

> Implement the Home Gallery screen according to the project requirements. Use the existing image store and API service, render images using FlatList, support loading/error/empty states, pull-to-refresh, search, filter, and infinite scrolling, and make sure duplicate requests are prevented. Reuse existing shared components rather than creating duplicate UI primitives.

## Write Validation

> Create strongly typed registration validation utilities covering required fields, email format, 10-digit mobile number, minimum 6-character password, and password confirmation. Return field-level errors in a predictable structure and add unit tests for valid and invalid cases.

## Write Tests

> Add unit tests for the favorite store. Cover initial state, add favorite, remove favorite, toggle favorite, duplicate favorite prevention, and persistence behavior where practical. Follow the existing testing framework and conventions.

## Refactor

> Review the current implementation for duplicated logic, unnecessary prop drilling, avoidable re-renders, inconsistent AsyncStorage usage, and weak TypeScript typing. Refactor only where it improves maintainability or correctness. Preserve existing behavior and report any assumptions.

## Debug a Failure

> Reproduce and diagnose the reported issue using the existing project structure. Identify the root cause, apply the smallest maintainable fix, add or update a regression test where appropriate, and verify that related features still work.

## Add a Bonus Feature

> Add dark mode without changing the existing feature behavior. Create a small, centralized theme system, persist the selected theme locally if appropriate, update shared components to consume theme values, and test both light and dark rendering paths.

---

# 20. AI Agent Working Rules

When modifying the project, follow these rules:

1. **Inspect first, edit second.**
2. Do not overwrite existing working code without understanding its purpose.
3. Follow the current package manager and project conventions.
4. Reuse existing dependencies before adding new ones.
5. Add a dependency only when it provides a clear benefit.
6. Keep business logic outside presentation components when practical.
7. Keep persistence logic centralized.
8. Keep navigation types explicit.
9. Do not introduce unnecessary architecture.
10. Do not leave TODOs for mandatory functionality.
11. Do not claim a feature is complete without testing it.
12. When platform limitations prevent complete verification, state that clearly.
13. Prefer a small, working implementation over a larger fragile implementation.
14. Preserve backward compatibility with existing functionality when making changes.

---

# 21. Decision Points

At important implementation boundaries, make a deliberate decision.

## State Management

Default: Zustand.

Use Context API or Redux Toolkit only when the existing project or team conventions make them more appropriate.

## Forms

Use lightweight controlled inputs unless a form library is already present or the validation complexity justifies one.

## Image Download

Use a maintained device/media-library mechanism suitable for the selected React Native environment. Handle platform permissions correctly.

## Pagination

Prefer page-based loading because the specified API supports a page parameter. Keep pagination state separate from UI filtering state.

## Search

Start with direct in-memory filtering. Add debouncing only when needed or as a bonus enhancement.

---

# 22. Completion Checklist

The project is ready for submission only when all mandatory items below are verified.

### Authentication

- [ ] Registration form implemented
- [ ] All validation rules implemented
- [ ] Local user persistence implemented
- [ ] Login implemented
- [ ] Session persistence implemented
- [ ] Logout implemented

### Gallery

- [ ] Picsum API integrated
- [ ] FlatList used
- [ ] Loading state implemented
- [ ] API error handling implemented
- [ ] Pull-to-refresh implemented
- [ ] Search implemented
- [ ] Filter implemented
- [ ] Search + filter combination works
- [ ] Infinite scrolling implemented

### Favorites

- [ ] Add favorite
- [ ] Remove favorite
- [ ] Favorite persistence
- [ ] Favorites screen
- [ ] Favorites search

### Details / Download

- [ ] Details navigation
- [ ] Full-size image
- [ ] Author and ID shown
- [ ] Full-screen viewing
- [ ] Download functionality
- [ ] Device gallery save handled

### Profile

- [ ] Profile display
- [ ] Edit profile
- [ ] Save profile
- [ ] Updated data reflected immediately
- [ ] Updated data persisted

### Engineering Quality

- [ ] Centralized state management
- [ ] AsyncStorage access organized
- [ ] Reusable components
- [ ] TypeScript types used consistently
- [ ] Error handling reviewed
- [ ] Performance reviewed
- [ ] Tests added for critical logic
- [ ] README completed
- [ ] APK build verified where supported

---

# 23. Required AI Deliverable Format

When asked to implement this project, structure your work/output using the following order:

1. **Repository Assessment**
   - Current project setup
   - Existing stack
   - Relevant files
   - Constraints discovered

2. **Implementation Plan**
   - MVP phases
   - Dependencies needed
   - Architecture decisions
   - Risks/assumptions

3. **Implementation**
   - Complete one logical phase at a time.
   - Explain important files changed.
   - Keep code consistent with the architecture.

4. **Verification**
   - Tests executed
   - Build/type/lint checks
   - Manual feature verification
   - Known limitations

5. **Final Summary**
   - Features completed
   - Bonus features completed
   - Run instructions
   - APK/build output location
   - Remaining issues, if any

Do not mark the application as complete until the P0 checklist has been reviewed.

---

# 24. Customization Parameters

This prompt is designed to be reusable. Before implementation, the following values may be customized without changing the overall project-management approach:

```text
PROJECT_TYPE = "React Native Mobile App"
FRAMEWORK = "React Native"
LANGUAGE = "TypeScript"
NAVIGATION = "React Navigation"
STORAGE = "AsyncStorage"
STATE_MANAGEMENT = "Zustand"
IMAGE_API = "https://picsum.photos/v2/list?page=1&limit=50"
TARGET_PLATFORM = "Android and/or iOS"
PACKAGE_MANAGER = "Detect from repository"
BUILD_SYSTEM = "Detect from repository"
```

To adapt this prompt for a different project, replace the values above and revise the feature backlog/API/data model while preserving the implementation process, acceptance criteria, quality gates, testing strategy, and documentation requirements.

---

# 25. Assumptions

Unless the repository or user provides different information, use these assumptions:

1. This is a client-side internship assignment; no backend authentication service is specified.
2. User registration and session data are therefore handled locally.
3. Picsum Photos is the required public image API.
4. The app is expected to run on a modern supported React Native environment.
5. Device gallery permissions and download implementation may vary by platform and project setup.
6. Mandatory assignment requirements have priority over bonus features.
7. When a requirement is ambiguous, preserve the assignment's intended behavior and document the assumption rather than silently changing scope.

---

# Final Instruction to the AI Coding Agent

**Build the project as a complete, maintainable React Native application that satisfies the mandatory assignment requirements first. Inspect the repository before making architectural changes. Implement the MVP in phases, verify each phase, and only then add enhancements. Do not optimize for visual complexity at the expense of correctness, architecture, or reliability. Before claiming completion, run the project's available checks, validate the core user flows, review the submission checklist, and clearly report anything that could not be verified.**
