const sql = require('mssql');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

require('dotenv').config();
const { BlobServiceClient } = require("@azure/storage-blob");
const storageAccountConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const multer = require('multer');
const upload = multer({ dest: 'uploads' }); // Temporarily stores files locally



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
  let user_id = req.body.user_id_

  let query = `SELECT element_id, name, description, type, open_date, close_date, course_id, (SELECT COUNT(1) FROM solutions WHERE solutions.element_id = elements.element_id) as number_solutions_in_element, (SELECT COUNT(1) FROM solutions WHERE solutions.element_id=elements.element_id AND user_id=${user_id}) as solutions_sent FROM elements WHERE course_id=${course_id}`

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
  const course_id = req.body.course_id_
  const user_id = req.body.user_id_

  let query = `SELECT user_id, first_name, last_name FROM users WHERE user_id in (SELECT user_id FROM user_course_connection WHERE course_id = ${course_id}) AND user_id != ${user_id}`;

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










// sprawdza czy użytkownik jest już w kursie do którego chce się zapisać 
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










// dodanie nowego elementu 
// plik CreateElement.js
app.post('/api/newelement', (req, res) => {
  try {  
    const { name, description, type, open_date, close_date, course_id } = req.body;
    
    sql.query`INSERT INTO elements (name, description, type, open_date, close_date, course_id) VALUES (${name}, ${description}, ${type}, ${open_date}, ${close_date}, ${course_id})`;
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});










// sprawdzenie ilości użytkowników w kursie 
// plik CoursePage.js
app.post('/api/usersincourse', (req, res) => {
  const request = new sql.Request();
  const course_id = req.body.course_id_
  const user_id = req.body.user_id_

  let query = `SELECT COUNT(1) as number_users_in_course FROM users WHERE user_id in (SELECT user_id FROM user_course_connection WHERE course_id = ${course_id}) AND user_id != ${user_id}`;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// pobranie info o przesłanych rozwiązaniach w danym kursie 
// plik ElementPage.js
app.post('/api/usersstatus', (req, res) => {
  const request = new sql.Request();
  const element_id = req.body.element_id_

  let query = `SELECT user_course_connection.user_id,   (SELECT users.last_name FROM users WHERE users.user_id=user_course_connection.user_id) as last_name,   (SELECT users.first_name FROM users WHERE users.user_id=user_course_connection.user_id) as first_name,   solutions.grade,   (SELECT COUNT(1) FROM solutions WHERE user_id IN (SELECT user_id FROM users WHERE users.user_id=user_course_connection.user_id) AND element_id=${element_id}) as sent_solution   FROM   user_course_connection   LEFT JOIN   solutions ON (solutions.element_id=${element_id} AND solutions.user_id=user_course_connection.user_id)   WHERE   user_course_connection.course_id=(SELECT elements.course_id FROM elements WHERE elements.element_id=${element_id})   AND   user_course_connection.user_id!=(SELECT courses.course_owner FROM courses WHERE courses.course_id=user_course_connection.course_id)   ORDER BY last_name`;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// pobranie info o rozwiązaniach użytkownika w danym elemencie 
// plik ElementPage.js
app.post('/api/userssolutionstatus', (req, res) => {
  const request = new sql.Request();
  const user_id = req.body.user_id_
  const element_id = req.body.element_id_

  let query = `SELECT solution_id, user_id, element_id, grade, grade_comment FROM solutions WHERE user_id=${user_id} AND element_id=${element_id}`;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// przesyła ocene danego rozwiązania do bazy 
// plik MarkSolutionPage.js
app.post('/api/marksolution', (req, res) => {
  const request = new sql.Request();
  const grade = req.body.grade_
  const grade_comment = req.body.grade_comment_
  const user_id = req.body.user_id_
  const element_id = req.body.element_id_

  let query = `UPDATE solutions SET grade='${grade}', grade_comment='${grade_comment}' WHERE user_id=${user_id} AND element_id=${element_id}`;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// pobiera aktualną ocenę i komentarz dla danego rozwiązania 
// plik MarkSolutionPage.js
app.post('/api/solutioninfo', (req, res) => {
  const request = new sql.Request();
  const user_id = req.body.user_id_
  const element_id = req.body.element_id_

  let query = `SELECT grade, grade_comment FROM solutions WHERE user_id=${user_id} AND element_id=${element_id}`;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// pobiera nazwe, opis i daty danego elementu 
// plik EditElementPage.js
app.post('/api/elementinfo', (req, res) => {
  const request = new sql.Request();
  const element_id = req.body.element_id_

  let query = `SELECT name, description, open_date, close_date FROM elements WHERE element_id=${element_id}`;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// zmienia dane elementu 
// plik EditElementPage.js
app.post('/api/editelement', (req, res) => {
  const request = new sql.Request();
  const name = req.body.name_
  const description = req.body.description_
  const open_date = req.body.open_date_
  const close_date = req.body.close_date_
  const element_id = req.body.element_id_
  
  console.log(name + ", " + description + ", " + open_date + ", " + close_date + ", " + element_id)

  let query = `UPDATE elements SET name='${name}', description='${description}', open_date='${open_date}', close_date='${close_date}' WHERE element_id=${element_id}`;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// wysłanie pliku do Azure Storage 
// plik SendSolutionPage.js
app.post('/api/postsolution', upload.array('files'), async (req, res) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnectionString);  // łączy się z Azure Storage
  
  const containerClient = blobServiceClient.getContainerClient('noodle-files');  // ustawia odpowiedni kontener
  // const containerExists = await containerClient.exists()
  // if ( !containerExists) { await containerClient.createIfNotExists(); }  // jeśli kontener nie istnieje, tworzy go

  const blockBlobClient = containerClient.getBlockBlobClient(req.body.files);  // tu ustala lokalizacje i nazwę w serwerze
  await blockBlobClient.uploadFile(req.files[0].path); // wybiera plik z urządzenia użytkownika
});










// wysłanie info  o rozwiązaniu do bazy danych 
// plik SendSolutionPage.js
app.post('/api/postsolutioninfo', async (req, res) => {
  const request = new sql.Request();
  const user_id = req.body.user_id_
  const element_id = req.body.element_id_
  const file_name = req.body.file_name_
  const file_description = req.body.file_description_

  let query = `INSERT INTO solutions (user_id, element_id, file_name, file_description) VALUES (${user_id}, ${element_id}, '${file_name}', '${file_description}')`;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});










// sprawdza czy użytkownik przesłał zadanie do danego elementu 
// plik ElementPage.js
app.post('/api/sentsolution', (req, res) => {
  const request = new sql.Request();
  const user_id = req.body.user_id_
  const element_id = req.body.element_id_

  let query = `SELECT COUNT(1) as sent_solution FROM solutions WHERE user_id=${user_id} AND element_id=${element_id}`;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.json(result.recordset);
    }
  });
});