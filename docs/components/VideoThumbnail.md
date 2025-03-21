# VideoThumbnail Component

The `VideoThumbnail` component is responsible for rendering a thumbnail image for a video. It displays the thumbnail image and optionally a play button overlay.

## Props

-   `video`: An object containing the video details:
    -   `thumbnailUrl`: The URL of the video thumbnail (string, required).
-   `showPlayButton`: A boolean indicating whether to display a play button overlay (boolean, optional).

## Functionality

-   Displays the video thumbnail image.
-   Displays a play button overlay if `showPlayButton` is true.

## Example Usage

```jsx
<VideoThumbnail
    video={{
        thumbnailUrl: "https://example.com/thumbnail.jpg",
    }}
    showPlayButton={true}
/>
