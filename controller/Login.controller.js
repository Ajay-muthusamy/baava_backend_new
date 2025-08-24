import Login from "../Model/LoginModel.js";

export const savePhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone Number is required." });
    }

    const newLogin = new Login({ phone });
    await newLogin.save();
    console.log(phone)
    res.status(201).json({ message: "Login phone saved successfully." });
  } catch (error) {
    console.error("Error saving login phone:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
