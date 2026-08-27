import pool from "../config/db.js";
export const createCategory = async (req, res) => {
    const { category_name } = req.body;

    const userId = req.user.id;
    if (!category_name) {
        return res.status(400).json({ message: 'Please provide category name' });
    }

    if (typeof category_name !== 'string') {
        return res.status(400).json({ message: 'Invalid input type' });
    }
    const existingCategory = await pool.query(
        `SELECT *
     FROM category_of_products
     WHERE user_id = $1
     AND category_name = $2`,
        [userId, category_name]
    );
    if (existingCategory.rows.length > 0) {
        return res.status(400).json({ message: 'Category already exists' });
    }
    const result = await pool.query(
        "INSERT INTO category_of_products(user_id,category_name) VALUES($1, $2) RETURNING *",
        [userId, category_name]
    );
    return res.status(201).json({ message: 'Category created successfully', category: result.rows[0] });
}
export const getAllCategories = async (req, res) => {
    const userId = req.user.id;
    const result = await pool.query(
        `SELECT
      c.cat_id,
      c.category_name,
      COUNT(p.product_id) AS products
   FROM category_of_products c
   LEFT JOIN products p
   ON c.cat_id = p.category_of_product_id
   WHERE c.user_id = $1
   GROUP BY c.cat_id, c.category_name`,
        [userId]
    );
    return res.status(200).json({ categories: result.rows });
}

export const deleteCategory = async (req, res) => {
    const { cat_id } = req.params;
    const userId = req.user.id;
    try {
        const products = await pool.query(
            "SELECT * FROM products WHERE category_of_product_id = $1",
            [cat_id]
        );

        if (products.rows.length > 0) {
            return res.status(400).json({
                message: "Cannot delete category with existing products"
            });
        }
        const result = await pool.query(
            "DELETE FROM category_of_products WHERE user_id = $1 AND cat_id = $2 RETURNING *",
            [userId, cat_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}
export const updateCategory = async (req, res) => {
    const { cat_id } = req.params;
    const { category_name } = req.body;
    const userId = req.user.id;

    try {
        if (!category_name) {
            return res.status(400).json({
                message: "Please provide category name"
            });
        }

        if (typeof category_name !== "string") {
            return res.status(400).json({
                message: "Invalid input type"
            });
        }

        // Check category belongs to user
        const category = await pool.query(
            `SELECT *
             FROM category_of_products
             WHERE cat_id = $1
             AND user_id = $2`,
            [cat_id, userId]
        );

        if (category.rows.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // Check duplicate category name
        const existingCategory = await pool.query(
            `SELECT *
             FROM category_of_products
             WHERE user_id = $1
             AND category_name = $2
             AND cat_id != $3`,
            [userId, category_name, cat_id]
        );

        if (existingCategory.rows.length > 0) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        const result = await pool.query(
            `UPDATE category_of_products
             SET category_name = $1
             WHERE cat_id = $2
             AND user_id = $3
             RETURNING *`,
            [category_name, cat_id, userId]
        );

        return res.status(200).json({
            message: "Category updated successfully",
            category: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};