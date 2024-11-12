const { DBSQLClient } = require('@databricks/sql');

var token           = "dapi72a3bf7e3d89aaac9fca81d8f81fcc73-3";
var server_hostname = "adb-2214799430700015.15.azuredatabricks.net";
var http_path       = "/sql/1.0/warehouses/9c2d5b03322de533";

console.log('JS running successfully');


const client = new DBSQLClient();

console.log('JS running successfully');
client.connect(
  options = {
    token: token,
    host:  server_hostname,
    path:  http_path
  }).then(
    async client => {
      const session = await client.openSession();
      console.log('HERE 1');
      const queryOperation = await session.executeStatement(
        statement = "SELECT 1",
        options   = { runAsync: true });
        console.log('HERE 2');
      const result = await queryOperation.fetchAll();
      await queryOperation.close();

      console.table(result);

      await session.close();
      await client.close();
}).catch(error => {
  console.log(error);
});



