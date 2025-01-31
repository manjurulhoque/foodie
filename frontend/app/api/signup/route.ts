import { NextResponse } from "next/server";
import httpStatus from "@/lib/http-status";

type ResponseData = {
    message: string;
};

interface RequestBody {
    name: string;
    phone: string;
    email: string;
    password1: string;
    password2: string;
}

export async function POST(req: Request) {
    const { name, phone, email, password1, password2 }: RequestBody = await req.json();

    const response = await fetch(
        `${process.env.BACKEND_BASE_URL}/api/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password1, password2, phone }),
        }
    );

    if (response.ok) {
        return NextResponse.json(
            { message: "User created successfully" },
            { status: httpStatus.CREATED }
        );
    }

    console.log(await response.json());

    // Handle errors
    const errorData: ResponseData = await response.json();
    const errorMessage = errorData.message || "Something went wrong";
    return NextResponse.json(
        { message: errorMessage },
        { status: response.status }
    );
}
