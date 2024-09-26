import mongoose, { model } from "mongoose";

const update = new mongoose.Schema({
    OfferContent:{
        type:String
    }
})

const updateContent = mongoose.model('Page-Updates',update);
export default updateContent;