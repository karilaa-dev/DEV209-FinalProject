# Navbar Component

The `Navbar` component is responsible for rendering the navigation bar at the top of the application. It provides links to different pages and handles user authentication status.

## Props

-   None

## Functionality

-   Displays the application logo and name.
-   Provides links to the home page, dashboard, and profile page.
-   Displays login and signup links if the user is not authenticated.
-   Displays a logout button if the user is authenticated.
-   Handles user authentication status using the `AuthContext`.

## Context Used

-   `AuthContext`: Provides the user authentication status.

## Example Usage

```jsx
<Navbar />
