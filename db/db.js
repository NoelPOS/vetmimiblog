import mongoose from "mongoose";

export const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    }
    catch(err){
        console.log(err);
    }
}

