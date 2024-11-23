import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

const TarotApp = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    fechaNacimiento: '',
    colorFavorito: ''
  });
  const [isShuffling, setIsShuffling] = useState(false);
  const [lectura, setLectura] = useState(null);
  const [error, setError] = useState(null);

  const pasos = [
    {
      mensaje: "¡Hola! Bienvenido/a a tu consulta de tarot virtual. ¿Cómo te llamas?",
      campo: "nombre",
      tipo: "text",
      placeholder: "Tu nombre"
    },
    {
      mensaje: "Encantado/a de conocerte. Para continuar, necesito saber tu fecha de nacimiento.",
      campo: "fechaNacimiento",
      tipo: "date",
      placeholder: ""
    },
    {
      mensaje: "Perfecto. Ahora, ¿cuál es tu color favorito?",
      campo: "colorFavorito",
      tipo: "text",
      placeholder: "Escribe cualquier color que sientas"
    },
    {
      mensaje: "Muy bien. Ahora voy a barajar las cartas para ti. Dame unos momentos mientras me concentro en tu energía...",
      campo: null,
      tipo: null,
      placeholder: null
    }
  ];

  const prompt = {
  tipo_consulta: "lectura_tarot_completa",
  datos_usuario: {
    nombre: formData.nombre,
    fecha_nacimiento: formData.fechaNacimiento,
    color_favorito: formData.colorFavorito.toLowerCase() // Aquí convertimos a minúsculas
  },
  instrucciones: `
          Eres una experta tarotista. Genera una lectura completamente personalizada.

          REQUERIMIENTOS:

          1. ANÁLISIS ASTROLÓGICO:
          - Determina e interpreta el signo zodiacal basado en la fecha ${formData.fechaNacimiento}
          - Identifica y explica su elemento (Fuego, Tierra, Aire, Agua)
          - Describe características y energías dominantes
          - Conexión con el momento actual

          2. SELECCIÓN DE CARTAS:
          - Elige dos cartas del mazo completo de 78 cartas del Tarot Rider-Waite
          - Una carta para el presente
          - Una carta para el futuro
          - Especifica si cada carta está en posición normal o invertida
          - Interpretación profunda y detallada de cada carta
          - Símbolos relevantes y su significado
          - Conexión con el consultante

          3. ANÁLISIS DEL COLOR:
          - Interpretación profunda del color ${formData.colorFavorito.toLowerCase()}
          - Significado espiritual y energético
          - Conexión con las cartas seleccionadas
          - Influencia en el camino del consultante

          4. SÍNTESIS E INTEGRACIÓN:
          - Conecta todos los elementos entre sí
          - Relaciona las cartas con el signo zodiacal
          - Vincula el color con la interpretación general
          - Ofrece una visión holística de la lectura

          FORMAT0 DE RESPUESTA REQUERIDO:
          {
            "signo": {
              "nombre": "nombre del signo",
              "elemento": "elemento del signo",
              "caracteristica": "características principales"
            },
            "cartaPresente": {
              "nombre": "nombre de la carta",
              "posicion": "normal o invertida",
              "significadoPresente": "interpretación detallada"
            },
            "cartaFuturo": {
              "nombre": "nombre de la carta",
              "posicion": "normal o invertida",
              "significadoFuturo": "interpretación detallada"
            },
            "colorInterpretacion": {
  "energia": "Tu color favorito, [color], simboliza...",
  "mensaje": "mensaje completo que puede incluir referencias al color"
}
          }

          CONSIDERACIONES:
          - Cada interpretación debe ser única y específica
          - Evita generalidades y frases hechas
          - Usa lenguaje claro pero místico
          - Mantén un tono empático y personal
          - Proporciona detalles específicos y relevantes
        `
      };

      const respuesta = await fetch('/api/lectura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      });

      if (!respuesta.ok) {
        throw new Error('Error en la conexión con el tarot virtual');
      }

      const lectura = await respuesta.json();
      
      if (!lectura || !lectura.cartaPresente || !lectura.cartaFuturo || !lectura.signo || !lectura.colorInterpretacion) {
        throw new Error('La lectura está incompleta');
      }

      return lectura;
    } catch (error) {
      throw new Error('No se pudo realizar la lectura. Por favor, intenta nuevamente.');
    }
  };

  const handleNext = () => {
    if (step < pasos.length - 1) {
      setStep(step + 1);
      if (step === pasos.length - 2) {
        setIsShuffling(true);
        setError(null);
        setTimeout(async () => {
          try {
            const lecturaCompleta = await generarLecturaCompleta();
            setLectura(lecturaCompleta);
          } catch (error) {
            setError(error.message);
            setLectura(null);
          } finally {
            setIsShuffling(false);
          }
        }, 3000);
      }
    }
  };

  const reiniciarConsulta = () => {
    setStep(0);
    setLectura(null);
    setIsShuffling(false);
    setError(null);
    setFormData({
      nombre: '',
      fechaNacimiento: '',
      colorFavorito: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>🔮 Tarot Virtual</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center space-y-4">
              <p className="text-red-500">{error}</p>
              <Button onClick={reiniciarConsulta}>Intentar Nuevamente</Button>
            </div>
          ) : !lectura ? (
            <div className="space-y-4">
              <p className="text-lg">{pasos[step].mensaje}</p>
              
              {isShuffling ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-xl">🔮 Barajando las cartas...</p>
                  <p className="italic">Conectando con las energías del universo</p>
                </div>
              ) : pasos[step].campo && (
                <>
                  <Input
                    type={pasos[step].tipo}
                    value={formData[pasos[step].campo]}
                    onChange={(e) => setFormData({...formData, [pasos[step].campo]: e.target.value})}
                    placeholder={pasos[step].placeholder}
                    className="w-full"
                  />
                  <Button 
                    onClick={handleNext}
                    className="w-full"
                    disabled={!formData[pasos[step].campo]}
                  >
                    Continuar
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-lg">
                Querido/a {formData.nombre}, aquí está tu lectura basada en la energía de las cartas:
              </p>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gradient-to-r from-slate-50 to-slate-100">
                  <h3 className="text-xl font-bold mb-2">
                    Tu Presente
                  </h3>
                  <p className="mb-3 leading-relaxed">
                    {lectura.cartaPresente.significadoPresente}
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-gradient-to-r from-slate-50 to-slate-100">
                  <h3 className="text-xl font-bold mb-2">
                    Tu Futuro Inmediato
                  </h3>
                  <p className="mb-3 leading-relaxed">
                    {lectura.cartaFuturo.significadoFuturo}
                  </p>
               <p className="text-sm italic">
  {lectura.colorInterpretacion.energia} {lectura.colorInterpretacion.mensaje}
</p>
                </div>

                <p className="italic text-center font-medium">
                  Recuerda que las cartas son una guía, y el verdadero poder para moldear tu destino 
                  reside en tus decisiones y acciones.
                </p>

                <Button 
                  onClick={reiniciarConsulta}
                  className="w-full"
                >
                  Realizar Nueva Consulta
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TarotApp;