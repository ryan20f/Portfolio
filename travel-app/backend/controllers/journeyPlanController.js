const db = require('../db');

// Fetch all journey plans for authenticated user based on `user_id`
exports.getAllForUser = async (req, res) => {
    try {
        console.log("Fetching journey plans for userId:", req.userId);  // Log userId here
        const [rows] = await db.query('SELECT * FROM journey_plans WHERE user_id = ?', [req.userId]);
        
        if (rows.length === 0) {
            console.log('No journey plans found for this user');
            return res.status(404).json({ message: 'No journey plans available' });
        }

        console.log("Fetched journey plans:", rows);  // Log the response data
        return res.json(rows);
    } catch (err) {
        console.error("Error fetching journey plans:", err.sqlMessage || err.message);
        return res.status(500).json({ error: err.sqlMessage || err.message });
    }
};

// Create a new journey plan
exports.create = async (req, res) => {
    const { name, locations, start_date, end_date, activities, description } = req.body;

    if (!name || !start_date || !end_date) {
        return res.status(400).json({ message: 'Name, start date, and end date are required' });
    }

    try {
        // Create journey plan
        const result = await db.query(
            `INSERT INTO journey_plans (user_id, name, locations, start_date, end_date, activities, description) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                req.userId,
                name,
                locations,
                start_date,
                end_date,
                activities,
                description || null
            ]
        );
        
        const journeyPlanId = result[0].insertId;

        // Step 2: Add the new journey plan ID to the user's journey_plan_ids field (comma-separated values)
        await db.query(
            `UPDATE Users SET journey_plan_ids = IFNULL(CONCAT(IFNULL(journey_plan_ids, ''), ?, ','), ?) WHERE id = ?`,
            [journeyPlanId, journeyPlanId, req.userId]
        );

        res.json({ message: 'Journey plan created successfully.' });
    } catch (err) {
        console.error("Error creating journey plan:", err.sqlMessage || err.message);
        return res.status(500).json({ error: err.sqlMessage || err.message });
    }
};

// Update an existing journey plan
exports.update = async (req, res) => {
    const { id } = req.params;
    const { name, locations, start_date, end_date, activities, description } = req.body;

    if (!name || !start_date || !end_date) {
        return res.status(400).json({ message: 'Name, start date, and end date are required' });
    }

    try {
        const [existingPlan] = await db.query('SELECT * FROM journey_plans WHERE id = ? AND user_id = ?', [id, req.userId]);

        if (existingPlan.length === 0) {
            return res.status(404).json({ message: 'Journey plan not found' });
        }

        await db.query(
            `UPDATE journey_plans SET name = ?, locations = ?, start_date = ?, end_date = ?, activities = ?, description = ? 
             WHERE id = ?`,
            [
                name,
                locations,  // Store locations as plain text
                start_date,
                end_date,
                activities, // Store activities as plain text
                description || null,
                id
            ]
        );
        return res.json({ message: 'Journey plan updated successfully.' });
    } catch (err) {
        console.error("Error updating journey plan:", err.sqlMessage || err.message);
        return res.status(500).json({ error: err.sqlMessage || err.message });
    }
};

// Delete a journey plan
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const [existingPlan] = await db.query('SELECT * FROM journey_plans WHERE id = ? AND user_id = ?', [id, req.userId]);

        if (existingPlan.length === 0) {
            return res.status(404).json({ message: 'Journey plan not found' });
        }

        await db.query('DELETE FROM journey_plans WHERE id = ?', [id]);
        return res.json({ message: 'Journey plan deleted successfully.' });
    } catch (err) {
        console.error("Error deleting journey plan:", err.sqlMessage || err.message);
        return res.status(500).json({ error: err.sqlMessage || err.message });
    }
};