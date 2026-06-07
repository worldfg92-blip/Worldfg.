// ================= WORLDFG STORIES SYSTEM =================
// 24H STORIES + VIEW TRACKING + USER GROUPING

(function() {
  
  // Ensure base object exists
  window.WorldFG = window.WorldFG || {};
  WorldFG.stories = WorldFG.stories || [];
  WorldFG.storyViews = WorldFG.storyViews || {};
  
  // ================= STORY MODEL =================
  /*
    story = {
      id,
      userId,
      mediaId,
      mediaType, // image | video
      text,
      time,
      expiresAt
    }
  */
  
  // ================= CREATE STORY =================
  function createStory(story) {
    var newStory = {
      id: "s_" + Date.now(),
      userId: story.userId,
      mediaId: story.mediaId || null,
      mediaType: story.mediaType || null,
      text: story.text || "",
      time: new Date().toISOString(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      views: []
    };
    
    WorldFG.stories.unshift(newStory);
    saveStories();
    return newStory;
  }
  
  // ================= GET ACTIVE STORIES =================
  function getActiveStories() {
    var now = Date.now();
    
    // remove expired
    WorldFG.stories = WorldFG.stories.filter(function(s) {
      return s.expiresAt > now;
    });
    
    saveStories();
    
    return WorldFG.stories;
  }
  
  // ================= GROUP STORIES BY USER =================
  function getStoriesFeed() {
    var active = getActiveStories();
    var grouped = {};
    
    active.forEach(function(story) {
      if (!grouped[story.userId]) {
        grouped[story.userId] = {
          userId: story.userId,
          stories: [],
          latestTime: story.time
        };
      }
      
      grouped[story.userId].stories.push(story);
      
      if (new Date(story.time) > new Date(grouped[story.userId].latestTime)) {
        grouped[story.userId].latestTime = story.time;
      }
    });
    
    return Object.values(grouped).sort(function(a, b) {
      return new Date(b.latestTime) - new Date(a.latestTime);
    });
  }
  
  // ================= VIEW STORY =================
  function viewStory(storyId, userId) {
    var story = WorldFG.stories.find(s => s.id === storyId);
    if (!story) return false;
    
    if (!story.views.includes(userId)) {
      story.views.push(userId);
      saveStories();
    }
    
    // track global view map
    if (!WorldFG.storyViews[userId]) {
      WorldFG.storyViews[userId] = [];
    }
    
    if (!WorldFG.storyViews[userId].includes(storyId)) {
      WorldFG.storyViews[userId].push(storyId);
    }
    
    saveStories();
    return true;
  }
  
  // ================= CHECK IF VIEWED =================
  function isViewed(storyId, userId) {
    var story = WorldFG.stories.find(s => s.id === storyId);
    if (!story) return false;
    return story.views.includes(userId);
  }
  
  // ================= DELETE STORY =================
  function deleteStory(storyId, userId) {
    WorldFG.stories = WorldFG.stories.filter(function(s) {
      return !(s.id === storyId && s.userId === userId);
    });
    
    saveStories();
  }
  
  // ================= CLEAN EXPIRED =================
  function cleanExpiredStories() {
    var now = Date.now();
    WorldFG.stories = WorldFG.stories.filter(function(s) {
      return s.expiresAt > now;
    });
    
    saveStories();
  }
  
  // ================= STORAGE =================
  function saveStories() {
    try {
      var db = JSON.parse(localStorage.getItem("WorldFG_DB") || "{}");
      
      db.stories = WorldFG.stories;
      db.storyViews = WorldFG.storyViews;
      
      localStorage.setItem("WorldFG_DB", JSON.stringify(db));
    } catch (e) {
      console.log("Story save error:", e);
    }
  }
  
  function loadStories() {
    try {
      var db = JSON.parse(localStorage.getItem("WorldFG_DB") || "{}");
      
      if (db.stories) WorldFG.stories = db.stories;
      if (db.storyViews) WorldFG.storyViews = db.storyViews;
      
    } catch (e) {
      console.log("Story load error:", e);
    }
  }
  
  // ================= AUTO CLEANER =================
  setInterval(cleanExpiredStories, 60000); // every 1 min
  
  // ================= EXPORT =================
  window.WorldFGStories = {
    createStory: createStory,
    getActiveStories: getActiveStories,
    getStoriesFeed: getStoriesFeed,
    viewStory: viewStory,
    isViewed: isViewed,
    deleteStory: deleteStory,
    cleanExpired: cleanExpiredStories
  };
  
  loadStories();
  
  console.log("WorldFG Stories System Loaded");
  
})();