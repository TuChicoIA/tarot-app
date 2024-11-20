import OpenAI from 'openai';

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  console.log('Iniciando solicitud a la API');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('API key no encontrada');
    return res.status(500).json({ error: 'API key de OpenAI no configurada' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { instrucciones } = req.body;
    console.log('Instrucciones recibidas:', instrucciones);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres una experta tarotista. Debes responder en formato JSON válido."
        },
        {
          role: "user",
          content: instrucciones
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const lecturaGenerada = completion.choices[0].message.content;
    console.log('Respuesta de OpenAI:', lecturaGenerada);

    try {
      const lecturaJSON = JSON.parse(lecturaGenerada);
      return res.status(200).json(lecturaJSON);
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError);
      return res.status(200).json({ 
        signo: { nombre: "Error", elemento: "", caracteristica: "" },
        cartaPresente: { nombre: "", posicion: "", significadoPresente: "Error al generar la lectura" },
        cartaFuturo: { nombre: "", posicion: "", significadoFuturo: "" },
        colorInterpretacion: { energia: "", mensaje: "" }
      });
    }

  } catch (error) {
    console.error('Error completo:', error);
    return res.status(500).json({ 
      error: 'Error al generar la lectura',
      details: error.message || 'Error desconocido'
    });
  }
}