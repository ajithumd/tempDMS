const express = require('express');
const path = require('path');
const { DBSQLClient } = require('@databricks/sql');

var token           = "dapi72a3bf7e3d89aaac9fca81d8f81fcc73-3";
var server_hostname = "adb-2214799430700015.15.azuredatabricks.net";
var http_path       = "/sql/1.0/warehouses/9c2d5b03322de533";

console.log('JS running successfully');


const client = new DBSQLClient();

async function executeDatabricksQuery(query) {
  const client = new DBSQLClient();

  try {
    await client.connect({
      host: server_hostname,
      path: http_path,
      token: token
    });

    const session = await client.openSession();
    console.log({session})
    const queryOperation = await session.executeStatement(query, { runAsync: true });
    const result = await queryOperation.fetchAll();
    await queryOperation.close();
    await session.close();
    await client.close();

    return result;
  } catch (error) {
    console.error('Error executing Databricks query:', error);
    throw error;
  }
}



const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// Route for the homepage
app.get('/', (req, res) => {
  res.render('index');  // render index.ejs
});

// Route for the policy Page
app.get('/addPolicy', (req, res) => {
  res.render('addPolicy');  // render index.ejs
});
// Route for the view policy Page
app.get('/viewPolicy', (req, res) => {
  res.render('viewPolicy');  // render index.ejs
});

app.post('/execute-query', async (req, res) => {
  try {
    const { query } = req.body;
    const result = await executeDatabricksQuery(query);
    res.json(result);
    res.render('result', {result});
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while executing the query' });
  }
});
app.get('*', (req, res)=>{
  // res.status(404);
  res.render('404');
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
