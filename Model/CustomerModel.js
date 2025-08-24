import mongoose from "mongoose";

const generateOrderId = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  image: { type: String }, // optional
});

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    country: { type: String },
    address: { type: String },
    products: [productSchema],
    totalAmount: { type: Number, required: true },
    orderId: {
      type: Number,
      default: generateOrderId,
      unique: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("customer_details", customerSchema);

export default Customer;
