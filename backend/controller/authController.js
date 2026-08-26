import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';


export const registerUser=async (req, res) => {
  const { name, email, password,role='manager' } = req.body;
     if(!name || !email || !password){
    return res.status(400).json({ message: 'Please provide all required fields' });
   }
   if(typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof role !== 'string'){
    return res.status(400).json({ message: 'Invalid input types' });}
   const  existingUser = await  pool.query(
 " SELECT * FROM  users WHERE email = $1",
   [email]);
   if(existingUser.rows.length > 0){
    return res.status(400).json({ message: 'User already exists' });
   };
   const hashedPassword = await bcrypt.hash(password, 10);
   const result = await pool.query(
    "INSERT INTO users(name,password,email,role)VALUES($1,$2,$3,$4) RETURNING id, name, email, role",
    [name,hashedPassword,email,role]

   );
   const token=jwt.sign({
    id:result.rows[0].id,
    role:result.rows[0].role
  },process.env.JWT_SECRET,{expiresIn:'6h'})
   res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 6 * 60 * 60 * 1000, });
   
   
   return res.status(201).json({ message: 'User created successfully' });
   


}
export const loginUser=async(req,res)=>{
  const {identifier,password}=req.body;
  if(!identifier || !password){
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  if(typeof identifier !== 'string' || typeof password !== 'string'){
    return res.status(400).json({ message: 'Invalid input types' });
  }
  const result=await pool.query(
    "SELECT * FROM users WHERE email=$1 OR name=$1",
    [identifier]
  )
  if(result.rows.length===0){
    return res.status(400).json({ message: 'User not found' });
  }
  const isPasswordValid=await bcrypt.compare(password,result.rows[0].password);
  if(!isPasswordValid){
    return res.status(400).json({ message: 'Invalid password' });
  }
  const token=jwt.sign({
    id:result.rows[0].id,
    role:result.rows[0].role},process.env.JWT_SECRET,{expiresIn:'6h'}
  )
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 6 * 60 * 60 * 1000, });

   return res.status(200).json({ message: 'Login successful' ,token:token});

}
export const logoutUser=async(req,res)=>{
  console.log(req.cookies);
  const token=req.cookies.token;
  if(!token){
    return res.status(400).json({ message: 'you already logged out' });
  }
  
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logout successful' });
}