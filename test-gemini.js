// Cargamos las variables de entorno locales
import 'dotenv/config';
import { vertexAI } from './index.js';

async function probarAgrupacionMundoMovil() {
    console.log("🚀 Iniciando prueba de conexión con Gemini Vertex AI...");

    try {
        // 1. Llamamos al modelo estable gemini-2.5-flash usando nuestra instancia blindada
        const model = vertexAI.preview.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // 2. Simulamos una muestra de datos planos idéntica a la que devuelve tu API de materiales
        const productosEjemplo = [
            { id: "1", name: "iPhone 15 Pro Max Natural Titanium 128GB", grupo_producto: "iphone-15-pro-max", color: "Titanio Natural", almacenamiento: "128GB" },
            { id: "2", name: "iPhone 15 Pro Max Blue Titanium 256GB", grupo_producto: "iphone-15-pro-max", color: "Titanio Azul", almacenamiento: "256GB" },
            { id: "3", name: "Samsung Galaxy S24 Ultra Black 256GB", grupo_producto: "galaxy-s24-ultra", color: "Negro", almacenamiento: "256GB" }
        ];

        const prompt = `Actúa como el backend de Mundo Móvil. Analiza este listado de productos en JSON y agrúpalos por el campo 'grupo_producto' para mostrar una sola tarjeta por modelo en la Home. Devuelve solo el JSON agrupado final:\n${JSON.stringify(productosEjemplo, null, 2)}`;

        // 3. Enviamos la petición a Google Cloud
        const response = await model.generateContent(prompt);

        console.log("\n✅ ¡Conexión exitosa con la API de Google Cloud!");
        console.log("\n🤖 Respuesta de Gemini (Agrupación de la Home):");
        console.log(response.response.text());

    } catch (error) {
        console.error("\n❌ Error en la prueba. Revisa la configuración:", error.message);
    }
}

probarAgrupacionMundoMovil();
