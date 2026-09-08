import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sizes = url.searchParams.getAll('size');

    let where: any = {};
    if (sizes && sizes.length > 0) {
      where = {
        OR: sizes.map(s => ({
          size: {
            contains: s,
            mode: 'insensitive'
          }
        }))
      };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
