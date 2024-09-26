import mongoose from "mongoose";

const generateOrderId = () => {
   return Math.floor(100000 + Math.random() * 900000);
 };
 
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});
const customer = new mongoose.Schema({
  name: String,
  phone: Number,
  whatsapp: Number,
  country: String,
  address: String,
  products:[productSchema],
  totalAmount:String,
  createdAt: {
   type: Date,
   default: Date.now, 
 },
 orderId: {
   type: Number,
   default: generateOrderId, 
   unique: true, 
 },
});

const customerSchema = mongoose.model("customer_details", customer);
export default customerSchema


