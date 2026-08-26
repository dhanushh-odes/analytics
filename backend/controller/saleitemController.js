import pool from '../config/db.js';
export const getSaleItemsBySaleId = async (req, res) => {
  try {
    const { sale_id } = req.params;

    const result = await pool.query(
      `
      SELECT
        si.sale_item_id,
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

    return res.status(200).json({
      products: result.rows,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteSaleItem = async (req, res) => {
  const client = await pool.connect();

  try {
    const { sale_item_id } = req.params;

    await client.query("BEGIN");

    const item = await client.query(
      `
      SELECT *
      FROM sale_items
      WHERE sale_item_id = $1
      `,
      [sale_item_id]
    );

    if (item.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Sale item not found",
      });
    }

    const saleId = item.rows[0].sale_id;
    const subtotal = Number(item.rows[0].subtotal);

    await client.query(
      `
      DELETE FROM sale_items
      WHERE sale_item_id = $1
      `,
      [sale_item_id]
    );

    await client.query(
      `
      UPDATE sales
      SET total_amount = total_amount - $1
      WHERE sale_id = $2
      `,
      [subtotal, saleId]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Sale item deleted successfully",
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
export const addSaleItem = async (req, res) => {
  const client = await pool.connect();

  try {
    const { sale_id } = req.params;
    const { product_id, quantity } = req.body;

    await client.query("BEGIN");

    const product = await client.query(
      `
      SELECT *
      FROM products
      WHERE product_id = $1
      `,
      [product_id]
    );

    if (product.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Product not found",
      });
    }

    const price = Number(product.rows[0].product_price);
    const subtotal = price * Number(quantity);

    const result = await client.query(
      `
      INSERT INTO sale_items
      (
        sale_id,
        product_id,
        quantity,
        price,
        subtotal
      )
      VALUES($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        sale_id,
        product_id,
        quantity,
        price,
        subtotal,
      ]
    );

    await client.query(
      `
      UPDATE sales
      SET total_amount = total_amount + $1
      WHERE sale_id = $2
      `,
      [subtotal, sale_id]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Product added to sale",
      item: result.rows[0],
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
export const updateSaleItemQuantity = async (req, res) => {
  const client = await pool.connect();

  try {
    const { sale_item_id } = req.params;
    const { quantity } = req.body;

    await client.query("BEGIN");

    const item = await client.query(
      `
      SELECT *
      FROM sale_items
      WHERE sale_item_id = $1
      `,
      [sale_item_id]
    );

    if (item.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Sale item not found",
      });
    }

    const row = item.rows[0];

    const newSubtotal =
      Number(row.price) * Number(quantity);

    await client.query(
      `
      UPDATE sale_items
      SET quantity = $1,
          subtotal = $2
      WHERE sale_item_id = $3
      `,
      [
        quantity,
        newSubtotal,
        sale_item_id,
      ]
    );

    const diff =
      newSubtotal - Number(row.subtotal);

    await client.query(
      `
      UPDATE sales
      SET total_amount = total_amount + $1
      WHERE sale_id = $2
      `,
      [diff, row.sale_id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Quantity updated",
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