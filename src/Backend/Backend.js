const sql = require('mssql');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;





app.use(cors());
app.use(express.json());





app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});










// info do zalogowania się do bazy danych
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










// połączenie z bazą danych
sql.connect(config).then(() => {
  console.log('Connected to SQL Server');
}).catch(err => {
  console.error('Error connecting to SQL Server:', err);
});










// pobranie wszystkich emaili i haseł, używane przy logowaniu
// plik Login.js
app.get('/api/users', (req, res) => {
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










// pobranie informacji o użytkowniku oraz jego ustawień, używane po zalogowaniu
// plik Login.js
app.post('/api/user/info', (req, res) => {
  const request = new sql.Request();
  const email = req.body.email_;

  request.query(`SELECT user_id, first_name, last_name, email, password, type, new_mark_notify, solution_sent_notify, date_incoming_notify FROM users where email='${email}'`, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// zaktualizowanie ustawień użytkownika
// plik UserSettings.js
app.post('/api/user/updateinfo', (req, res) => {
  try {  
    const { user_id, first_name, last_name, email, password, new_mark_notify, solution_sent_notify, date_incoming_notify } = req.body;
    
    const result = sql.query`UPDATE users SET first_name=${first_name}, last_name=${last_name}, email=${email}, password=${password}, new_mark_notify=${new_mark_notify}, solution_sent_notify=${solution_sent_notify}, date_incoming_notify=${date_incoming_notify} where user_id=${user_id}`;
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});










// dodanie nowego użytkownika po rejestracji
// plik Register.js
app.post('/api/newUser', async (req, res) => {
  try {  
    const { first_name, last_name, email, password, type } = req.body;
    
    const result = await sql.query`INSERT INTO users (first_name, last_name, email, password, type, new_mark_notify, solution_sent_notify, date_incoming_notify) VALUES (${first_name}, ${last_name}, ${email}, ${password}, ${type}, 1, 1, 1)`;
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});










// pobranie infromacji o kursach do którego przynależy użytkownik
// plik MainPage.js
app.post('/api/usercourses', (req, res) => {
  const request = new sql.Request();
  let user_id = req.body.user_id_

  let query = `SELECT course_id FROM user_course_connection WHERE user_id=${user_id}`

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// pobranie informacji o danym kursie 
// plik MainPage.js
app.post('/api/loadcourses', (req, res) => {
  const request = new sql.Request();
  let course_id = req.body

  let query = `SELECT course_id, course_name, course_owner, course_users, course_elements FROM courses WHERE course_id=${course_id[0]}`
  if (course_id.length > 1){
    course_id.forEach( element => {
      query += ` OR course_id='${element}'`
    });
  }

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










//