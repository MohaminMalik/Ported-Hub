import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = await prisma.category.create({
      data: {
        id: body.slug,
        slug: body.slug,
        name: body.name,
        imageUrl: body.imageUrl,
      }
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Add category error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const category = await prisma.category.update({
      where: { id },
      data
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (GITHUB_TOKEN && category.imageUrl) {
      const REPO = 'MohaminMalik/Ported-Hub';
      const cleanPath = category.imageUrl.replace("url('", "").replace("') center/cover", "");
      if (cleanPath.startsWith('/images/')) {
        const filePath = `public${cleanPath}`;
        try {
          const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
            headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
          });
          
          if (getRes.ok) {
            const fileData = await getRes.json();
            await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
              method: 'DELETE',
              headers: { 
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: `Delete category image: ${filePath}`,
                sha: fileData.sha
              })
            });
          }
        } catch (e) {
          console.error(`Failed to delete category image from github: ${filePath}`, e);
        }
      }
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
