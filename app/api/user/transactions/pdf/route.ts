import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const headers = request.headers;
    const authorization = headers.get("authorization");

    try {
        // Fetch the PDF from the external API
        const res = await axios.get("http://localhost:8080/api/user/transactions/pdf", {
            headers: {
                Authorization: authorization
            },
            responseType: "arraybuffer",  // Use arraybuffer to handle binary data (PDF)
        });

        // Create a new NextResponse and return the PDF as a binary response
        return new NextResponse(res.data, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="transactions.pdf"',  // Set the filename for download
            },
            status: 200
        });

    } catch (error) {
        console.error("Error fetching the PDF", error);
        return NextResponse.json({ error: "Failed to fetch the PDF" }, { status: 500 });
    } 

}