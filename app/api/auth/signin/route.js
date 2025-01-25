import User from "@/models/User";
import { NextResponse} from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request){
    const {email, password} = await request.json();
    try{
        if( !email || !password || email == '' || password == ''){
            return NextResponse.json({success: false, message: 'Please fill in all fields'}, {status: 400});
        }

        const existingUser = await User.findOne({email});

        if(!existingUser){
            return NextResponse.json({success: false, message: 'User does not exist'}, {status: 400});
        }

        const isPasswordValid = bcrypt.compareSync(password, existingUser.password);

        if(!isPasswordValid){
            return NextResponse.json({success: false, message: 'Invalid password'}, {status: 400});
        }

        return NextResponse.json({success: true, message: 'User logged in successfully', data: existingUser}, {status: 200});
    }
    catch(err){
        return NextResponse.json({error: err.message}, {status: 400});
    }
}