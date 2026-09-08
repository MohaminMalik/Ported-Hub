import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { getSession } from '@/utils/session';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { phone, house, street, landmark, city, zip, shirtSize, waistSize, shoeSize } = body;

    const dataToUpdate: any = {};
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (house !== undefined) dataToUpdate.house = house;
    if (street !== undefined) dataToUpdate.street = street;
    if (landmark !== undefined) dataToUpdate.landmark = landmark;
    if (city !== undefined) dataToUpdate.city = city;
    if (zip !== undefined) dataToUpdate.zip = zip;
    if (shirtSize !== undefined) dataToUpdate.shirtSize = shirtSize;
    if (waistSize !== undefined) dataToUpdate.waistSize = waistSize;
    if (shoeSize !== undefined) dataToUpdate.shoeSize = shoeSize;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: dataToUpdate
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
