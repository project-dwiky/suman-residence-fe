import { NextRequest } from "next/server";
import { loginUser } from "@/services/auth.service";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const {email, password} = body;
    try {
        // Create a response object that we'll modify
        const response = NextResponse.json({});
        
        // Login user will set cookies on this response
        const user = await loginUser({email, password}, response);
        
        if(!user) {
            return NextResponse.json({error:'Invalid credentials'}, {status: 401});
        }
        
        // Create a new response with the user data
        const finalResponse = NextResponse.json(
            {data: user, message: 'User logged in successfully'}, 
            {status: 200}
        );
        
        // Copy all cookies from the original response to the final response
        response.headers.getSetCookie().forEach(cookie => {
            finalResponse.headers.append('Set-Cookie', cookie);
        });
        
        return finalResponse;
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}