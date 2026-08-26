import pool from "../config/db.js";

export const createSale = async (req, res) => {
    const client = await pool.connect();

    try {
        const { customer_id, sale_date, products } = req.body;
        const userId = req.user.id;

        if (
            !customer_id ||
            !sale_date ||
            !Array.isArray(products) ||
            products.length === 0
        ) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }

        await client.query("BEGIN");

        const customer = await client.query(
            `SELECT * FROM customer
       WHERE customer_id = $1
       AND user_id = $2`,
            [customer_id, userId]
        );

        if (customer.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                message: "Customer not found",
            });
        }

        let totalAmount = 0;

        const saleResult = await client.query(
            `INSERT INTO sales
      (customer_id, sale_date, total_amount)
      VALUES ($1,$2,$3)
      RETURNING *`,
            [customer_id, sale_date, 0]
        );

        const saleId = saleResult.rows[0].sale_id;

        for (const item of products) {
            const productResult = await client.query(
                `SELECT p.*
         FROM products p
         JOIN category_of_products c
         ON p.category_of_product_id = c.cat_id
         WHERE p.product_id = $1
         AND c.user_id = $2`,
                [item.product_id, userId]
            );

            if (productResult.rows.length === 0) {
                throw new Error(
                    `Product ${item.product_id} not found`
                );
            }

            const product = productResult.rows[0];

            // Check stock
            if (product.stock < item.quantity) {
                throw new Error(
                    `${product.product_name} has only ${product.stock} items left in stock`
                );
            }

            // Reduce stock
            await client.query(
                `UPDATE products
     SET quantity = quantity - $1
     WHERE product_id = $2`,
                [item.quantity, item.product_id]
            );

            const subtotal =
                Number(product.product_price) *
                Number(item.quantity);

            totalAmount += subtotal;

            await client.query(
                `INSERT INTO sale_items
        (
          sale_id,
          product_id,
          quantity,
          price,
          subtotal
        )
        VALUES ($1,$2,$3,$4,$5)`,
                [
                    saleId,
                    item.product_id,
                    item.quantity,
                    product.product_price,
                    subtotal,
                ]
            );
        }

        await client.query(
            `UPDATE sales
       SET total_amount = $1
       WHERE sale_id = $2`,
            [totalAmount, saleId]
        );

        await client.query("COMMIT");

        return res.status(201).json({
            message: "Sale created successfully",
            sale_id: saleId,
            total_amount: totalAmount,
        });
    } catch (error) {
        await client.query("ROLLBACK");

        return res.status(500).json({
            message: error.message,
        });
    } finally {
        client.release();
    }
};
export const getAllSales = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
  SELECT
    s.sale_id,
    c.customer_name,
    s.sale_date,
    s.total_amount
  FROM sales s
  JOIN customer c
  ON s.customer_id = c.customer_id
  WHERE c.user_id = $1
  ORDER BY s.sale_id DESC
  `,
            [userId]
        );

        return res.status(200).json({
            sales: result.rows
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};
export const getSaleById = async (req, res) => {
    const { sale_id } = req.params;

    const result = await pool.query(
        `
    SELECT
      p.product_name,
      si.quantity,
      si.price,
      si.subtotal
    FROM sale_items si
    JOIN products p
    ON si.product_id = p.product_id
    WHERE si.sale_id = $1
    `,
        [sale_id]
    );

    res.status(200).json({
        products: result.rows,
    });
};
export const deleteSale = async (req, res) => {
    try {
        const { sale_id } = req.params;
        const userId = req.user.id;

        const sale = await pool.query(
            `
      SELECT s.sale_id
      FROM sales s
      JOIN customer c
      ON s.customer_id = c.customer_id
      WHERE s.sale_id = $1
      AND c.user_id = $2
      `,
            [sale_id, userId]
        );

        if (sale.rows.length === 0) {
            return res.status(404).json({
                message: "Sale not found",
            });
        }

        await pool.query(
            `DELETE FROM sales
       WHERE sale_id = $1`,
            [sale_id]
        );

        return res.status(200).json({
            message: "Sale deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};