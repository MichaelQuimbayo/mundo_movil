console.log('Happy developing ✨')

import { VertexAI } from '@google-cloud/vertexai';

// Mantén tu console.log actual aquí arriba para no romper tu flujo
console.log("Servidor de Mundo Móvil inicializado...");

// Next.js lee automáticamente las variables de tu archivo .env.local
const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION || 'global';

// CORRECCIÓN: URLs oficiales y limpias para el endpoint de Google Cloud
const apiEndpoint = location === 'global'
    ? 'aiplatform.googleapis.com'
    : `${location}-aiplatform.googleapis.com`;

// Inicializamos la instancia de Vertex AI y la exportamos
export const vertexAI = new VertexAI({
    project: project,
    location: location,
    apiEndpoint: apiEndpoint
});
