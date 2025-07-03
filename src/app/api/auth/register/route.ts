import { registerUser } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { RegisterData } from "@/types/user";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const payload: RegisterData = body;
    const result = await registerUser(payload);
    if(result.status === 'error') {
        return NextResponse.json(result, {status: 401});
    }
    return NextResponse.json(result, { status: 200 });
}