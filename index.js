var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var app = express();

// Create connection to mysql server
var connection = mysql.createConnection({
   database: "agenda",
   user: "root",
   password: null
});

// Serve static content (previously created hmtl files)
app.use("/", express.static(path.join(__dirname, "public")));

// Allows Express to recieve json content and parse it
app.use(bodyParser.json());

// Redirect index to register user
app.get("/", function (req, res) {
   res.redirect("/registrarUsuario.html");
});

// GET request for user with a given, returning data from server
app.get("/usuario/:id", function (req, res) {
   connection.query(
      "select nombre, edad, correo from usuario where id = ?;",
      [req.params.id],
      function(error, results, fields) {
         if(error) throw error;
         res.send(results);
      }
   );
});

// Verifies if a given variable is not null or undefined.
function exists(variable) {
   return typeof variable != "undefined" && variable;
}

// GET request for user usign their password and username
app.get("/usuario", function (req, res) {

   var pwd = req.query.password;
   var name = req.query.nombre;
   if(exists(pwd) && exists(name)) {
      connection.query(
         "select id, edad, correo from usuario where nombre = ? and password = ?;",
         [name, pwd],
         function(error, results, fields) {
            if(error) throw error;
            res.send(results);
         }
      );
   } else {
      res.status(400).send("Invalid query parameters. Must contain 'password' and 'nombre'");
   }
});

// POST request for new user, adding it to db
app.post("/usuario", function (req, res) {

   var name = req.body.nombre;
   var pwd = req.body.password;
   var edad = req.body.password;
   var correo = req.body.correo;
   if(exists(name) && exists(pwd) && exists(correo)) {
      if(exists(edad)) {
         connection.query(
            "insert into usuario(nombre, correo, password, edad) value(?, ?, ?, ?);",
            [name, correo, pwd, edad],
            function(error, results, fields) {
               if(error) throw error;
               res.status(201).send();
            }
         );
      } else {
         connection.query(
            "insert into usuario(nombre, correo, password) value(?, ?, ?);",
            [name, correo, pwd],
            function(error, results, fields) {
               if(error) throw error;
               res.status(201).send();
            }
         );
      }
   } else {
      res.status(400).send("Invalid body content");
   }
});

// DELETE request for a user given its name and password.
app.delete("/usuario", function (req, res) {

   var pwd = req.query.password;
   var name = req.query.nombre;
   if(exists(pwd) && exists(name)) {
      connection.query(
         "delete from usuario where nombre = ? and password = ?;",
         [name, pwd],
         function(error, results, fields) {
            if(error) throw error;
            res.status(204).send();
         }
      );
   } else {
      res.status(400).send("Invalid query parameters. Must contain 'password' and 'nombre'");
   }
});


// Try to open connection
connection.connect(function(err) {
   if (err) {
      console.error('error connecting: ' + err.stack);
      return;
   }
   console.log('connected as id ' + connection.threadId);
   app.listen(3000);
});
