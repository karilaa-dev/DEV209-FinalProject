// YouTube API Service
// This service handles interactions with the YouTube Data API

// API key from environment variables
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// Base URL for the YouTube Data API
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Search YouTube videos
 * @param {string} query - The search query
 * @param {number} maxResults - Maximum number of results to return (default: 5)
 * @returns {Promise} - Promise that resolves with search results
 */
export const searchYouTubeVideos = async (query, maxResults = 5) => {
  try {
    if (!query.trim()) {
      return { videos: [], error: null };
    }

    const response = await fetch(
      `${BASE_URL}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to search YouTube videos');
    }

    const data = await response.json();
    
    // Map the response to a more usable format
    const videos = data.items.map(item => ({
      id: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));

    return { videos, error: null };
  } catch (error) {
    return handleServiceError(error, 'YouTube search error');
  }
};

/**
 * Get video details by ID
 * @param {string} videoId - YouTube video ID
 * @returns {Promise} - Promise that resolves with video details
 */
export const getVideoDetails = async (videoId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet&id=${videoId}&key=${API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get video details');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }
    
    const videoData = data.items[0];
    return {
      id: videoData.id,
      url: `https://www.youtube.com/watch?v=${videoData.id}`,
      title: videoData.snippet.title,
      description: videoData.snippet.description,
      thumbnailUrl: videoData.snippet.thumbnails.medium.url,
      channelTitle: videoData.snippet.channelTitle,
      publishedAt: videoData.snippet.publishedAt
    };
  } catch (error) {
    return handleServiceError(error, 'Error fetching video details');
  }
};

/**
 * Extract YouTube video ID from a URL
 * @param {string} url - YouTube video URL
 * @returns {string|null} - YouTube video ID or null if invalid
 */
export const extractVideoId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};
