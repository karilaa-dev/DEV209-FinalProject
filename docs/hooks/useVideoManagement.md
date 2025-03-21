# useVideoManagement Hook Documentation

The `useVideoManagement` hook provides a way to manage video-related functionality in a playlist.

## Functionality

-   Manages a list of videos, allowing users to add, remove, and reorder videos.
-   Provides state variables for video URL, title, and description.
-   Extracts video ID and thumbnail from YouTube URLs.

## Returns

The hook returns an object containing the following properties:

-   `videos`: An array of video objects.
-   `setVideos`: A function to set the videos array.
-   `videoUrl`: The current video URL (string).
-   `setVideoUrl`: A function to set the video URL.
-   `videoTitle`: The current video title (string).
-   `setVideoTitle`: A function to set the video title.
-   `videoDescription`: The current video description (string).
-   `setVideoDescription`: A function to set the video description.
-   `addVideo`: A function to add a new video to the list.
-   `selectVideo`: A function to select a video and add it to the list.
-   `removeVideo`: A function to remove a video from the list.
-   `moveVideoUp`: A function to move a video up in the list.
-   `moveVideoDown`: A function to move a video down in the list.

## Example Usage

```jsx
import { useVideoManagement } from '../hooks/useVideoManagement';

function MyComponent() {
    const {
        videos,
        setVideoUrl,
        setVideoTitle,
        setVideoDescription,
        addVideo,
        removeVideo,
        moveVideoUp,
        moveVideoDown,
    } = useVideoManagement();

    return (
        <div>
            <h2>Videos</h2>
            <ul>
                {videos.map((video, index) => (
                    <li key={index}>
                        {video.title}
                        <button onClick={() => removeVideo(index)}>Remove</button>
                        <button onClick={() => moveVideoUp(index)}>Up</button>
                        <button onClick={() => moveVideoDown(index)}>Down</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Video URL"
                onChange={(e) => setVideoUrl(e.target.value)}
            />
            <input
                type="text"
                placeholder="Video Title"
                onChange={(e) => setVideoTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Video Description"
                onChange={(e) => setVideoDescription(e.target.value)}
            />
            <button onClick={addVideo}>Add Video</button>
        </div>
    );
}
