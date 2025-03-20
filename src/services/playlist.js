import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db } from "./firebase";

// Create a new playlist
export const createPlaylist = async (playlistData, userId) => {
  try {
    const playlistWithUser = {
      ...playlistData,
      userId,
      isHidden: playlistData.isHidden || false, // Add support for hiding playlists
      isFavorite: playlistData.isFavorite || false, // Add support for favorite playlists
      viewCount: 0, // Initialize viewCount to 0
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "playlists"), playlistWithUser);
    return { id: docRef.id, ...playlistWithUser };
  } catch (error) {
    console.error("Error creating playlist: ", error);
    return { error };
  }
};

// Get a playlist by ID
export const getPlaylist = async (playlistId) => {
  try {
    const playlistDoc = await getDoc(doc(db, "playlists", playlistId));
    
    if (playlistDoc.exists()) {
      return { playlist: { id: playlistDoc.id, ...playlistDoc.data() } };
    } else {
      return { error: "Playlist not found" };
    }
  } catch (error) {
    return { error };
  }
};

// Update a playlist
export const updatePlaylist = async (playlistId, playlistData) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    
    await updateDoc(playlistRef, {
      ...playlistData,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Delete a playlist
export const deletePlaylist = async (playlistId) => {
  try {
    await deleteDoc(doc(db, "playlists", playlistId));
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Get user playlists
export const getUserPlaylists = async (userId) => {
  try {
    // Fixed to handle the index building error
    // Use a simple query until the index is built
    // Just filter by userId without ordering
    const q = query(
      collection(db, "playlists"),
      where("userId", "==", userId)
      // Removed orderBy until the index is built
    );
    
    const querySnapshot = await getDocs(q);
    const playlists = [];
    
    querySnapshot.forEach((doc) => {
      playlists.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort the data in memory after fetching
    playlists.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    return { playlists };
  } catch (error) {
    return { error };
  }
};

// Get all playlists with pagination
export const getAllPlaylists = async (lastVisible = null, itemsPerPage = 8) => {
  try {
    console.log(`getAllPlaylists called with lastVisible: ${lastVisible ? 'exists' : 'null'}, itemsPerPage: ${itemsPerPage}`);
    
    let q;
    
    if (lastVisible) {
      q = query(
        collection(db, "playlists"),
        // Add filter to exclude hidden playlists
        where("isHidden", "!=", true),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(itemsPerPage)
      );
    } else {
      q = query(
        collection(db, "playlists"),
        // Add filter to exclude hidden playlists
        where("isHidden", "!=", true),
        orderBy("createdAt", "desc"),
        limit(itemsPerPage)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const playlists = [];
    
    querySnapshot.forEach((doc) => {
      playlists.push({ id: doc.id, ...doc.data() });
    });
    
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    console.log(`Fetched ${playlists.length} playlists, lastDoc: ${lastDoc ? 'exists' : 'null'}`);
    
    return { 
      playlists,
      lastVisible: lastDoc
    };
  } catch (error) {
    console.error("Error in getAllPlaylists:", error);
    
    // Add fallback logic for index errors
    if (error.code === 'failed-precondition') {
      console.log("Index building error detected, using fallback query");
      
      try {
        // Handle the index building error by fetching without ordering
        const simpleQuery = query(
          collection(db, "playlists"),
          where("isHidden", "!=", true),
          limit(itemsPerPage * 2) // Fetch more to ensure we have enough for pagination
        );
        
        const querySnapshot = await getDocs(simpleQuery);
        let allPlaylists = [];
        
        querySnapshot.forEach((doc) => {
          allPlaylists.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort in memory
        allPlaylists.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        console.log(`Fallback query fetched ${allPlaylists.length} playlists`);
        
        // If lastVisible is provided, we need to find where to start
        if (lastVisible && lastVisible.id) {
          const lastVisibleIndex = allPlaylists.findIndex(p => p.id === lastVisible.id);
          if (lastVisibleIndex !== -1) {
            allPlaylists = allPlaylists.slice(lastVisibleIndex + 1);
            console.log(`Sliced from index ${lastVisibleIndex + 1}, ${allPlaylists.length} playlists remaining`);
          }
        }
        
        // Get the current page and the next lastVisible
        const currentPage = allPlaylists.slice(0, itemsPerPage);
        const nextLastVisible = allPlaylists.length > itemsPerPage ? 
          { id: currentPage[currentPage.length - 1].id } : null;
        
        console.log(`Returning ${currentPage.length} playlists, nextLastVisible: ${nextLastVisible ? 'exists' : 'null'}`);
        
        return { 
          playlists: currentPage,
          lastVisible: nextLastVisible,
          indexBuilding: true
        };
      } catch (fallbackError) {
        console.error("Error in fallback query:", fallbackError);
        return { 
          error: "Failed to load playlists. Please try again later.",
          originalError: error
        };
      }
    }
    
    return { error: "Failed to load playlists", originalError: error };
  }
};

// Search playlists
export const searchPlaylists = async (searchTerm) => {
  try {
    // Firestore doesn't support full-text search natively
    // This is a simple implementation that gets all playlists and filters them
    // In a production app, you might want to use Algolia or a similar service
    const querySnapshot = await getDocs(
      query(collection(db, "playlists"), where("isHidden", "!=", true))
    );
    const playlists = [];
    const searchTermLower = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Check if playlist name or description matches
      const playlistMatches = 
        data.name.toLowerCase().includes(searchTermLower) ||
        (data.description && data.description.toLowerCase().includes(searchTermLower));
      
      // Only include playlists that match by name or description
      // No longer searching in videos
      if (playlistMatches) {
        playlists.push({ id: doc.id, ...data });
      }
    });
    
    return { playlists };
  } catch (error) {
    return { error };
  }
};

// Add a video to a playlist
export const addVideoToPlaylist = async (playlistId, videoData) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistRef);
    
    if (!playlistDoc.exists()) {
      return { error: "Playlist not found" };
    }
    
    const playlistData = playlistDoc.data();
    const videos = playlistData.videos || [];
    
    // Add the new video
    const updatedVideos = [...videos, { ...videoData, addedAt: new Date().toISOString() }];
    
    await updateDoc(playlistRef, {
      videos: updatedVideos,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Remove a video from a playlist
export const removeVideoFromPlaylist = async (playlistId, videoIndex) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistRef);
    
    if (!playlistDoc.exists()) {
      return { error: "Playlist not found" };
    }
    
    const playlistData = playlistDoc.data();
    const videos = playlistData.videos || [];
    
    // Remove the video at the specified index
    const updatedVideos = videos.filter((_, index) => index !== videoIndex);
    
    await updateDoc(playlistRef, {
      videos: updatedVideos,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Update a video's info in a playlist
export const updateVideoInPlaylist = async (playlistId, videoIndex, updatedVideoData) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistRef);
    
    if (!playlistDoc.exists()) {
      return { error: "Playlist not found" };
    }
    
    const playlistData = playlistDoc.data();
    const videos = playlistData.videos || [];
    
    if (videoIndex < 0 || videoIndex >= videos.length) {
      return { error: "Video index out of bounds" };
    }
    
    // Update the video at the specified index, preserving other properties like addedAt
    const updatedVideos = [...videos];
    updatedVideos[videoIndex] = {
      ...videos[videoIndex],
      ...updatedVideoData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(playlistRef, {
      videos: updatedVideos,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, video: updatedVideos[videoIndex] };
  } catch (error) {
    return { error };
  }
};

// Update view count for a playlist
export const updateViewCount = async (playlistId) => {
  try {
    const playlistDocRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistDocRef);
    
    if (!playlistDoc.exists()) {
      return { error: "Playlist not found" };
    }
    
    const currentViewCount = playlistDoc.data().viewCount || 0;
    
    await updateDoc(playlistDocRef, {
      viewCount: currentViewCount + 1
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating view count: ", error);
    return { error };
  }
};

// Update playlists without viewCount field
export const updatePlaylistsWithoutViewCount = async () => {
  try {
    // Get all playlists
    const querySnapshot = await getDocs(collection(db, "playlists"));
    
    // Update playlists without viewCount
    const updatePromises = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.viewCount === undefined) {
        updatePromises.push(
          updateDoc(doc.ref, { viewCount: 0 })
        );
      }
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    return { 
      success: true, 
      updatedCount: updatePromises.length 
    };
  } catch (error) {
    console.error("Error updating playlists without view count: ", error);
    return { error };
  }
};
