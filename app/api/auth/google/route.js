import User from "@/models/User";
import { NextResponse} from "next/server";  
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request){
    const {email, name, googlePhotoUrl} = request.json()

    try{
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

            const {password, ...userData} = user._doc;

            // set cookie
            const response = NextResponse.next()

            response.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600,   
        });
        return response.json({success: true, message: 'User logged in successfully', data: userData}, {status: 200});
    }
    else{
        const generatedPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
        const newUser = new User({
            username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
            email, 
            password: hashedPassword,
            googlePhotoUrl
        });

        await newUser.save();

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        const {password, ...userData} = newUser._doc;

        // set cookie
        const response = NextResponse.next()

        response.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600,   
        });

        return response.json({success: true, message: 'User logged in successfully', data: userData}, {status: 200});
    }
}
    catch(err){
        return NextResponse.json({error: err.message}, {status: 400});
    }
        
}