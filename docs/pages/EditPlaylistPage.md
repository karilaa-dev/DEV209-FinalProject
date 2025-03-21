# EditPlaylistPage Component

The `EditPlaylistPage` component is responsible for rendering the page for editing a playlist. It allows users to modify the playlist name, description, and videos.

## Functionality

-   Fetches playlist data from Firebase using the `getPlaylist` service.
-   Allows users to edit the playlist name and description using the `PlaylistForm` component.
-   Allows users to add videos to the playlist using the `YouTubeSearch` component.
-   Allows users to reorder videos in the playlist using drag and drop.
-   Allows users to remove videos from the playlist.
-   Updates the playlist in Firebase using the `updatePlaylist` service.

## Components Used

-   `PlaylistForm`: Provides a form for editing the playlist name and description.
-   `YouTubeSearch`: Provides a search interface for YouTube videos.
-   `SortableVideoItem`: Displays a video item that can be dragged and dropped to reorder the playlist.

## State Variables

-   `playlist`: The playlist data (object).
-   `loading`: Indicates whether the playlist data is being loaded (boolean).
-   `error`: Stores any error messages (string).
-   `videos`: An array of video objects in the playlist (array).

## Services Used

-   `getPlaylist`: Fetches playlist data from Firebase.
-   `updatePlaylist`: Updates the playlist in Firebase.
