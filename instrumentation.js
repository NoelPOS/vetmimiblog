import { dbConnect } from "./db/db";    


export async function register(){
    // await dbConnect();
    console.log('Connected to MongoDB');
    console.log(process.env.MONGO_URL);
}