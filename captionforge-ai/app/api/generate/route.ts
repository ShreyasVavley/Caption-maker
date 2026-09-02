import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const captionSchema = {
  type: Type.OBJECT,
  properties: {
    variations: {
      type: Type.OBJECT,
      properties: {
        hookShort: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING, description: "Punchy hook under 15 words" },
            story: { type: Type.STRING, description: "Short story or context" },
            engagement: { type: Type.STRING, description: "Question to drive debate" },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            callToAction: { type: Type.STRING }
          },
          required: ["hook", "story", "engagement", "hashtags", "callToAction"]
        },
        storyContext: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            story: { type: Type.STRING, description: "High narrative engagement story" },
            engagement: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            callToAction: { type: Type.STRING }
          },
          required: ["hook", "story", "engagement", "hashtags", "callToAction"]
        },
        engagementQuestion: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            story: { type: Type.STRING },
            engagement: { type: Type.STRING, description: "Highly engaging question or debate starter" },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            callToAction: { type: Type.STRING }
          },
          required: ["hook", "story", "engagement", "hashtags", "callToAction"]
        }
      },
      required: ["hookShort", "storyContext", "engagementQuestion"]
    }
  },
  required: ["variations"]
};

export async function POST(req: NextRequest) {
  let localFilePath = '';
  let geminiFile: any = null;

  try {
    const formData = await req.formData();
    const platform = formData.get('platform') as string;
    const tone = formData.get('tone') as string;
    const file = formData.get('file') as File | null;
    const promptContext = formData.get('prompt') as string;

    if (!platform || !tone) {
      return NextResponse.json({ error: 'Platform and tone are required' }, { status: 400 });
    }

    const contents: any[] = [];
    const promptStr = `Generate social media captions for ${platform} with a "${tone}" tone.
    Context: ${promptContext || 'None'}
    
    Output exactly 3 unique caption variations according to the JSON schema.`;
    
    contents.push(promptStr);

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      localFilePath = join(tmpdir(), uniqueName);
      
      await writeFile(localFilePath, buffer);
      
      console.log(`Uploading ${file.name} to Gemini...`);
      geminiFile = await ai.files.upload({
        file: localFilePath,
        config: { mimeType: file.type },
      });

      // Poll until active if it's a video
      if (file.type.startsWith('video/')) {
        console.log(`Polling status for video file...`);
        let currentFile = await ai.files.get({ name: geminiFile.name });
        while (currentFile.state === 'PROCESSING') {
          await new Promise(resolve => setTimeout(resolve, 2000));
          currentFile = await ai.files.get({ name: geminiFile.name });
        }
        if (currentFile.state === 'FAILED') {
          throw new Error('Video processing failed on Gemini servers.');
        }
      }
      
      contents.push(geminiFile);
    }

    console.log('Generating content with Gemini...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: captionSchema as any,
        temperature: 0.7,
      }
    });

    const data = JSON.parse(response.text || '{}');
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error generating caption:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate captions' }, { status: 500 });
  } finally {
    if (localFilePath) {
      try {
        await unlink(localFilePath);
      } catch (e) {
        console.error('Failed to cleanup local temp file:', e);
      }
    }
    if (geminiFile?.name) {
      try {
        await ai.files.delete({ name: geminiFile.name });
      } catch (e) {
        console.error('Failed to cleanup Gemini file:', e);
      }
    }
  }
}
