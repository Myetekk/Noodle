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










// pobranie informacji o użytkownikach typu 1 lub 2
// plik Login.js
app.post('/api/headadmin', (req, res) => {
  const request = new sql.Request();
  const type = req.body.type_;

  request.query(`SELECT first_name, last_name FROM users WHERE type='${type}'`, (err, result) => {
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

  let query = `SELECT courses.course_id, courses.course_name, courses.course_owner, users.first_name, users.last_name FROM courses INNER JOIN users ON users.user_id=courses.course_owner WHERE course_id=${course_id[0]}`

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










// pobranie infromacji o elementach które przynależą do tego kursu
// plik MainPage.js
app.post('/api/courseelements', (req, res) => {
  const request = new sql.Request();
  let course_id = req.body.course_id_

  let query = `SELECT element_id FROM course_element_connection WHERE course_id=${course_id}`

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// pobranie informacji o elementach w kursie 
// plik CoursePage.js
app.post('/api/loadelements', (req, res) => {
  const request = new sql.Request();
  let element_id = req.body

  let query = `SELECT * FROM elements WHERE element_id=${element_id[0]}`
  if (element_id.length > 1){
    element_id.forEach( element => {
      query += ` OR element_id='${element}'`
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










// ładuje informacje o aktywnych studentach (zakładając stworzenie później tych nieaktywnych)
// plik CoursePage.js
app.post('/api/loadactivestudents', (req, res) => {
  const request = new sql.Request();
  const course_id = req.body.course_id_;

  // wywaliłem sprawdzanie czy type użytwkownika to '1', bo chyba zakładamy że admini też mogą być kursantami
  let query = `SELECT first_name, last_name FROM users WHERE user_id in (SELECT user_id FROM user_course_connection WHERE course_id = ${course_id})`;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// sprawdza czy wygenerowany kod dostępu do kursu istnieje w bazie 
// plik CreateCourse.js
app.post('/api/accesscodeexists', (req, res) => {
  const request = new sql.Request();
  let access_code = req.body.access_code_

  let query = `SELECT COUNT(course_id) as does_course_exists from courses where access_code=${access_code}`

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// dodanie nowego kursu 
// plik CreateCourse.js
app.post('/api/newcourse', async (req, res) => {
  try {  
    const { course_name, course_owner, access_code } = req.body;
    
    await sql.query`INSERT INTO courses (course_name, course_owner, access_code) VALUES (${course_name}, ${course_owner}, ${access_code})`;
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});










// pobiera id kursu o podanym kodzie dostępu 
// plik MainPage.js
app.post('/api/accesscodecourseid', (req, res) => {
  const request = new sql.Request();
  let access_code = req.body.access_code_

  let query = `SELECT course_id from courses where access_code=${access_code}`

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// pobiera id kursu o podanym kodzie dostępu 
// plik MainPage.js
app.post('/api/isuserincourse', (req, res) => {
  const request = new sql.Request();
  let user_id = req.body.user_id_
  let course_id = req.body.course_id_

  let query = `SELECT COUNT(1) as is_user_in_course from user_course_connection where user_id=${user_id} AND course_id=${course_id}`

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// pobiera id kursu o podanym kodzie dostępu 
// plik MainPage.js
app.post('/api/addusertocourse', (req, res) => {
  const request = new sql.Request();
  let user_id = req.body.user_id_
  let course_id = req.body.course_id_

  let query = `INSERT INTO user_course_connection (user_id, course_id) VALUES (${user_id}, ${course_id})`

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});