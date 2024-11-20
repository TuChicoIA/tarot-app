import OpenAI from 'openai';

export const config = {
  maxDuration: 60, // Aumentar el tiempo máximo a 60 segundos
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000, // timeout de 30 segundos
    });

    const { datos_usuario, instrucciones } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Cambiar a gpt-3.5-turbo para respuesta más rápida
      messages: [
        {
          role: "system",
          content: "Eres una experta tarotista con profundo conocimiento del Tarot de Rider-Waite, astrología y simbolismo del color. Proporcionas lecturas detalladas y personalizadas."
        },
        {
          role: "user",
          content: instrucciones
        }
      ],
      temperature: 0.7,
      max_tokens: 1000 // Reducir tokens para respuesta más rápida
    });

    return res.status(200).json({ 
      lectura: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Error al generar la lectura',
      details: error.message 
    });
  }
}