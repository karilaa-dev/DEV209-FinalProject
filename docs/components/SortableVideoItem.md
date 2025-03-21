# SortableVideoItem Component

The `SortableVideoItem` component is responsible for rendering a video item that can be dragged and dropped to reorder the playlist. It's used in the `EditPlaylistPage` to allow users to change the order of videos in a playlist.

## Props

-   `video`: An object containing the video details:
    -   `title`: The title of the video (string).
    -   `url`: The URL of the video on YouTube (string, required).
    -   `thumbnailUrl`: The URL of the video thumbnail (string, optional).
-   `index`: The index of the video in the playlist (number, required).
-   `onRemove`: A function to be called when the video is removed from the playlist (function, required).
-   `moveVideoUp`: A function to be called when the video is moved up in the playlist (function, required).
-   `moveVideoDown`: A function to be called when the video is moved down in the playlist (function, required).

## Functionality

-   Displays the video title and thumbnail.
-   Provides controls to move the video up or down in the playlist.
-   Provides a button to remove the video from the playlist.
-   Uses drag and drop functionality to allow users to reorder the videos.

## Example Usage

```jsx
<SortableVideoItem
    video={{
        title: "Video Title",
        url: "https://www.youtube.com/watch?v=VIDEO_ID",
        thumbnailUrl: "https://example.com/thumbnail.jpg",
    }}
    index={0}
    onRemove={() => console.log("Remove video")}
    moveVideoUp={() => console.log("Move video up")}
    moveVideoDown={() => console.log("Move video down")}
/>
