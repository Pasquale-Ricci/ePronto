import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors'; // Importa il pacchetto cors

const app = express();
app.use(express.json()); // Middleware per parsare il body in JSON

const genAI = new GoogleGenerativeAI("AIzaSyDt7wGB_py6H4S_Xi6EXZwxjW1E1rrHciw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Configura CORS
app.use(cors({
    origin: 'http://localhost:5173', // Consenti solo richieste da questo dominio
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metodi consentiti
    allowedHeaders: ['Content-Type', 'Authorization'], // Header consentiti
}));

app.post('/ordina-piatti', async (req, res) => {
    try {
        const { criterio } = req.body; // Ottieni il criterio dal body della richiesta

        if (!criterio) {
            return res.status(400).json({ error: "Il campo 'criterio' è obbligatorio nel body della richiesta." });
        }

        // Recupera i dati degli ordini dalla cucina
        const response = await fetch('http://localhost:3000/kitchen_orders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("Risposta da kitchen_orders:", response); // Debug: log della risposta

        if (!response.ok) {
            throw new Error(`Errore durante il fetch degli ordini: ${response.statusText}`);
        }

        const data = await response.json(); // Estrai i dati JSON dalla risposta
        console.log("Dati degli ordini ricevuti:", data); // Debug: log dei dati ricevuti

        // Verifica che i dati siano un array
        if (!Array.isArray(data)) {
            throw new Error("I dati ricevuti non sono un array.");
        }

        // Filtra gli ordini non completati e i piatti non pronti
        const filteredOrders = data
            .filter(order => order && !order.Completato && !order.Pronto); // Escludi ordini completati e piatti pronti

        console.log("Ordini filtrati:", filteredOrders); // Debug: log degli ordini filtrati

        if (filteredOrders.length === 0) {
            return res.status(200).json({ message: "Nessun ordine da preparare." });
        }

        const dataString = JSON.stringify(filteredOrders, null, 2);

        // Costruisci il prompt per il modello generativo
        const prompt = `
A seguire ti verrà fornita una lista di ordini in formato tabellare in base alle varie caratteristiche, 
devi ordinare i piatti da preparare per questi ordini forniti in formato tabellare ${dataString} in base al criterio seguente: ${criterio}.
Formatta poco il testo e ignora gli ordini completati e i piatti pronti.
in base al criterio devi:
Cronologico: I piatti vanno preparati cronologicamente in base all'ordine a cui appartengono
Parallelo: Cerca di rendere la preparazione totale degli ordini il più breve possibile, mettendo in parallelo i piatti che hanno ad esempio tempo di preparazione maggiore
Graduale: Risolvi prima gli antipasti poi i primi e così via...
Sii il più sintetico possibile, fornendo solo le informazioni essenziali
`;

        console.log("Prompt generato:", prompt); // Debug: log del prompt

        // Genera il contenuto utilizzando il modello
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        console.log("Risultato dell'API:", responseText); // Debug: log del risultato

        // Restituisci il risultato
        res.status(200).json({ risultato: responseText });
    } catch (error) {
        console.error("Errore durante l'elaborazione della richiesta:", error); // Debug: log dell'errore
        res.status(500).json({ error: "Si è verificato un errore durante l'elaborazione della richiesta.", details: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});