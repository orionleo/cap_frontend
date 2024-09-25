import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const headers = request.headers;
        const authorization = headers.get("authorization");
        const res = await axios.get("http://localhost:8080/api/user/accounts", {
            headers: {
                Authorization: authorization
            }
        });

        return new NextResponse(JSON.stringify(res.data.data));
    } catch (error) {
        const e = error as unknown as any;
        console.log("ERROR DATA", e.response.data);

        return new NextResponse(JSON.stringify(e.response.data), { status: e.status });
    }
}

export async function POST(request: Request) {
    try {
        const headers = request.headers;
        const authorization = headers.get("authorization");
        const { accountType, balance } = await request.json();
        const res = await axios.post("http://localhost:8080/api/account/new", { accountType, balance }, {
            headers: { Authorization: authorization }
        });

        return new NextResponse(JSON.stringify(res.data.data));
    } catch (error) {
        const e = error as unknown as any;
        console.log("ERROR DATA", e.response.data);

        return new NextResponse(JSON.stringify(e.response.data), { status: e.status });
    }
}