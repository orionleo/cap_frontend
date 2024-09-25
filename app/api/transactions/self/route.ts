/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const headers = request.headers;
    const authorization = headers.get("authorization");
    const { fromAccountId, toAccountId, amount } = await request.json();

    try {

        const res = await axios.post("http://localhost:8080/api/transfer/self", { fromAccountId, toAccountId, amount }, {
            headers: {
                Authorization: authorization
            }
        });

        return NextResponse.json(res.data);
    } catch (error) {
        const e = error as unknown as any;
        console.log("ERROR DATA", e.response.data);

        return new NextResponse(JSON.stringify(e.response.data), { status: e.status });
    }


}