import customerSchema from "../Model/CustomerModel.js";
import updateContent from "../Model/updateModel.js";

export const customerdetails = async (req, res) => {
    const customerData = req.body;
  
    try {
      const user = new customerSchema({
        ...customerData.formData,
        products: customerData.cartData,
        totalAmount: customerData.finalAmount,
      });
  
      await user.save();
  
      res.status(200).json({ message: "Data inserted successfully" });
      console.log("Data inserted successfully");
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ message: "Data not inserted successfully", error: error.message });
    }
  };

export const adminfetch = async(req,res)=>{
    try {
        const response = await customerSchema.find();
        res.json(response);
    } catch (error) {
        res.status(501).json({message:'Error fetched from db'});
    }
} 


export const updateText = async(req,res)=>{
    const text = '50% Offer of the Crackers'
    try {
        const textdata =  updateContent({
            OfferContent:text
        })
        await textdata.save();
        res.status(200).json({message:"Update the Data SuccessFully"});
    } catch (error) {
        res.status(200).json({message:"Error Update the Data "});
    }
} 

export const FetchUpdataData = async (req, res) => {
    const { id } = req.params; 
    const updatedData = req.body; 
  
    try {
 
      const updatedOffer = await updateContent.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedOffer) {
        return res.status(404).json({ message: "Offer not found" });
      }

      res.status(200).json(updatedOffer);
    } catch (error) {
      console.error('Error updating the data:', error);
      res.status(500).json({ message: "Error updating the data" });
    }
  };
  

  export const FetchData = async(req,res) =>{
    try {
        const response = await updateContent.find();
        res.send(response);
    } catch (error) {
        res.status(500).json({message:"Not data is Fetch from the db"});
    }
  }