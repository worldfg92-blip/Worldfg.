// ================= WORLDFG FEED ALGORITHM =================
// Full Instagram-style ranking system

function getFeedForUser(userId) {
    var db = WorldFG;
    var posts = db.posts || [];
    var follows = db.follows || [];

    // Who the user follows
    var following = follows
        .filter(f => f.a === userId)
        .map(f => f.b);

    // Score each post
    var scored = posts.map(post => {
        var score = 0;

        var isOwn = post.userId === userId;
        var isFollowing = following.includes(post.userId);

        // FOLLOW PRIORITY
        if (isOwn) score += 10;
        if (isFollowing) score += 25;
        else score += 2;

        // ENGAGEMENT
        var likes = (post.likes || []).length;
        var comments = (post.comments || []).length;

        score += likes * 2;
        score += comments * 3;

        // RECENCY
        var ageHours = (Date.now() - new Date(post.time).getTime()) / 36e5;

        if (ageHours < 1) score += 30;
        else if (ageHours < 6) score += 20;
        else if (ageHours < 24) score += 12;
        else if (ageHours < 72) score += 6;
        else score += 1;

        // MEDIA BOOST
        if (post.mediaId) score += 10;

        // VIRAL BOOST
        if (likes > 50) score += 15;
        if (comments > 20) score += 20;

        return { ...post, score };
    });

    // Sort by score
    scored.sort((a, b) => b.score - a.score);

    // Prevent spam (max 3 posts per user in feed)
    var seen = {};
    var feed = [];

    for (var i = 0; i < scored.length; i++) {
        var p = scored[i];

        if (!seen[p.userId]) seen[p.userId] = 0;

        if (seen[p.userId] < 3) {
            feed.push(p);
            seen[p.userId]++;
        }
    }

    return feed;
}