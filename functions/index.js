const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const ASSISTANT_ID = "asst_eFSYuFil7JgFcgMGPpEwlu27";
const apiKey = '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'; // Reemplaza con tu clave de API de OpenAI
const db = admin.firestore();

// Función para crear un nuevo hilo
async function createThread() {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/threads',
            {
                messages: [
                    {
                        role: "user",
                        content: "Hola, me gustaría empezar una conversación."
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v2'
                }
            }
        );
        return response.data.id;
    } catch (error) {
        console.error('Error al crear el hilo:', error.response ? error.response.data : error.message);
        throw new Error('Error al crear el hilo.');
    }
}

// Función para enviar un mensaje al thread
async function sendMessage(threadId, content) {
    try {
        const response = await axios.post(
            `https://api.openai.com/v1/threads/${threadId}/messages`,
            {
                role: "user",
                content: content
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v2'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al enviar el mensaje:', error.response ? error.response.data : error.message);
        throw new Error('Error al enviar el mensaje al thread.');
    }
}

// Función para iniciar un run en el thread sin instrucciones adicionales
async function startRun(threadId) {
    try {
        const response = await axios.post(
            `https://api.openai.com/v1/threads/${threadId}/runs`,
            {
                assistant_id: ASSISTANT_ID,
                model: "gpt-4o-mini",
                tools: [{ "type": "file_search" }],
                truncation_strategy: {
                    type: "last_messages",
                    last_messages: 5
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v2'
                }
            }
        );
        return response.data.id;
    } catch (error) {
        console.error('Error al iniciar el run:', error.response ? error.response.data : error.message);
        throw new Error('Error al iniciar el run.');
    }
}

// Función para esperar a que el run se complete
async function waitForRunCompletion(threadId, runId) {
    const MAX_POLLING_ATTEMPTS = 30; // Número máximo de intentos
    const POLLING_INTERVAL_MS = 2000; // Intervalo entre intentos en milisegundos (2 segundos)

    for (let attempt = 0; attempt < MAX_POLLING_ATTEMPTS; attempt++) {
        try {
            const response = await axios.get(
                `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'OpenAI-Beta': 'assistants=v2'
                    }
                }
            );

            const status = response.data.status;
            console.log(`Estado del run (${runId}): ${status}`);

            if (status === 'completed') {
                return; // El run se ha completado
            } else if (status === 'failed') {
                throw new Error('El run ha fallado.');
            } else {
                // El run está en estado 'pending' o 'running'
                await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
            }
        } catch (error) {
            console.error('Error al comprobar el estado del run:', error.response ? error.response.data : error.message);
            throw new Error('Error al comprobar el estado del run.');
        }
    }

    throw new Error('El run no se completó en el tiempo esperado.');
}

// Función para recuperar el último mensaje generado por el asistente
async function getLastAssistantMessage(threadId, runId) {
    try {
        const response = await axios.get(
            `https://api.openai.com/v1/threads/${threadId}/messages`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v2'
                }
            }
        );

        console.log('Respuesta completa de mensajes:', JSON.stringify(response.data, null, 2));

        // Filtrar los mensajes del asistente
        const messages = response.data.data;
        const assistantMessages = messages.filter(msg => msg.role === 'assistant' && msg.run_id === runId);

        if (assistantMessages.length > 0) {
            const lastMessage = assistantMessages[assistantMessages.length - 1];
            const textContent = lastMessage.content.find(c => c.type === 'text');
            
            if (textContent) {
                return textContent.text.value;
            } else {
                throw new Error('El mensaje del asistente no tiene contenido de texto.');
            }
        } else {
            throw new Error('No se encontraron mensajes del asistente en la respuesta para el run especificado.');
        }
    } catch (error) {
        console.error('Error al obtener los mensajes:', error.response ? error.response.data : error.message);
        throw new Error('Error al obtener los mensajes del thread.');
    }
}



