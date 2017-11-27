var user = require("./user.js");
var mysql = require("mysql");
var connection;

var addAPI = function(app) {

   app.get("/usuario/:id", function (req, res) {
      user.getUserById(req, res, connection);
   });

   app.all("/usuario", function (req, res) {
      switch(req.method) {
         case "GET":
            user.getUser(req, res, connection);
            break;
         case "POST":
            user.addUser(req, res, connection);
            break;
         case "PUT":
            user.updateUser(req, res, connection);
            break;
         case "DELETE":
            user.deleteUser(req, res, connection);
            break;
         case "HEAD":
            res.send({"ALLOWED":["GET", "POST", "PUT", "DELETE", "HEAD"]});
            break;
         default:
            res.status(405).send();
      }
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
};

module.exports = {
   start
};
