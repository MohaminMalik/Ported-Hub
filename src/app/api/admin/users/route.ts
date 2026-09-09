import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({ 
      select: { id: true, firstName: true, lastName: true, email: true, role: true, shirtSize: true, waistSize: true, shoeSize: true, createdAt: true },
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, role, firstName, lastName, email } = await req.json();
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const data: any = {};
    if (role) data.role = role;
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;
    if (email) data.email = email;

    await prisma.user.update({
      where: { id },
      data
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get('id') || '0');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