// Función principal handleUserQuery con middleware CORS aplicado correctamente
exports.handleUserQuery = onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method === 'OPTIONS') {
            res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.set('Access-Control-Allow-Headers', 'Content-Type');
            return res.status(204).send('');
        }

        if (req.method !== 'POST') {
            return res.status(405).send('Método no permitido');
        }

        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).send('El tipo de contenido debe ser application/json');
        }

        const { pregunta, etiquetas, nombreDocumentos, threadId, projectId } = req.body;

        console.log('Datos recibidos:', { pregunta, etiquetas, nombreDocumentos, threadId, projectId });

        if (!pregunta || !etiquetas || !nombreDocumentos || !projectId) {
            console.error('Solicitud inválida, faltan parámetros:', { pregunta, etiquetas, nombreDocumentos, projectId });
            return res.status(400).json({
                error: "Todos los parámetros son obligatorios. Verifica los datos enviados."
            });
        }

        // Convertir el array de nombres de documentos en una cadena
        const documentosString = nombreDocumentos.join(', ');

        const etiquetasString = etiquetas.map(etiqueta => `${etiqueta.clave}: ${etiqueta.contenido}`).join(', ');

        const query = `
Responde a la siguiente consulta relacionada con los documentos cuyos nombres son: "${documentosString}". 
Aquí tienes la información relevante del proyecto: ${etiquetasString}. 
Con todo esto, responde a la siguiente pregunta dando la conclusión, sin extenderte; pero siempre haciendo referencia a los datos proporcionados por el usuario si es posible para dar una respuesta más personalizada. Además, después de la conclusión debes citar entre comillas una pequeña parte del archivo donde se ha encontrado la respuesta o desde donde se ha podido intuir la respuesta. La pregunta: ${pregunta}
`;

        let newThreadId = threadId;

        try {
            if (!threadId) {
                newThreadId = await createThread();
                console.log('Nuevo threadId creado:', newThreadId);

                const projectRef = db.collection('Projects').doc(projectId.projectId);
                const projectSnap = await projectRef.get();

                if (projectSnap.exists) {
                    await projectRef.update({ threadId: newThreadId });
                } else {
                    console.error('Proyecto no encontrado con ese ID.');
                    return res.status(404).json({ error: 'Proyecto no encontrado.' });
                }
            }

            // Enviar el mensaje completo con toda la información al asistente
            await sendMessage(newThreadId, query);

            // Iniciar el run sin instrucciones adicionales
            const runId = await startRun(newThreadId);
            console.log('Run iniciado:', runId);

            // Esperar a que el run se complete
            await waitForRunCompletion(newThreadId, runId);

            // Ahora podemos obtener el último mensaje del asistente, pasando el runId
            const respuesta = await getLastAssistantMessage(newThreadId, runId);
            console.log('Última respuesta del asistente:', respuesta);
            return res.status(200).json({ respuesta, threadId: newThreadId });
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            return res.status(500).send('Error al procesar la solicitud.');
        }
    });
});


// Nueva función generateAdditionalTags
exports.generateAdditionalTags = onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method === 'OPTIONS') {
            res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.set('Access-Control-Allow-Headers', 'Content-Type');
            return res.status(204).send('');
        }

        if (req.method !== 'POST') {
            return res.status(405).send('Método no permitido');
        }

        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).send('El tipo de contenido debe ser application/json');
        }

        const { etiquetasActuales, textoProyecto } = req.body;

        console.log('Datos recibidos:', { etiquetasActuales, textoProyecto });

        if (!etiquetasActuales || !Array.isArray(etiquetasActuales) || !textoProyecto) {
            console.error('Solicitud inválida, faltan parámetros o son incorrectos:', { etiquetasActuales, textoProyecto });
            return res.status(400).json({
                error: "Todos los parámetros son obligatorios y deben tener el formato correcto. Verifica los datos enviados."
            });
        }

        try {
            // Construir el prompt para el modelo
            const prompt = `
Teniendo en cuenta las siguientes etiquetas actuales del proyecto:

${etiquetasActuales.map(etiqueta => `- ${etiqueta.name}: ${etiqueta.value}`).join('\n')}

Y el siguiente texto explicativo sobre el proyecto:

"${textoProyecto}"

Genera una lista de etiquetas adicionales relacionadas con la arquitectura que sean relevantes para responder preguntas sobre este proyecto. Si alguna de las etiquetas actuales no tiene valor, también la debes llenar siempre que sea posible. Devuelve las etiquetas en formato JSON como un array de objetos con las propiedades "name" y "value", sin ningún texto adicional ni bloques de código.

Ejemplo de salida:
[
    { "name": "Etiqueta1", "value": "Valor1" },
    { "name": "Etiqueta2", "value": "Valor2" }
]
`;

            // Llamada a la API de OpenAI
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: 'Eres un asistente útil y experto en arquitectura.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                    n: 1,
                    stop: null
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            );

            const completion = response.data.choices[0].message.content.trim();

            console.log('Respuesta del modelo:', completion);

            // Limpiar la respuesta eliminando bloques de código y caracteres innecesarios
            const cleanedCompletion = completion.replace(/```json\s*|```/g, '').trim();

            // Intentar parsear la respuesta como JSON
            let etiquetasAdicionales;
            try {
                etiquetasAdicionales = JSON.parse(cleanedCompletion);
                if (!Array.isArray(etiquetasAdicionales)) {
                    throw new Error('La respuesta no es un array válido.');
                }
            } catch (parseError) {
                console.error('Error al parsear la respuesta del modelo:', parseError);
                return res.status(500).json({
                    error: 'Error al parsear la respuesta del modelo. Asegúrate de que el modelo está devolviendo un array JSON válido de etiquetas.'
                });
            }

            return res.status(200).json({ etiquetasAdicionales });

        } catch (error) {
            console.error('Error al generar etiquetas adicionales:', error.response ? error.response.data : error.message);
            return res.status(500).send('Error al generar etiquetas adicionales.');
        }
    });
});
