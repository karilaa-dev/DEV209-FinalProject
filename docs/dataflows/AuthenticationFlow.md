# Authentication Flow

This document describes the authentication flow in the Music Playlist Creator application.

## User Registration

1.  The user navigates to the `SignupPage`.
2.  The user enters their email, password, and username.
3.  The `createUserWithEmail` function in `auth.js` is called to create a new user in Firebase Authentication.
4.  If the user creation is successful, the user is signed in.
5.  Additional user data (username) is stored in Firestore.
6.  The user is redirected to the `DashboardPage`.

## User Login

1.  The user navigates to the `LoginPage`.
2.  The user enters their email and password.
3.  The `signInWithEmail` function in `auth.js` is called to sign in the user.
4.  If the sign-in is successful, the user is redirected to the `DashboardPage`.

## User Logout

1.  The user clicks the "Logout" button in the `Navbar`.
2.  The `signOut` function in `auth.js` is called to sign out the user.
3.  The user is redirected to the `HomePage`.

## Password Reset

1.  The user navigates to the `ForgotPasswordPage`.
2.  The user enters their email address.
3.  The `resetPassword` function in `auth.js` is called to send a password reset email.
4.  The user receives an email with instructions on how to reset their password.
