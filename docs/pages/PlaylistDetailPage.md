# PlaylistDetailPage Component

The `PlaylistDetailPage` component is responsible for rendering the details of a specific playlist, including the playlist name, description, creator, videos, and edit options.

## Functionality

-   Fetches playlist data from Firebase using the `getPlaylist` service.
-   Displays the playlist name, description, and creator.
-   Renders a list of videos in the playlist using the `VideoItem` component.
-   Allows the playlist owner to edit the playlist.
-   Handles video editing and removal.
-   Updates the view count for the playlist.
-   Opens a video player popup when a video is clicked.

## Props

-   None (uses `useParams` hook to get the `playlistId` from the URL).

## State Variables

-   `playlist`: The playlist data (object).
-   `loading`: Indicates whether the playlist data is being loaded (boolean).
-   `error`: Stores any error messages (string).
-   `removingIndex`: The index of the video being removed (number).
-   `editingIndex`: The index of the video being edited (number).
-   `creatorName`: The name of the playlist creator (string).
-   `selectedVideo`: The video to be displayed in the video player popup (object).
-   `selectedVideoIndex`: The index of the selected video in the playlist (number).

## Services Used

-   `getPlaylist`: Fetches playlist data from Firebase.
-   `removeVideoFromPlaylist`: Removes a video from the playlist in Firebase.
-   `updateVideoInPlaylist`: Updates a video's information in the playlist in Firebase.
-   `updateViewCount`: Updates the view count for the playlist in Firebase.
-   `getCurrentUserData`: Retrieves user data from Firebase.

## Example Usage

```jsx
<Route path="/playlist/:playlistId" element={<PlaylistDetailPage />} />
