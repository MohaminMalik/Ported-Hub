import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get('id') || '0');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // Find the product first to get its images
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Try to delete images from GitHub if token exists
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (GITHUB_TOKEN && product.images && product.images.length > 0) {
      const REPO = 'MohaminMalik/Ported-Hub';
      
      for (const imgString of product.images) {
        // Parse "url('/images/filename.jpg') center/cover" -> "/images/filename.jpg"
        const cleanPath = imgString.replace("url('", "").replace("') center/cover", "");
        
        // Only attempt to delete if it's an uploaded image in the /images folder
        if (cleanPath.startsWith('/images/')) {
          const filePath = `public${cleanPath}`; // e.g. "public/images/12345.jpg"
          
          try {
            // 1. Get file SHA (required for GitHub deletion)
            const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
              headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
            });
            
            if (getRes.ok) {
              const fileData = await getRes.json();
              
              // 2. Send DELETE request
              await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
                method: 'DELETE',
                headers: { 
                  'Authorization': `Bearer ${GITHUB_TOKEN}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  message: `Delete product image: ${filePath}`,
                  sha: fileData.sha
                })
              });
            }
          } catch (e) {
            console.error(`Failed to delete image from github: ${filePath}`, e);
            // Continue deleting the product even if image deletion fails
          }
        }
      }
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const product = await prisma.product.update({
      where: { id },
      data
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        size: body.size,
        condition: body.condition,
        material: body.material,
        era: body.era,
        color: body.color,
        brand: body.brand,
        thriftStory: body.thriftStory,
        isFreshDrop: body.isFreshDrop || false,
        images: body.images
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Add product error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
