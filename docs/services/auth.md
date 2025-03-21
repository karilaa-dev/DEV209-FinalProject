# Authentication Service Documentation (auth.js)

The `auth.js` service handles user authentication and authorization using Firebase Authentication. It provides functions for user registration, login, logout, password management, and user data retrieval.

## Functions

### `subscribeToAuthChanges(callback)`

Subscribes to authentication state changes.

#### Parameters

-   `callback` (function): A function to be called when the authentication state changes. The function receives the user object as an argument (or null if no user is logged in).

#### Returns

An unsubscribe function that can be called to stop listening for authentication state changes.

#### Example Usage

```javascript
import { subscribeToAuthChanges } from '../services/auth';

const unsubscribe = subscribeToAuthChanges((user) => {
    if (user) {
        console.log('User logged in:', user);
    } else {
        console.log('User logged out');
    }
});

// To stop listening for changes:
// unsubscribe();
```

### `createUserWithEmail(email, password)`

Creates a new user with email and password.

#### Parameters

-   `email` (string): The user's email address.
-   `password` (string): The user's password.

#### Returns

A Promise that resolves with an object containing:

-   `user` (object): The Firebase user object.
-   `error` (string): An error message, or null if the creation was successful.

### `signInWithEmail(email, password)`

Signs in an existing user with email and password.

#### Parameters

-   `email` (string): The user's email address.
-   `password` (string): The user's password.

#### Returns

A Promise that resolves with an object containing:

-   `user` (object): The Firebase user object.
-   `error` (string): An error message, or null if the sign-in was successful.

### `signOut()`

Signs out the current user.

#### Returns

A Promise that resolves with an object containing:

-   `success` (boolean): True if the sign-out was successful.
-   `error` (string): An error message, or null if the sign-out was successful.

### `resetPassword(email)`

Sends a password reset email to the given email address.

#### Parameters

-   `email` (string): The user's email address.

#### Returns

A Promise that resolves with an object containing:

-   `success` (boolean): True if the password reset email was sent successfully.
-   `error` (string): An error message, or null if the email was sent successfully.

### `getCurrentUserData(uid)`

Retrieves additional user data from Firestore.

#### Parameters

-   `uid` (string): The user's UID.

#### Returns

A Promise that resolves with an object containing:

-   `userData` (object): The user data retrieved from Firestore.
-   `error` (string): An error message, or null if the retrieval was successful.
