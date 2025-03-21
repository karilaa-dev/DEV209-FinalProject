# VideoPlayerPopup Component

The `VideoPlayerPopup` component is responsible for rendering a popup that displays a YouTube video player. It allows users to watch videos directly within the application without navigating away.

## Props

-   `video`: An object containing the video details:
    -   `url`: The URL of the video on YouTube (string, required).
    -   `title`: The title of the video (string, optional).
    -   `description`: The description of the video (string, optional).
    -   `thumbnailUrl`: The URL of the video thumbnail (string, optional).
-   `onClose`: A function to be called when the popup is closed (function, required).
-   `onNext`: A function to be called when the user wants to play the next video (function, optional).
-   `hasNext`: A boolean indicating whether there is a next video to play (boolean, optional).

## Functionality

-   Displays a YouTube video player using an iframe.
-   Provides a close button to close the popup.
-   Provides a "Next" button to play the next video in the playlist (if `hasNext` is true).
-   Calls the `onClose` function when the popup is closed.
-   Calls the `onNext` function when the "Next" button is clicked.

## Example Usage

```jsx
<VideoPlayerPopup
    video={{
        url: "https://www.youtube.com/watch?v=VIDEO_ID",
        title: "Video Title",
        description: "Video Description",
        thumbnailUrl: "https://example.com/thumbnail.jpg",
    }}
    onClose={() => console.log("Popup closed")}
    onNext={() => console.log("Next video")}
    hasNext={true}
/>
