const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const ASSISTANT_ID = "asst_eFSYuFil7JgFcgMGPpEwlu27";
const apiKey = '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';
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
                        content: "Hello, I would like to start a conversation."
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

// Función para iniciar un run en el thread
async function startRun(threadId, instructions) {
    try {
        const response = await axios.post(
            `https://api.openai.com/v1/threads/${threadId}/runs`,
            {
                assistant_id: ASSISTANT_ID,
                instructions: instructions,
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

// Función para recuperar el último mensaje generado por el asistente
async function getLastAssistantMessage(threadId) {
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

        const messages = response.data.data;
        const assistantMessages = messages.filter(msg => msg.role === 'assistant');
        if (assistantMessages.length > 0) {
            const lastMessage = assistantMessages[assistantMessages.length - 1];
            const content = lastMessage.content.find(c => c.type === 'text');
            return content.text.value;
        } else {
            throw new Error('No se encontraron mensajes del asistente en la respuesta.');
        }
    } catch (error) {
        console.error('Error al obtener los mensajes:', error.response ? error.response.data : error.message);
        throw new Error('Error al obtener los mensajes del thread.');
    }
}

// Función principal con middleware CORS aplicado correctamente
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

        const { pregunta, etiquetas, nombreDocumento, threadId, projectId } = req.body;

        console.log('Datos recibidos:', { pregunta, etiquetas, nombreDocumento, threadId, projectId });

        if (!pregunta || !etiquetas || !nombreDocumento || !projectId) {
            console.error('Solicitud inválida, faltan parámetros:', { pregunta, etiquetas, nombreDocumento, projectId });
            return res.status(400).json({
                error: "Todos los parámetros son obligatorios. Verifica los datos enviados."
            });
        }

        const vectorStorageId = nombreDocumento.split('-')[1];
        const etiquetasString = etiquetas.map(etiqueta => `${etiqueta.clave}: ${etiqueta.contenido}`).join(', ');

        const query = `
            Responde a la siguiente arquitectura referente al documento del vector storage "${vectorStorageId}". 
            Aquí tienes la información relevante del proyecto: ${etiquetasString}. 
            Con todo esto, responde a la siguiente pregunta dando solo la conclusión, sin extenderte: ${pregunta}
        `;

        let newThreadId = threadId;

        try {
            if (!threadId) {
                newThreadId = await createThread();
                console.log('Nuevo threadId creado:', newThreadId);

                const projectRef = db.collection('Projects').doc(projectId);
                await projectRef.update({ threadId: newThreadId });
            }

            await sendMessage(newThreadId, pregunta);
            const runId = await startRun(newThreadId, query);
            console.log('Run iniciado:', runId);

            const respuesta = await getLastAssistantMessage(newThreadId);
            console.log('Última respuesta del asistente:', respuesta);
            return res.status(200).json({ respuesta, threadId: newThreadId });
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            return res.status(500).send('Error al procesar la solicitud.');
        }
    });
});
