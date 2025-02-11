router.get("/search", async (req, res) => {
    const { query } = req.query;

    try {
        const users = await pool.query(
            "SELECT id, name, username, profile_picture FROM users WHERE username ILIKE $1",
            [`%${query}%`]
        );
        res.json(users.rows);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: "Server error" });
    }
});
