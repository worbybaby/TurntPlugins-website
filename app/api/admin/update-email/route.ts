import { NextResponse } from 'next/server';
import { updateOrderEmail } from '../../lib/db';

export async function POST(request: Request) {
  try {
    const { oldEmail, newEmail } = await request.json();

    if (!oldEmail || !oldEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Valid old email address is required' },
        { status: 400 }
      );
    }

    if (!newEmail || !newEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Valid new email address is required' },
        { status: 400 }
      );
    }

    if (oldEmail.toLowerCase() === newEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'New email must be different from old email' },
        { status: 400 }
      );
    }

    const result = await updateOrderEmail(oldEmail.toLowerCase(), newEmail.toLowerCase());

    if (result.updatedCount === 0) {
      return NextResponse.json(
        { error: `No orders found with email: ${oldEmail}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      updatedCount: result.updatedCount
    });
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}
