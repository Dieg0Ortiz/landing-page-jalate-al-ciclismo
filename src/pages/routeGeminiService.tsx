// Servicio para integrar Gemini (Google) con generación de rutas (limitado a Tuxtla Gutiérrez)

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteData {
  name: string;
  origin: LatLng;
  destination: LatLng;
  waypoints: LatLng[];
  distance: string;
  elevation: string;
  terrain: string;
  difficulty: string;
  warnings: string[];
}

export interface RouteAIResponse {
  message: string;
  route: RouteData | null;
}

// IMPORTANTE: En producción, usa variables de entorno
//const GEMINI_API_KEY = 'AIzaSyDwneyWSJbD2pe1EulEplU-FGVu-FCtNpQ';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const LIST_MODELS_URL = 'https://generativelanguage.googleapis.com/v1/models';

// Prompt estricto: obliga al modelo a solo devolver JSON válido en el formato pedido.
const SYSTEM_PROMPT = `
Eres un generador de rutas ciclísticas EXCLUSIVAMENTE dentro de Tuxtla Gutiérrez, Chiapas. 

INSTRUCCIONES IMPORTANTES:
- DEBES responder SOLO con JSON válido.
- NO agregues explicaciones, saludos, comentarios NI texto fuera del JSON.
- NO uses comas finales, paréntesis incorrectos, ni dejes llaves sin cerrar.
- Si no puedes generar la ruta, devuelve exactamente:
  {"message": "No se pudo generar ruta en Tuxtla.", "route": null}

FORMATO ESTRICTO DE RESPUESTA:
{
  "message": "Descripción breve de la ruta",
  "route": {
    "name": "Nombre de la ruta",
    "origin": {"lat": 16.75, "lng": -93.12},
    "destination": {"lat": 16.77, "lng": -93.13},
    "waypoints": [
      {"lat": 16.76, "lng": -93.12}
    ],
    "distance": "XX km",
    "elevation": "XX m",
    "terrain": "pavimento|terracería|mixto",
    "difficulty": "fácil|intermedio|difícil",
    "warnings": []
  }
}

TODAS las coordenadas deben ser dentro de Tuxtla Gutiérrez.
`;

// Bounding box aproximada para Tuxtla Gutiérrez (lat, lng)
const MIN_LAT = 16.65;
const MAX_LAT = 16.82;
const MIN_LNG = -93.18;
const MAX_LNG = -93.05;

class RouteGeminiService {
  private async getValidModel(): Promise<string> {
    try {
      const response = await fetch(`${LIST_MODELS_URL}?key=${GEMINI_API_KEY}`);

      if (!response.ok) {
        throw new Error(`Error al obtener modelos: ${response.status}`);
      }

      const data = await response.json();
      const models = data.models || [];

      // Preferir modelos gemini; fallback al primero que soporte generateContent
      const geminiModel = models.find(
        (m: any) =>
          m.name?.toLowerCase().includes('gemini') &&
          m.supportedGenerationMethods?.includes('generateContent')
      );

      const validModel =
        geminiModel ||
        models.find((m: any) =>
          m.supportedGenerationMethods?.includes('generateContent')
        );

      if (validModel) {
        const name = validModel.name;
        console.log('Modelo válido encontrado:', name);
        return name;
      } else {
        throw new Error(
          'No hay modelos válidos disponibles para esta API key.'
        );
      }
    } catch (error) {
      console.error('Excepción al obtener modelos:', error);
      throw error;
    }
  }

  async generateRoute(userMessage: string): Promise<RouteAIResponse> {
    try {
      // Validar que hay API key (comentado porque ya tenemos una hardcodeada como fallback)
      // if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      //   throw new Error('API key no configurada. Define VITE_GEMINI_API_KEY en variables de entorno.');
      // }

      const modelName = await this.getValidModel();
      const fullPrompt = `${SYSTEM_PROMPT}\n\nSolicitud del usuario: ${userMessage}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: fullPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = `Error en Gemini API (${response.status})`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.error?.message || response.statusText;
        } catch {
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const content = this.extractTextFromResponse(data);

      // Logs útiles para debug
      console.log('=== RESPUESTA CRUDA DE GEMINI ===');
      console.log(content);
      console.log('=== FIN RESPUESTA ===');

      // Extraer JSON dentro del contenido
      const jsonText = this.extractJson(content);
      const decoded = JSON.parse(jsonText) as any;

      // Si viene error desde el modelo
      if (decoded.error) {
        return {
          message: decoded.error.toString(),
          route: null,
        };
      }

      // Validar coordenadas dentro de Tuxtla
      const routeMap = decoded.route;
      if (!routeMap) {
        return {
          message: decoded.message || 'Sin ruta',
          route: null,
        };
      }

      // Validate origin & destination coordinates
      const origin = routeMap.origin;
      const destination = routeMap.destination;

      if (!this.isWithinTuxtla(origin) || !this.isWithinTuxtla(destination)) {
        return {
          message: 'La ruta generada está fuera de Tuxtla Gutiérrez.',
          route: null,
        };
      }

      const routeData = this.parseRouteData(routeMap);
      return {
        message: decoded.message || 'Ruta generada',
        route: routeData,
      };
    } catch (error) {
      console.error('Error general al generar ruta:', error);
      throw error;
    }
  }

  private extractTextFromResponse(data: any): string {
    try {
      const candidates = data.candidates;
      if (candidates && candidates.length > 0) {
        const first = candidates[0];
        const content = first.content;
        const parts = content?.parts;
        if (parts && parts.length > 0) {
          const text = parts[0].text;
          if (text) return text;
        }
      }

      // Fallback
      if (data.output) {
        return data.output.toString();
      }

      return JSON.stringify(data);
    } catch (error) {
      console.error('No pude extraer texto de la respuesta:', error);
      return JSON.stringify(data);
    }
  }

  private extractJson(text: string): string {
    // remover bloques de código y triple backticks
    let t = text.replace(/```json/g, '').replace(/```/g, '');

    // buscar primer { y último }
    const start = t.indexOf('{');
    const end = t.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
      throw new Error('No se encontró JSON válido en la respuesta.');
    }

    const jsonText = t.substring(start, end + 1).trim();
    return jsonText;
  }

  private isWithinTuxtla(coord: any): boolean {
    if (!coord) return false;
    try {
      const lat = Number(coord.lat || 0);
      const lng = Number(coord.lng || 0);
      return (
        lat >= MIN_LAT && lat <= MAX_LAT && lng >= MIN_LNG && lng <= MAX_LNG
      );
    } catch {
      return false;
    }
  }

  private parseRouteData(json: any): RouteData {
    const parseWaypoints = (maybeList: any): LatLng[] => {
      if (Array.isArray(maybeList)) {
        return maybeList.map((w) => ({
          lat: Number(w.lat || 0),
          lng: Number(w.lng || 0),
        }));
      }
      return [];
    };

    const originMap = json.origin || {};
    const destMap = json.destination || {};

    return {
      name: json.name || 'Ruta sin nombre',
      origin: {
        lat: Number(originMap.lat || 0),
        lng: Number(originMap.lng || 0),
      },
      destination: {
        lat: Number(destMap.lat || 0),
        lng: Number(destMap.lng || 0),
      },
      waypoints: parseWaypoints(json.waypoints),
      distance: json.distance || 'Distancia no especificada',
      elevation: json.elevation || 'Elevación no especificada',
      terrain: json.terrain || 'Terreno no especificado',
      difficulty: json.difficulty || 'Dificultad no especificada',
      warnings: (json.warnings as string[]) || [],
    };
  }
}

export default RouteGeminiService;