import { NextResponse } from "next/server";
import { prisma } from "@spike/database";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone } = body;

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !phone?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "First name, last name, email, and phone number are required.",
        },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanPhone = phone.trim();

    // 1. Check if user already joined waitlist
    const existing = await prisma.waitlist.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: true,
          message:
            "You are already on the Spike VIP waitlist! We'll notify you as soon as early access opens.",
          data: existing,
        },
        { status: 200 },
      );
    }

    // 2. Create new entry in database
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        phone: cleanPhone,
      },
    });

    console.log(`[SPIKE WAITLIST] Registered new user: ${cleanEmail}`);

    // 3. Dispatch confirmation email via Resend
    const resendApiKey =
      process.env.RESEND_API_KEY || "re_2pWiF4e7_7ZUJt3aNiYj3BGjmyaB9d5EH";
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "support@eazicred.com";

    const resend = new Resend(resendApiKey);

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 36px 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #047857; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">SPIKE</h1>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">Smart Wealth & Automated Savings</p>
        </div>

        <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
          <h2 style="color: #065f46; font-size: 20px; margin-top: 0; margin-bottom: 8px;">You're on the VIP List! 🎉</h2>
          <p style="color: #047857; font-size: 15px; margin: 0; line-height: 1.5;">
            Hi <strong>${cleanFirstName}</strong>, welcome to the future of smart savings and effortless investing.
          </p>
        </div>

        <p style="color: #334155; font-size: 15px; line-height: 1.6;">
          Your spot has been reserved for our exclusive early beta launch. As an early pioneer, we have reserved your <strong>₦100 instant bonus</strong> ready to be claimed once we launch.
        </p>

        <div style="margin: 24px 0; padding: 18px; background-color: #f8fafc; border-radius: 10px; border-left: 4px solid #059669;">
          <h3 style="color: #0f172a; font-size: 14px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">What's in store for you:</h3>
          <ul style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 18px;">
            <li><strong>Automated Pockets:</strong> Split and automate your salary seamlessly.</li>
            <li><strong>High-Yield Savings:</strong> Earn up to 20% p.a. on your locked savings.</li>
            <li><strong>Zero-Fee NUBAN:</strong> Instant virtual bank account with Moniepoint.</li>
            <li><strong>Dollar Cards:</strong> Shop globally without decline hassles.</li>
          </ul>
        </div>

        <p style="color: #334155; font-size: 14px; line-height: 1.5;">
          We'll send you an invitation as soon as onboarding opens for your access batch. Stay tuned!
        </p>

        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin-top: 16px; margin-bottom: 0;">
            © ${new Date().getFullYear()} Spike Finance. All rights reserved.<br/>
            If you did not join this waitlist, you can disregard this email.
          </p>
        </div>
      </div>
    `;

    try {
      await resend.emails.send({
        from: fromAddress.includes("<") ? fromAddress : `Spike <${fromAddress}>`,
        to: [cleanEmail],
        subject: `Welcome to the Spike VIP Waitlist, ${cleanFirstName}! 🚀`,
        html: emailHtml,
      });
      console.log(
        `[SPIKE WAITLIST] Confirmation email dispatched to: ${cleanEmail}`,
      );
    } catch (emailErr) {
      console.error("[SPIKE WAITLIST EMAIL ERROR]", emailErr);
      // Non-blocking so the user still gets their confirmation response
    }

    return NextResponse.json(
      {
        success: true,
        message: "You have been added to the SPIKE VIP early access waitlist!",
        data: waitlistEntry,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[WAITLIST API ERROR]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while joining the waitlist." },
      { status: 500 },
    );
  }
}
