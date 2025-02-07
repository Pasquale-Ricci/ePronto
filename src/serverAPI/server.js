// Importa le dipendenze
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';

const { Client } = pkg;


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Credenziali Database
const client = new Client({
    host: 'pg.rapidapp.io',
    port: 5433,
    user: 'u_1aa82ef6_757a_4fe5_9d92_17fad7b12799',
    password: 'HL55j086F63QeUYzcc5k4J380wWo56vPlbBca982cpg97HtUC2ZA',
    database: 'db_1aa82ef6_757a_4fe5_9d92_17fad7b12799',
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));

// Rotta di registrazione
app.post('/register', async (req, res) => {
    const { email, password, ruolo } = req.body;

    try {
        // Controlla se l'utente esiste già
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash della password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserisci il nuovo utente nel database
        await client.query('INSERT INTO users (email, password_hash, ruolo) VALUES ($1, $2, $3) RETURNING id, email, ruolo ', [email, hashedPassword, ruolo]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta di login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password_hash)) {
            const token = jwt.sign({ id: user.id, email: user.email, ruolo: user.ruolo }, 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ token });
            localStorage.setItem({codRistorante : 1}, {ruolo : "proprietario"})
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta degli alert
app.post('/alerts', async (req, res) => {
    try {
        // Alerts sul beverage
        const beverage = await client.query(
            'SELECT "Nome" FROM "Beverage" WHERE "Quantità" <= "Quantità_critica";'
        );
        
        // Alerts sul tempo di attesa
        //Conversione del datatype Interval in tempo attesa in minuti per poter essere 
        //filtrato successivamente
        const ordini = await client.query(
            `SELECT "Cod_ordine", "Totale", "NoteOrdine", "Cod_tavolo", "ora", 
            EXTRACT(EPOCH FROM (NOW() - "ora")) / 60 AS "tempo_attesa_minuti" 
            FROM "Ordine";`
        );

        const ordiniFiltrati = ordini.rows.filter(ordine => ordine.tempo_attesa_minuti > 20);

        const alerts = {
            beverage: beverage.rows,
            ordini: ordiniFiltrati
        };

        res.json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Rotta per lo staff
app.post('/staff', async (req, res) => {
    try {
        const staff = await client.query(
            `SELECT * FROM "users" WHERE "ruolo" = 'dipendente' AND "Cod_ristorante" = 1`
        );
        res.json(staff.rows);
    }
    
    catch(error){
        console.log(error);
        
    }
})

// Rotta per il menu
app.post('/menu', async (req, res) => {
    try {
        const menu = await client.query(
            'SELECT * FROM menu WHERE cod_ristorante = 1 AND disponibile = true'
        );
        res.json(menu.rows); 
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})



// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
