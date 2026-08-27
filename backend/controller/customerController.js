import pool from "../config/db.js";

export const createCustomer = async (req, res) => {
    try {

        const {
            customer_name,
            customer_email,
            phone_number,
            city
        } = req.body;

        const userId = req.user.id;

        if (!customer_name || !customer_email || !phone_number || !city) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (
            typeof customer_name !== "string" ||
            typeof customer_email !== "string" ||
            typeof phone_number !== "string" ||
            typeof city !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid input type"
            });
        }

        const existingCustomer = await pool.query(
            `SELECT *
             FROM customer
             WHERE user_id = $1
             AND customer_email = $2`,
            [userId, customer_email]
        );

        if (existingCustomer.rows.length > 0) {
            return res.status(400).json({
                message: "Customer already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO customer
            (user_id, customer_name, customer_email, phone_number, city)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                userId,
                customer_name,
                customer_email,
                phone_number,
                city
            ]
        );

        return res.status(201).json({
            message: "Customer created successfully",
            customer: result.rows[0]
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};
export const getAllCustomers = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                c.*,
                COUNT(s.sale_id) AS total_orders,
                COALESCE(SUM(s.total_amount), 0) AS total_spent

            FROM customer c

            LEFT JOIN sales s
            ON c.customer_id = s.customer_id

            WHERE c.user_id = $1

            GROUP BY c.customer_id

            ORDER BY c.customer_name
            `,
            [userId]
        );

        return res.status(200).json({
            customers: result.rows
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
export const deleteCustomer = async (req, res) => {

    try {

        const { customer_id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            `DELETE FROM customer
             WHERE customer_id = $1
             AND user_id = $2
             RETURNING *`,
            [customer_id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            message: "Customer deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};
export const updateCustomer = async (req, res) => {
    try {
        const { customer_id } = req.params;
        const userId = req.user.id;

        const {
            customer_name,
            customer_email,
            phone_number,
            city
        } = req.body;

        const customer = await pool.query(
            `SELECT *
             FROM customer
             WHERE customer_id = $1
             AND user_id = $2`,
            [customer_id, userId]
        );

        if (customer.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        const currentCustomer = customer.rows[0];

        const updatedName =
            customer_name ?? currentCustomer.customer_name;

        const updatedEmail =
            customer_email ?? currentCustomer.customer_email;

        const updatedPhone =
            phone_number ?? currentCustomer.phone_number;

        const updatedCity =
            city ?? currentCustomer.city;

        if (customer_email) {
            const existingCustomer = await pool.query(
                `SELECT *
                 FROM customer
                 WHERE user_id = $1
                 AND customer_email = $2
                 AND customer_id != $3`,
                [userId, customer_email, customer_id]
            );

            if (existingCustomer.rows.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }
        }

        const result = await pool.query(
            `UPDATE customer
             SET customer_name = $1,
                 customer_email = $2,
                 phone_number = $3,
                 city = $4
             WHERE customer_id = $5
             AND user_id = $6
             RETURNING *`,
            [
                updatedName,
                updatedEmail,
                updatedPhone,
                updatedCity,
                customer_id,
                userId
            ]
        );

        return res.status(200).json({
            message: "Customer updated successfully",
            customer: result.rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};