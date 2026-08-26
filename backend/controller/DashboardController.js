import pool from '../config/db.js';
export const totalCategories = async (req, res) => {
    try {

        const userId = req.user.id;

        const result = await pool.query(
            `SELECT COUNT(*) AS total_categories
             FROM category_of_products
             WHERE user_id = $1`,
            [userId]
        );

        res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
export const totalProducts = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(

            `SELECT COUNT(*) AS total_products
             FROM products p
             JOIN category_of_products c
             ON p.category_of_product_id = c.cat_id
             WHERE c.user_id = $1`,

            [userId]

        );

        res.status(200).json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
export const totalSales = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(

            `SELECT COUNT(*) AS total_sales
             FROM sales s
             JOIN products p
             ON s.product_id = p.product_id
             JOIN category_of_products c
             ON p.category_of_product_id = c.cat_id
             WHERE c.user_id = $1`,

            [userId]

        );

        res.status(200).json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};export const totalCustomers = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(

            `SELECT COUNT(*) AS total_customers
             FROM customer
             WHERE user_id = $1`,

            [userId]

        );

        res.status(200).json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
export const topSellingProducts = async (req, res) => {
    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                p.product_name,
                SUM(s.quantity) AS total_quantity
            FROM sales s
            JOIN products p
                ON s.product_id = p.product_id
            JOIN category_of_products c
                ON p.category_of_product_id = c.cat_id
            WHERE c.user_id = $1
            GROUP BY p.product_name
            ORDER BY total_quantity DESC
            LIMIT 5;
            `,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const salesByCategory = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                c.category_name,
                SUM(s.quantity) AS total_sales
            FROM sales s
            JOIN products p
                ON s.product_id = p.product_id
            JOIN category_of_products c
                ON p.category_of_product_id = c.cat_id
            WHERE c.user_id = $1
            GROUP BY c.category_name
            ORDER BY total_sales DESC;
            `,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
export const topCustomers = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                c.customer_name,
                COUNT(s.sale_id) AS total_purchases
            FROM sales s
            JOIN customer c
                ON s.customer_id = c.customer_id
            WHERE c.user_id = $1
            GROUP BY c.customer_name
            ORDER BY total_purchases DESC
            LIMIT 5;
            `,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
export const recentSales = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                c.customer_name,
                p.product_name,
                s.quantity,
                s.sale_date
            FROM sales s
            JOIN customer c
                ON s.customer_id = c.customer_id
            JOIN products p
                ON s.product_id = p.product_id
            JOIN category_of_products cp
                ON p.category_of_product_id = cp.cat_id
            WHERE cp.user_id = $1
            ORDER BY s.sale_date DESC
            LIMIT 10;
            `,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
export const monthlySales = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                TO_CHAR(s.sale_date, 'YYYY-MM') AS month,
                SUM(s.quantity) AS total_sales
            FROM sales s
            JOIN products p
                ON s.product_id = p.product_id
            JOIN category_of_products c
                ON p.category_of_product_id = c.cat_id
            WHERE c.user_id = $1
            GROUP BY month
            ORDER BY month;
            `,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};