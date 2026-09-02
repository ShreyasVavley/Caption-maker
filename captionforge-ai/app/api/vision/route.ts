import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  let localFilePath = '';
  let geminiFile: any = null;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueName = `vision-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    localFilePath = join(tmpdir(), uniqueName);
    
    await writeFile(localFilePath, buffer);
    
    geminiFile = await ai.files.upload({
      file: localFilePath,
      config: { mimeType: file.type },
    });

    if (file.type.startsWith('video/')) {
      let currentFile = await ai.files.get({ name: geminiFile.name });
      while (currentFile.state === 'PROCESSING') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        currentFile = await ai.files.get({ name: geminiFile.name });
      }
      if (currentFile.state === 'FAILED') {
        throw new Error('Video processing failed.');
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        geminiFile,
        'Describe this media in one very short, punchy sentence. (e.g. "A sleek laptop on a dark desk with code.") Start immediately.'
      ]
    });

    return NextResponse.json({ description: response.text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (localFilePath) await unlink(localFilePath).catch(() => {});
    if (geminiFile?.name) await ai.files.delete({ name: geminiFile.name }).catch(() => {});
  }
}
