import mongoose from "mongoose";

export const connectDB = async(uri)=>{
        try{
            await mongoose.connect(uri);
            console.log("DB connected");
        }
        catch(error){
            console.log("Error Connecting to the DB",error);
        }
}