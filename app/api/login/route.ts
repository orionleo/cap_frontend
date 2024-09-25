/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const res = await axios.post("http://localhost:8080/api/auth/login", { email, password });

        console.log("RES DATA", res.data);

        return NextResponse.json(res.data);
    } catch (error) {
        const e = error as unknown as any;
        console.log("ERROR", e.message)
        return new NextResponse(e.message, { status: e.status });
    }
}