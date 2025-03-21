# PlaylistCard Component

The `PlaylistCard` component is responsible for rendering a summary of a playlist, typically displayed in a grid or list. It shows the playlist name, creator, video count, and a thumbnail (if available).

## Props

-   `playlist`: An object containing the playlist details:
    -   `id`: The ID of the playlist (string, required).
    -   `name`: The name of the playlist (string, required).
    -   `creatorName`: The name of the playlist creator (string).
    -   `videos`: An array of video objects in the playlist (array, optional).
    -   `thumbnailUrl`: The URL of the playlist thumbnail (string, optional).
    -   `viewCount`: The number of views the playlist has (number, optional).

## Functionality

-   Displays the playlist name, creator, and video count.
-   Renders a thumbnail for the playlist, if available.
-   Links to the `PlaylistDetailPage` for the specific playlist.
-   Handles navigation to the playlist details page when the card is clicked.

## Example Usage

```jsx
<PlaylistCard
    playlist={{
        id: "PLAYLIST_ID",
        name: "My Awesome Playlist",
        creatorName: "John Doe",
        videos: [
            { title: "Video 1" },
            { title: "Video 2" },
        ],
        thumbnailUrl: "https://example.com/thumbnail.jpg",
        viewCount: 100,
    }}
/>
