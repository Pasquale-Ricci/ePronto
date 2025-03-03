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
    const { nome, cognome, email, password, ruolo } = req.body;

    try {
        // Controlla se l'utente esiste già
        const result = await client.query('SELECT * FROM "Users" WHERE "Email" = $1', [email]);
        if (result.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash della password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserisce il nuovo utente nel database
        await client.query('INSERT INTO "Users" ("Nome","Cognome","Email", "Password_hash", "Ruolo") VALUES ($1, $2, $3,$4,$5) RETURNING "ID", "Email", "Ruolo" ', [nome, cognome, email, hashedPassword, ruolo]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta di login, basata su template di Rapidapp
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
                firstLogin,
                ID: user.ID
            });

        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

//Rotta Notifiche
app.post('/notifications', async (req, res) => {
    const { userId } = req.body;
    try {
        const notifications = await client.query(
            'SELECT * FROM "Notifiche" WHERE "ID_utente" = $1',
            [userId]
        );
        res.json(notifications.rows);
    } catch (error) {
        console.error('Error fetching completed orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//Rotta per segnare come lette le notifiche
app.post('/markAsRead', async (req, res) => {
    const { id } = req.body;
    try {
        const notifications = await client.query(
            'UPDATE "Notifiche" SET "Letto"= true WHERE "Notifica_id" = $1',
            [id]
        );
    } catch (error) {
        console.error('Error fetching completed orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Rotta per la registrazione del ristorante
app.post('/register-restaurant', async (req, res) => {
    const { nome, id_proprietario, citta, indirizzo } = req.body;

    if (!nome) {
        return res.status(400).json({ error: 'Nome ristorante è obbligatorio' });
    }
    try {

        const result = await client.query(
            'INSERT INTO "Ristorante" ("Nome", "Citta", "Indirizzo") VALUES ($1, $2,$3) RETURNING "Cod_ristorante"',
            [nome, citta, indirizzo]
        );

        const codRistorante = result.rows[0].Cod_ristorante;

        await client.query(
            'UPDATE "Users" SET "Cod_ristorante" = $1 WHERE "ID" = $2',
            [codRistorante, id_proprietario]
        );

        res.json({ cod_ristorante: codRistorante });
    } catch (error) {
        res.status(500).json({ error: 'Errore nella registrazione del ristorante', details: error.message });
    }
});

// Rotta degli alert
app.post('/alerts', async (req, res) => {
    const {cod_ristorante} = req.body;
    try {
        // Alerts sul beverage
        const beverage = await client.query(
            'SELECT "Nome" FROM "Beverage" WHERE "Quantita" <= "Quantita_critica" AND "Cod_ristorante" = $1;',
            [cod_ristorante]
        );
        const alerts = {
            beverage: beverage.rows,
            
        };

        res.json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Rotta per ottenere lo staff del ristorante
app.post('/staff', async (req, res) => {
    const { cod_ristorante } = req.body;
    // Validazione dell'input
    if (!cod_ristorante) {
        return res.status(400).json({ error: 'cod_ristorante è obbligatorio' });
    }

    try {
        const staff = await client.query(
            `SELECT * FROM "Users" 
             WHERE "Ruolo" != 'Proprietario' 
             AND "Cod_ristorante" = $1`,
            [cod_ristorante]
        );
        res.json(staff.rows);
    } catch (error) {
        console.error('Errore durante il recupero dello staff:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
});

//Rotta per aggiungere del personale allo staff
app.post('/addStaff', async (req, res) => {
    const { cod_dipendente, cod_ristorante } = req.body;

    // Validazione dell'input
    if (!cod_dipendente || !cod_ristorante) {
        return res.status(400).json({ error: 'cod_dipendente e cod_ristorante sono obbligatori' });
    }

    try {
        const staff = await client.query(
            `UPDATE "Users"
             SET "Cod_ristorante" = $1
             WHERE "ID" = $2
             AND "Ruolo" != 'Proprietario'
             RETURNING *`,
            [cod_ristorante, cod_dipendente]
        );

        // Verifica se il dipendente è stato trovato e aggiornato
        if (staff.rows.length === 0) {
            return res.status(404).json({ error: 'Dipendente non trovato o già associato a un ristorante' });
        }

        // Restituisci il dipendente aggiornato
        res.json(staff.rows[0]);
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del dipendente:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
});

//Rotta per rimuovere personale dallo staff
app.post('/removeStaff', async (req, res) => {
    const { ID } = req.body;

    try {
        const staff = await client.query(
            `UPDATE "Users"
             SET "Cod_ristorante" = NULL
             WHERE "ID" = $1
             RETURNING *`,
            [ID]
        );

        // Verifica se il dipendente è stato trovato e aggiornato
        if (staff.rows.length === 0) {
            return res.status(404).json({ error: 'Dipendente non trovato' });
        }

        res.json(staff.rows[0]);
    } catch (error) {
        console.error('Errore durante la rimozione del dipendente:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
});

//Rotta per il menu
app.post('/menu', async (req, res) => {
    const { cod_ristorante } = req.body;
    try {
        const menu = await client.query(
            'SELECT * FROM "Menu" WHERE "Cod_ristorante" = $1', 
            [cod_ristorante]
        );
        res.json(menu.rows);
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Rotta per aggiornare il Menu
app.put('/menu_update', async (req, res) => {
    const { Cod_menu, Nome, Descrizione, Allergeni, Prezzo, Tipo_piatto, Tempo_cottura, Disponibile } = req.body;
  
    try {
      const result = await client.query(
        `UPDATE "Menu" 
        SET "Nome" = $1, "Descrizione" = $2, "Allergeni" = $3, "Prezzo" = $4, "Tipo_piatto" = $5, "Tempo_cottura" = $6, "Disponibile" = $7
        WHERE "Cod_menu" = $8 
        RETURNING *`,
        [Nome, Descrizione, Allergeni, Prezzo, Tipo_piatto, Tempo_cottura, Disponibile, Cod_menu]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Elemento del menu non trovato" });
      }
  
      res.json({ message: "Menu aggiornato con successo", menu: result.rows[0] });
    } catch (error) {
      console.error("Errore aggiornamento menu:", error);
      res.status(500).json({ error: "Errore del server" });
    }
});

//Rotta per ottenere il Beverage del ristorante
app.post('/beverages', async (req, res) => {
    const { cod_ristorante } = req.body;
    try {
        const beverages = await client.query(
            'SELECT * FROM "Beverage" WHERE "Cod_ristorante" = $1', 
            [cod_ristorante]
        );
        res.json(beverages.rows);
    } catch (error) {
        console.error('Error fetching beverages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Rotta per aggiornare il Beverage
app.post('/beverages_add', async (req, res) => {
    const { Nome, Scadenza, Quantita, Quantita_max, Quantita_critica, Cod_ristorante } = req.body;

    if (!Nome || !Scadenza || !Quantita || !Quantita_max || !Quantita_critica || !Cod_ristorante) {
        return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    try {
        const result = await client.query(
            `INSERT INTO "Beverage" ("Nome", "Scadenza", "Quantita", "Quantita_max", "Quantita_critica", "Cod_ristorante")
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [Nome, Scadenza, Quantita, Quantita_max, Quantita_critica, Cod_ristorante]
        );

        res.json({ message: "Bevanda aggiunta con successo", beverage: result.rows[0] });
    } catch (error) {
        console.error("Errore aggiunta bevanda:", error);
        res.status(500).json({ error: "Errore del server", details: error.message });
    }
});

  

// Rotta per il report degli ordini, usato dalla GraphSection
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

// Rotta per il report del beverage, usato dalla GraphSection
app.post('/beverageReport', async (req, res) => {
    const { cod_ristorante } = req.body; 
    try {
        const beverageReport = await client.query(
            'SELECT "Nome", "Quantita", "Quantita_max", "Quantita_critica" FROM "Beverage" WHERE "Cod_ristorante" = $1;',
            [cod_ristorante]
        );
        res.json(beverageReport.rows);
    } catch (error) {
        console.error('Error fetching beverage report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per ottenere la lista dei tavoli
app.post("/tables", async (req, res) => {
    const { cod_ristorante } = req.body;

    if (!cod_ristorante) {
        return res.status(400).json({ error: "cod_ristorante è obbligatorio" });
    }

    try {
        const tables = await client.query(
            'SELECT * FROM "Tavolo" WHERE "Cod_ristorante" = $1;',
            [cod_ristorante]
        );
        res.json(tables.rows);
    } catch (error) {
        console.error("Error fetching tables:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Rotta per aggiungere un nuovo tavolo
app.post("/add_table", async (req, res) => {
    const { posti, cod_ristorante } = req.body;

    if (!posti || !cod_ristorante) {
        return res.status(400).json({ error: "Il numero di posti e il codice ristorante sono obbligatori" });
    }

    try {
        const result = await client.query(
            'INSERT INTO "Tavolo" ("Posti", "Cod_ristorante") VALUES ($1, $2) RETURNING *;',
            [posti, cod_ristorante]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding table:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Rotta per rimuovere un tavolo
app.delete("/remove_table", async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID del tavolo è obbligatorio" });
    }

    try {
        const result = await client.query(
            'DELETE FROM "Tavolo" WHERE "Cod_tavolo" = $1 RETURNING *;',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Tavolo non trovato" });
        }

        res.json({ message: "Tavolo rimosso con successo" });
    } catch (error) {
        console.error("Error removing table:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Rotta per inserire un nuovo ordine
app.post('/orders', async (req, res) => {
    const { table, totale, notes } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO "Ordine" ("Cod_tavolo", "Totale", "Note_ordine", "Ora") VALUES ($1, $2, $3, NOW()) RETURNING "Cod_ordine"',
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

//Rotta per creare il menu
app.post('/create_menu', async (req, res) => {
    const { nome, descrizione, allergeni, prezzo, tipo_piatto, tempo_cottura, Disponibile, Cod_ristorante } = req.body;

    if (!Cod_ristorante || isNaN(Cod_ristorante)) {
        return res.status(400).json({ error: "Cod_ristorante non valido" });
    }

    try {
        await client.query(
            'INSERT INTO "Menu" ("Nome", "Descrizione", "Allergeni", "Prezzo", "Tipo_piatto", "Tempo_cottura", "Disponibile", "Cod_ristorante") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [nome, descrizione, allergeni, prezzo, tipo_piatto, tempo_cottura, Disponibile, parseInt(Cod_ristorante)]
        );
        res.json({ message: 'Menu added successfully' });
    } catch (error) {
        console.error('Error adding menu:', error);
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

//Rotta per impostare un tavolo occupato
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

//Rotta per rendere disponibile un tavolo dopo il pagamento di tutti gli ordini
app.post('/free_table', async (req, res) => {
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
           SELECT o."Cod_ordine", o."Totale", o."Note_ordine", o."Cod_tavolo", 
            TO_CHAR(o."Ora", 'YYYY-MM-DD"T"HH24:MI') AS "Ora", 
            o."Completato", o."Pagato",
            mo."Cod_menu", mo."Quantita", mo."Pronto", 
            m."Nome", m."Descrizione", m."Allergeni", m."Prezzo", m."Tipo_piatto", m."Tempo_cottura"
            FROM "Ordine" o
            JOIN "Menu_ordine" mo ON o."Cod_ordine" = mo."Cod_ordine"
            JOIN "Menu" m ON mo."Cod_menu" = m."Cod_menu"
            ORDER BY o."Ora" ASC;
        `);
        res.json(orders.rows);
    } catch (error) {
        console.error('Error fetching kitchen orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per marcare un piatto come pronto o non pronto
app.post('/toggle_dish_completion', async (req, res) => {
    const { orderId, menuId, completato } = req.body;

    try {
        const result = await client.query(
            `UPDATE "Menu_ordine"
             SET "Pronto" = $1
             WHERE "Cod_ordine" = $2 AND "Cod_menu" = $3
             RETURNING *`,
            [completato, orderId, menuId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Piatto non trovato' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error toggling dish completion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per contrassegnare un ordine come completato (un ordine in cui tutti i singoli piatti sono pronti)
app.post('/complete_order', async (req, res) => {
    const { orderId } = req.body;

    try {
        const result = await client.query(
            `UPDATE "Ordine"
             SET "Completato" = TRUE
             WHERE "Cod_ordine" = $1
             RETURNING *`,
            [orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ordine non trovato' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error completing order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rotta per inviare notifiche ai camerieri
app.post('/notify', async (req, res) => {
    const { orderId, codRistorante, message } = req.body;

    try {
        // Recupera tutti gli utenti con il ruolo di cameriere e appartenenti allo stesso ristorante
        const result = await client.query(
            `SELECT "ID" FROM "Users"
             WHERE "Ruolo" = $1 AND "Cod_ristorante" = $2`,
            ['Cameriere', codRistorante]
        );

        const cameriereIds = result.rows.map(row => row.ID);

        // Invia una notifica a ciascun cameriere
        for (const cameriereId of cameriereIds) {
            await client.query(
                `INSERT INTO "Notifiche" ("ID_utente", "Messaggio")
                 VALUES ($1, $2)`,
                [cameriereId, message]
            );
        }

        res.json({ message: 'Notifiche inviate ai camerieri.' });
    } catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
