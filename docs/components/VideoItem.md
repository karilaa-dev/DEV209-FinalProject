# VideoItem Component

The `VideoItem` component is responsible for rendering a single video item in a playlist. It displays the video thumbnail, title, and description, and provides a link to watch the video on YouTube.

## Props

-   `video`: An object containing the video details:
    -   `title`: The title of the video (string).
    -   `description`: The description of the video (string, optional).
    -   `url`: The URL of the video on YouTube (string, required).
    -   `thumbnailUrl`: The URL of the video thumbnail (string).
-   `index`: The index of the video in the playlist (number, required).
-   `playlistId`: The ID of the playlist the video belongs to (string).
-   `onClick`: A function to be called when the video item is clicked.

## Functionality

-   Displays the video thumbnail using the `VideoThumbnail` component.
-   Displays the video title and description.
-   Provides a link to watch the video on YouTube.
-   Calls the `onClick` function when the video item is clicked, allowing the parent component to handle video selection.

## Example Usage

```jsx
<VideoItem
    video={{
        title: "Video Title",
        description: "Video Description",
        url: "https://www.youtube.com/watch?v=VIDEO_ID",
        thumbnailUrl: "https://i.ytimg.com/vi/VIDEO_ID/mqdefault.jpg",
    }}
    index={0}
    playlistId="PLAYLIST_ID"
    onClick={() => console.log("Video clicked")}
/>
