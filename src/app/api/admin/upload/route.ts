import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const urls = [];
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is not configured');
    }

    const REPO = 'MohaminMalik/Ported-Hub';

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Content = buffer.toString('base64');
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      const path = `public/images/${filename}`;

      // GitHub API PUT request to create file
      const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload product image: ${filename}`,
          content: base64Content,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(`GitHub API Error: ${err.message}`);
      }

      urls.push(`/images/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
