# CreatePlaylistPage Component

The `CreatePlaylistPage` component is responsible for rendering the page for creating a new playlist. It allows users to enter the playlist name and description.

## Functionality

-   Displays a form for entering the playlist name and description using the `PlaylistForm` component.
-   Creates a new playlist in Firebase using the `createPlaylist` service.
-   Redirects the user to the new playlist page after successful creation.

## Components Used

-   `PlaylistForm`: Provides a form for entering the playlist name and description.

## Services Used

-   `createPlaylist`: Creates a new playlist in Firebase.
