import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email via Resend
    await resend.emails.send({
      from: 'Turnt Plugins Support <downloads@turntplugins.com>',
      to: 'turntplugins@gmail.com',
      replyTo: email,
      subject: `Support: ${subject}`,
      html: `
        <div style="font-family: monospace; max-width: 600px;">
          <h2 style="border-bottom: 4px solid black; padding-bottom: 10px;">New Support Message</h2>

          <div style="margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>

          <div style="border: 4px solid black; padding: 15px; background: #f5f5f5; margin: 20px 0;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Reply directly to this email to respond to ${name}
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Support message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Support form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
