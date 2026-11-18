import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "First name, last name, email, and phone number are required." },
        { status: 400 }
      );
    }

    // Server-side logging / record
    console.log("[SPIKE WAITLIST SIGNUP]", {
      firstName,
      lastName,
      email,
      phone,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "You have been added to the SPIKE VIP early access waitlist!",
        data: {
          firstName,
          lastName,
          email,
          phone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred while joining waitlist." },
      { status: 500 }
    );
  }
}
