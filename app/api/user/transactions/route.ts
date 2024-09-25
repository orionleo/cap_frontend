import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const headers = request.headers;
    const authorization = headers.get("authorization");
    const res = await axios.get("http://localhost:8080/api/user/transactions", {
        headers: {
            Authorization: authorization
        }
    });

    return new NextResponse(JSON.stringify(res.data.data));
}