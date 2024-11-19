import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { datos_usuario, instrucciones } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
      temperature: 0.9,
      max_tokens: 2000
    });

    const lecturaGenerada = completion.choices[0].message.content;
    
    try {
      const lecturaJSON = JSON.parse(lecturaGenerada);
      return res.status(200).json(lecturaJSON);
    } catch (parseError) {
      console.error('Error al parsear la respuesta:', parseError);
      return res.status(500).json({ 
        error: 'Error al procesar la lectura',
        details: 'La respuesta no tiene el formato esperado'
      });
    }

  } catch (error) {
    console.error('Error en la generación de la lectura:', error);
    return res.status(500).json({ 
      error: 'Error al generar la lectura',
      details: error.message 
    });
  }
}