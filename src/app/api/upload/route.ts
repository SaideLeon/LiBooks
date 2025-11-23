
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Use a public directory to store uploads
  const relativeUploadDir = 'uploads';
  const uploadDir = join(process.cwd(), 'public', relativeUploadDir);
  
  // Ensure the upload directory exists - In a real app, you might do this on startup
  // For this environment, we assume the directory can be written to.
  // We'll use a simple timestamp and filename to avoid collisions.
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const path = join(uploadDir, filename);

  try {
    // This is where the file is actually written to the filesystem
    // Note: In a serverless environment like Vercel, this filesystem is temporary.
    // For persistent storage, you'd use a service like S3, Cloudinary, or Firebase Storage.
    await writeFile(path, buffer);
    
    // Return the public URL to the file
    const url = `/${relativeUploadDir}/${filename}`;
    return NextResponse.json({ success: true, url: url });

  } catch (error) {
    console.error('Error writing file to disk:', error);
    return NextResponse.json({ success: false, error: 'Failed to save file' }, { status: 500 });
  }
}

    