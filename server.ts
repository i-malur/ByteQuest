import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API endpoint for music generation using Lyria models
app.post('/api/generate-music', async (req, res) => {
  try {
    const { prompt, model = 'lyria-3-clip-preview' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório para gerar música.' });
    }

    const validModels = ['lyria-3-clip-preview', 'lyria-3-pro-preview'];
    const selectedModel = validModels.includes(model) ? model : 'lyria-3-clip-preview';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Chave GEMINI_API_KEY não configurada no ambiente.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const responseStream = await ai.models.generateContentStream({
      model: selectedModel,
      contents: prompt,
      config: {
        responseModalities: [Modality.AUDIO],
      }
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      return res.status(500).json({ error: 'Nenhum áudio gerado pelo modelo.' });
    }

    res.json({
      audioBase64,
      mimeType,
      lyrics,
      model: selectedModel,
      prompt
    });
  } catch (error: any) {
    console.error('Erro ao gerar música com Lyria:', error);
    res.status(500).json({
      error: error.message || 'Falha ao gerar música via Lyria API'
    });
  }
});

// Vite middleware for frontend development
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(port, '0.0.0.0', () => {
    console.log(`ByteQuest 3D server running on http://0.0.0.0:${port}`);
  });
}

startServer();
