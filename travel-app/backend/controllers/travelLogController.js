const db = require('../db');

// Fetch all travel logs for authenticated user based on `travel_log_ids`
exports.getAllForUser = async (req, res) => {
    try {
        console.log("Fetching travel logs for userId:", req.userId);  // Add a log here to check if userId is passed correctly
        const [rows] = await db.query('SELECT * FROM travel_logs WHERE user_id = ?', [req.userId]);
        
        if (rows.length === 0) {
            console.log('No travel logs found for this user');
            return res.status(404).json({ message: 'No travel logs available' });
        }

        console.log("Fetched travel logs:", rows);  // Log the response data
        return res.json(rows);
    } catch (err) {
        console.error("Error fetching travel logs:", err.sqlMessage || err.message);
        return res.status(500).json({ error: err.sqlMessage || err.message });
    }
};

// Create a new travel log
exports.create = async (req, res) => {
    const { title, description, start_date, end_date, tags } = req.body;

    console.log("Request body received:", req.body);
    console.log("User ID from middleware:", req.userId);

    if (!req.userId) {
        return res.status(400).json({ message: 'User not authenticated' });
    }

    if (!title || !description || !start_date || !end_date) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (new Date(start_date) > new Date(end_date)) {
        return res.status(400).json({ message: "Start date cannot be after the end date" });
    }

    try {
        const post_date = new Date();
        const tagsToSave = tags || null;

        // Step 1: Create the travel log
        const result = await db.query(
            'INSERT INTO travel_logs (user_id, title, description, start_date, end_date, post_date, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.userId, title, description, start_date, end_date, post_date, tagsToSave]
        );

        const travelLogId = result[0].insertId;

        // Step 2: Add the new travel log ID to the user's travel_log_ids field (comma-separated values)
        await db.query(
            `UPDATE Users SET travel_log_ids = IFNULL(CONCAT(IFNULL(travel_log_ids, ''), ?, ','), ?) WHERE id = ?`,
            [travelLogId, travelLogId, req.userId]
        );

        res.json({ message: 'Travel log created successfully!' });
    } catch (err) {
        console.error("Error inserting travel log:", err);
        res.status(500).json({ error: err.message });
    }
};

// Update an existing travel log
exports.update = async (req, res) => {
    const { id } = req.params;
    const { title, description, start_date, end_date, tags } = req.body;

    console.log("Updating travel log with id:", id);
    console.log("Middleware passed userId:", req.userId);

    if (!title || !description || !start_date || !end_date) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        await db.query(
            'UPDATE travel_logs SET title = ?, description = ?, start_date = ?, end_date = ?, tags = ? WHERE id = ? AND user_id = ?',
            [title, description, start_date, end_date, tags, id, req.userId]
        );
        res.json({ message: 'Travel log updated.' });
    } catch (err) {
        console.error("Error updating travel log:", err);
        res.status(500).json({ error: err.message });
    }
};

// Delete a travel log
exports.delete = async (req, res) => {
    const { id } = req.params;

    console.log("Deleting travel log with id:", id);
    console.log("Middleware passed userId:", req.userId);

    try {
        await db.query('DELETE FROM travel_logs WHERE id = ? AND user_id = ?', [id, req.userId]);
        res.json({ message: 'Travel log deleted.' });
    } catch (err) {
        console.error("Error deleting travel log:", err);
        res.status(500).json({ error: err.message });
    }
};