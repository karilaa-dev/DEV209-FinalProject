# AuthContext Documentation

The `AuthContext` provides a way to manage user authentication state throughout the application. It uses React's Context API to make authentication information available to any component that needs it.

## Context Value

The `AuthContext` provides the following values:

-   `currentUser`: The currently logged-in user object (or null if no user is logged in).
-   `userData`: Additional user data retrieved from Firestore (object).
-   `setUserData`: A function to update the `userData` state.
-   `isAuthenticated`: A boolean indicating whether a user is currently authenticated (true if `currentUser` is not null).
-   `loading`: A boolean indicating whether the authentication state is still being loaded.

## Provider

The `AuthProvider` component is responsible for providing the `AuthContext` value to its children. It subscribes to authentication state changes using the `subscribeToAuthChanges` function from `src/services/auth.js` and updates the `currentUser` and `userData` state accordingly.

## Custom Hook

The `useAuth` hook provides a convenient way to access the `AuthContext` value in any component.

## Example Usage

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
    const { currentUser, userData, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading authentication...</div>;
    }

    if (isAuthenticated) {
        return (
            <div>
                <p>Welcome, {userData.username}!</p>
                {/* ... */}
            </div>
        );
    } else {
        return <p>Please log in.</p>;
    }
}
