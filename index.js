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

// GET request for user, returning data from server
app.get("/user/:id", function (req, res) {
   connection.query(
      "select nombre, edad, correo from user where id = ?",
      [req.params.id],
      function(error, results, fields) {
         if(error) throw error;
         res.send(results);
      }
   );
});

// POST request for new user, adding it to db
app.post("/user", function (req, res) {
   // TODO Validar body
   // TODO Add body to db
   res.send(req.body);
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
