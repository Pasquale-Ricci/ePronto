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
        const result = await client.query('SELECT * FROM "Users" WHERE "Email" = $1', [email]);
        if (result.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash della password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserisci il nuovo utente nel database
        await client.query('INSERT INTO "Users" ("Email", "Password_hash", "Ruolo") VALUES ($1, $2, $3) RETURNING "ID", "Email", "Ruolo" ', [email, hashedPassword, ruolo]);

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
        const result = await client.query('SELECT * FROM "Users" WHERE "Email" = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = result.rows[0];
        if (!user.Password_hash) {
            return res.status(500).json({ error: 'Password hash is missing in database' });
        }
        const isMatch = await bcrypt.compare(password, user.Password_hash);
        if (isMatch) {
            const token = jwt.sign(
                { id: user.ID, email: user.Email, ruolo: user.Ruolo },
                'your_jwt_secret',
                { expiresIn: '1h' }
            );
            const firstLogin = user.Cod_ristorante === null;

            res.json({  
                token,
                ruolo: user.Ruolo,
                cod_ristorante: user.Cod_ristorante,
                firstLogin
            });

        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});





// Rotta per la registrazione del ristorante
app.post('/register-restaurant', async (req, res) => {
    const { nome, email, citta, indirizzo} = req.body;

    if(!nome || !email) {
        return res.status(400).json({ error: 'Nome ristorante e email sono obbligatori' });
    }
    try {
        console.log(`Registrazione ristorante: Nome=${nome}, Email=${email}, citta=${citta}, indirizzo=${indirizzo}`);
       
        const result = await client.query(
            'INSERT INTO "Ristorante" ("Nome", "Citta", "Indirizzo") VALUES ($1, $2,$3) RETURNING "Cod_ristorante"',
            [nome, citta, indirizzo]
        );

        const codRistorante = result.rows[0].Cod_ristorante;

        await client.query(
            'UPDATE "Users" SET "Cod_ristorante" = $1 WHERE "Email" = $2',
            [codRistorante, email]
        );

        res.json({ cod_ristorante: codRistorante });
    } catch (error) {
        res.status(500).json({ error: 'Errore nella registrazione del ristorante', details: error.message });
    }
});



// Rotta degli alert
app.post('/alerts', async (req, res) => {
    try {
        // Alerts sul beverage
        const beverage = await client.query(
            'SELECT "Nome" FROM "Beverage" WHERE "Quantita" <= "Quantita_critica";'
        );
        
        // Alerts sul tempo di attesa
        //Conversione del datatype Interval in tempo attesa in minuti per poter essere 
        //filtrato successivamente
        const ordini = await client.query(
            `SELECT "Cod_ordine", "Totale", "Note_ordine", "Cod_tavolo", "Ora", 
            EXTRACT(EPOCH FROM (NOW() - "Ora")) / 60 AS "tempo_attesa_minuti" 
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

// Rotta per lo staff
app.post('/staff', async (req, res) => {
    try {
        const staff = await client.query(
            `SELECT * FROM "Users" WHERE "Ruolo" = 'dipendente' AND "Cod_ristorante" = 1`
        );
        res.json(staff.rows);
    } catch (error) {
        console.log(error);
    }
});

// Aggiungere dipendente
app.post('/addStaff', async (req, res) => {
    const { cod_dipendente } = req.body;
    const { cod_ristorante } = req.body;
    try {
        const staff = await client.query(
            `UPDATE "Users"
            SET "Cod_ristorante" = 1
            WHERE "ID" = $1 RETURNING *`, [cod_dipendente]
        );
        res.json(staff.rows);
    } catch (error) {
        console.log(error);
    }
});

// Rimuovere dipendente
app.post('/removeStaff', async (req, res) => {
    const { ID } = req.body;

    try {
        const staff = await client.query(
            `UPDATE "Users"
            SET "Cod_ristorante" = NULL
            WHERE "ID" = $1 RETURNING *`, [ID]
        );
        res.json(staff.rows);
    } catch (error) {
        console.log(error);
    }
});

// Rotta per il menu
app.post('/menu', async (req, res) => {
    try {
        const menu = await client.query(
            'SELECT * FROM "Menu" WHERE "Cod_ristorante" = 1 AND "Disponibile" = true'
        );
        res.json(menu.rows); 
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per il report degli ordini
app.post('/orderReport', async (req, res) => {
    try {
        const orderReport = await client.query(
            'SELECT "Ora" FROM "Ordine";'
        );
        res.json(orderReport.rows);
    } catch (error) {
        console.error('Error fetching order report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per il report del beverage
app.post('/beverageReport', async (req, res) => {
    try {
        const beverageReport = await client.query(
            'SELECT "Nome", "Quantita", "Quantita_max", "Quantita_critica" FROM "Beverage";'
        );
        res.json(beverageReport.rows);
    } catch (error) {
        console.error('Error fetching beverage report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per ottenere la lista dei tavoli
app.get('/tables', async (req, res) => {
    try {
        const tables = await client.query(
            'SELECT * FROM "Tavolo" WHERE "Cod_ristorante" = 1;'
        );
        res.json(tables.rows);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per inserire un nuovo ordine
app.post('/orders', async (req, res) => {
    const { table, totale, notes } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO "Ordine" ("Cod_tavolo", "Totale", "Note_ordine", "Ora", "Completato") VALUES ($1, $2, $3, NOW(), false) RETURNING "Cod_ordine"',
            [table, totale, notes]
        );

        const cod_ordine = result.rows[0].Cod_ordine;
        res.status(201).json({ cod_ordine });
    } catch (error) {
        console.error('Error inserting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per inserire i piatti ordinati
app.post('/menu_order', async (req, res) => {
    const { cod_ordine, cod_menu, quantita } = req.body;

    try {
        await client.query(
            'INSERT INTO "Menu_ordine" ("Cod_ordine", "Cod_menu", "Quantita") VALUES ($1, $2, $3)',
            [cod_ordine, cod_menu, quantita]
        );

        res.status(201).json({ message: 'Menu item added to order successfully' });
    } catch (error) {
        console.error('Error inserting menu item to order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per ottenere gli ordini completati
app.get('/completed_orders', async (req, res) => {

    try {
        const completedOrders = await client.query(
            'SELECT * FROM "Ordine" WHERE "Completato" = true AND "Pagato" = false'
        );
        res.json(completedOrders.rows);
    } catch (error) {
        console.error('Error fetching completed orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/seat_customers', async (req, res) => {
    const { tableId } = req.body;

    try {
        await client.query(
            'UPDATE "Tavolo" SET "Disponibile" = false WHERE "Cod_tavolo" = $1',
            [tableId]
        );

        res.json({ message: 'Customers seated successfully' });
    } catch (error) {
        console.error('Error seating customers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per completare il pagamento di un ordine
app.post('/complete_payment', async (req, res) => {
    const { orderId } = req.body;

    try {
        const result = await client.query(
            'UPDATE "Ordine" SET "Pagato" = true WHERE "Cod_ordine" = $1 RETURNING *',
            [orderId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error completing payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post ('/free_table', async (req, res) => {
    const { tableId } = req.body;

    try {
        await client.query(
            'UPDATE "Tavolo" SET "Disponibile" = true WHERE "Cod_tavolo" = $1',
            [tableId]
        );

        res.json({ message: 'Table freed successfully' });
    } catch (error) {
        console.error('Error freeing table:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per ottenere gli ordini con i piatti associati
app.get('/kitchen_orders', async (req, res) => {
    try {
        const orders = await client.query(`
            SELECT o."Cod_ordine", o."Totale", o."Note_ordine", o."Cod_tavolo", o."Ora", o."Completato", o."Pagato",
                   mo."Cod_menu", mo."Quantita", mo."Pronto", m."Nome", m."Descrizione", m."Allergeni", m."Prezzo", m."Tipo_piatto", m."Tempo_cottura"
            FROM "Ordine" o
            JOIN "Menu_ordine" mo ON o."Cod_ordine" = mo."Cod_ordine"
            JOIN "Menu" m ON mo."Cod_menu" = m."Cod_menu"
            ORDER BY o."Ora" ASC
        `);
        res.json(orders.rows);
    } catch (error) {
        console.error('Error fetching kitchen orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Rotta per marcare un piatto come completato o non completato
app.post('/toggle_dish_completion', async (req, res) => {
    const { orderId, menuId, completato } = req.body;

    try {
        await client.query(
            'UPDATE "Menu_ordine" SET "Pronto" = $1 WHERE "Cod_ordine" = $2 AND "Cod_menu" = $3',
            [completato, orderId, menuId]
        );

        // Controlla se tutti i piatti dell'ordine sono completati
        const result = await client.query(
            'SELECT COUNT(*) FROM "Menu_ordine" WHERE "Cod_ordine" = $1 AND "Pronto" = false',
            [orderId]
        );

        if (result.rows[0].count == 0) {
            // Se tutti i piatti sono completati, aggiorna lo stato dell'ordine
            await client.query(
                'UPDATE "Ordine" SET "Completato" = true WHERE "Cod_ordine" = $1',
                [orderId]
            );
        } else {
            // Se non tutti i piatti sono completati, aggiorna lo stato dell'ordine
            await client.query(
                'UPDATE "Ordine" SET "Completato" = false WHERE "Cod_ordine" = $1',
                [orderId]
            );
        }

        res.json({ message: 'Dish completion status updated successfully' });
    } catch (error) {
        console.error('Error updating dish completion status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
