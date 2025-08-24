import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  email: {
    type: String,

  }
});

const Login = mongoose.model("Login", loginSchema);
export default Login;
