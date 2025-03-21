# PlaylistGrid Component

The `PlaylistGrid` component is responsible for rendering a grid of playlists. It displays a list of playlists in a visually appealing grid layout.

## Props

-   `playlists`: An array of playlist objects to display (array, required).

## Functionality

-   Renders a grid of `PlaylistCard` components, each displaying a playlist.
-   Handles the layout and styling of the playlist grid.

## Example Usage

```jsx
<PlaylistGrid
    playlists={[
        {
            id: "PLAYLIST_ID_1",
            name: "My Awesome Playlist 1",
            creatorName: "John Doe",
            videos: [{ title: "Video 1" }, { title: "Video 2" }],
            thumbnailUrl: "https://example.com/thumbnail1.jpg",
        },
        {
            id: "PLAYLIST_ID_2",
            name: "My Awesome Playlist 2",
            creatorName: "Jane Smith",
            videos: [{ title: "Video 3" }, { title: "Video 4" }],
            thumbnailUrl: "https://example.com/thumbnail2.jpg",
        },
    ]}
/>
