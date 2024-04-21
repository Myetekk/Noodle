const sql = require('mssql');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;





app.use(cors());
app.use(express.json());





app.get('/', (req, res) => {
 res.send('Hello World!');
});





app.listen(port, () => {
 console.log(`Server running at http://localhost:${port}`);
});





const config = {
    user: 'NoodleAdmin', 
    password: 'Makaron#Pene', 
    server: 'noodle-server.database.windows.net', 
    port: 1433, 
    database: 'NoodleDataBase', 
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}





sql.connect(config).then(() => {
    console.log('Connected to SQL Server');
}).catch(err => {
    console.error('Error connecting to SQL Server:', err);
});





app.get('/api/data', (req, res) => {
    const request = new sql.Request();
    request.query('SELECT email, password FROM users', (err, result) => {
       if (err) {
         console.error('Error querying database:', err);
         res.status(500).send('Error querying database');
       } else {
         res.json(result.recordset);
       }
    });
   });
