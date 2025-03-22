router.get("/feed/:userId", async (req, res) => {
    let { userId } = req.params;
  
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
  
    userId = parseInt(userId, 10);
  
    try {
      const query = `
        SELECT 
          posts.*,
          users.username,
          users.profile_picture,
          COALESCE(like_counts.count, 0) AS likes_count,
          EXISTS (
            SELECT 1 FROM likes WHERE likes.user_id = $1 AND likes.post_id = posts.id
          ) AS is_liked_by_current_user
        FROM posts
        JOIN users ON users.id = posts.user_id
        LEFT JOIN (
          SELECT post_id, COUNT(*) as count FROM likes GROUP BY post_id
        ) AS like_counts ON posts.id = like_counts.post_id
        WHERE posts.user_id IN (
          SELECT following_id FROM followers WHERE follower_id = $1
        )
        OR NOT EXISTS (
          SELECT 1 FROM followers WHERE follower_id = $1
        )
        ORDER BY posts.created_at DESC
        LIMIT 50;
      `;
  
      const result = await pool.query(query, [userId]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching feed:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  