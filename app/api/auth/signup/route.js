import User from "@/models/User";
import { NextResponse} from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
    const {username, email, password} = await request.json();
    console.log(username, email, password);
    try{
        if( !username || !email || !password || username == '' || email == '' || password == ''){
            return NextResponse.json({success: false, message: 'Please fill in all fields'}, {status: 400});
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return NextResponse.json({success: false, message: 'User already exists'}, {status: 400});
        }

        const hashedPassword =  bcrypt.hashSync(password, 10);

        const user = new User({
            username, 
            email, 
            password: hashedPassword
        });

        await user.save();

        return NextResponse.json(user);
    }
    catch(err){
        return NextResponse.json({error: err.message}, {status: 400});
    }
}