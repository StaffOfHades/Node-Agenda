var user = require("./user.js");
var mysql = require("mysql");
var connection;

var addAPI = function(app) {

   app.get("/usuario/:id", function (req, res) {
      user.getUserById(req, res, connection);
   });

   app.get("/usuario", function (req, res) {
      user.getUser(req, res, connection);
   });

   app.post("/usuario", function (req, res) {
      user.addUser(req, res, connection);
   });

   app.delete("/usuario", function (req, res) {
      user.deleteUser(req, res, connection);
   });
};

var start = function(app) {

   // Create connection to mysql server
   connection = mysql.createConnection({
      database: "agenda",
      user: "root",
      password: null
   });

   // Try to open connection
   connection.connect(function(err) {
      if (err) {
         console.error('error connecting: ' + err.stack);
      }
      addAPI(app);
      console.log('connected as id ' + connection.threadId);
   });
   return true;
};

module.exports = {
   start
};
