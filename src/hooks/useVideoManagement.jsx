import { useState } from "react";
import { extractVideoId } from "../services/youtube";

/**
 * Custom hook for managing a list of videos
 * @param {array} initialVideos - Initial array of videos (optional)
 * @returns {object} - Object containing video state and management functions
 */
const useVideoManagement = (initialVideos = []) => {
  const [videos, setVideos] = useState(initialVideos);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");

  /**
   * Adds a new video to the list
   * @returns {boolean} - True if the video was added successfully, false otherwise
   */
  const addVideo = () => {
    if (!videoUrl.trim()) {
      return false;
    }

    // Simple validation for YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(videoUrl)) {
      return false;
    }

    // Extract thumbnail from YouTube URL
    const videoId = extractVideoId(videoUrl);
    const thumbnailUrl = videoId
      ? `https://img.youtube.com/vi/${videoId}/0.jpg`
      : null;

    const newVideo = {
      url: videoUrl,
      title: videoTitle.trim() || "Untitled Video",
      description: videoDescription.trim(),
      thumbnailUrl,
      addedAt: new Date().toISOString(),
    };

    setVideos([...videos, newVideo]);
    setVideoUrl("");
    setVideoTitle("");
    setVideoDescription("");
    return true;
  };

  /**
   * Selects a video and adds it to the list
   * @param {object} video - The video object to select
   */
  const selectVideo = (video) => {
    const newVideo = {
      url: video.url,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      addedAt: new Date().toISOString(),
    };

    setVideos([...videos, newVideo]);
  };

  /**
   * Removes a video from the list
   * @param {number} index - The index of the video to remove
   */
  const removeVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
  };

  /**
   * Moves a video up in the list
   * @param {number} index - The index of the video to move
   */
  const moveVideoUp = (index) => {
    if (index === 0) return; // Already at the top

    const updatedVideos = [...videos];
    const temp = updatedVideos[index];
    updatedVideos[index] = updatedVideos[index - 1];
    updatedVideos[index - 1] = temp;

    setVideos(updatedVideos);
  };

  /**
   * Moves a video down in the list
   * @param {number} index - The index of the video to move
   */
  const moveVideoDown = (index) => {
    if (index === videos.length - 1) return; // Already at the bottom

    const updatedVideos = [...videos];
    const temp = updatedVideos[index];
    updatedVideos[index] = updatedVideos[index + 1];
    updatedVideos[index + 1] = temp;

    setVideos(updatedVideos);
  };

  return {
    videos,
    setVideos,
    videoUrl,
    setVideoUrl,
    videoTitle,
    setVideoTitle,
    videoDescription,
    setVideoDescription,
    addVideo,
    selectVideo,
    removeVideo,
    moveVideoUp,
    moveVideoDown,
  };
};

export default useVideoManagement;
