import pool from '../config/db.js';
export const createProduct=async(req,res)=>{
    try{
 const{product_name,product_price,category_of_product_id,quantity}=req.body;
 const userId=req.user.id;
 if (
  !product_name ||
  product_price === undefined ||
  category_of_product_id === undefined ||
  quantity === undefined
){
    return res.status(400).json({message:'Please provide all required fields'});
 }
    const price = Number(product_price);
const qty = Number(quantity);
const categoryId = Number(category_of_product_id);

if (
  isNaN(price) ||
  isNaN(qty) ||
  isNaN(categoryId)
) {
  return res.status(400).json({
    message: "Invalid input type"
  });
}
    const category = await pool.query(
    "SELECT * FROM category_of_products WHERE cat_id = $1 AND user_id = $2",
    [categoryId, userId]
);

if (category.rows.length === 0) {
    return res.status(404).json({
        message: "Category not found"
    });}
    

const existingProduct=await pool.query(
        "SELECT * FROM products WHERE category_of_product_id=$1 AND product_name=$2",
        [categoryId, product_name]
    );
    if(existingProduct.rows.length>0){
        return res.status(400).json({message:'Product already exists'});
    }
    
    const result=await pool.query(
        "INSERT INTO products(product_name,product_price,category_of_product_id,quantity) VALUES($1,$2,$3,$4) RETURNING *",
        [product_name,price,categoryId,qty]
    );
    return res.status(201).json({message:'Product created successfully',product:result.rows[0]});

} catch(error){
    console.error(error);
    return res.status(500).json({message:'Internal server error'});
}}
export const getAllproducts= async(req,res)=>{
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT p.* , c.category_name
             FROM products p
             JOIN category_of_products c
             ON p.category_of_product_id = c.cat_id
             WHERE c.user_id = $1`,
            [userId]
        );

        return res.status(200).json({
            products: result.rows
        }
       )
    } catch (error) {
        return res.status(500).json({message:"error occured"})
        
    }
}
export const deleteProduct=async(req,res)=>{
    const {product_id}=req.params;
    const userId = req.user.id;
    try {
        const result=await pool.query(
            `SELECT p.*
     FROM products p
     JOIN category_of_products c
     ON p.category_of_product_id = c.cat_id
     WHERE p.product_id = $1
     AND c.user_id = $2`,
    [product_id, userId]

        );
        if(result.rows.length===0){
            return res.status(404).json({message:'Product not found'});
        }
        await pool.query(
    "DELETE FROM products WHERE product_id = $1",
    [product_id]
);
        return res.status(200).json({message:'Product deleted successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Internal server error'});
    }
    
}