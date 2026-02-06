import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export async function GET(req: Request, context: any) {
    return handler(req, context);
}

export async function POST(req: Request, context: any) {
    try {
        return await handler(req, context);
    } catch (error) {
        console.error("NextAuth POST error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error in Auth" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
