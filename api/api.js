var user = require("./user.js");
var horario = require("./horario.js");
var mysql = require("mysql");
var pool;

var addAPI = function(app) {

   app.get("/usuario/:id", function (req, res) {
      user.getUserById(req, res, pool);
   });

   app.all("/usuario", function (req, res) {
      switch(req.method) {
         case "GET":
            user.getUser(req, res, pool);
            break;
         case "POST":
            user.addUser(req, res, pool);
            break;
         case "PUT":
            user.updateUser(req, res, pool);
            break;
         case "DELETE":
            user.deleteUser(req, res, pool);
            break;
         case "HEAD":
            res.send({"ALLOWED":["GET", "POST", "PUT", "DELETE", "HEAD"]});
            break;
         default:
            res.status(405).send();
      }
   });

   app.all("/horario", function (req, res) {
      switch(req.method) {
         case "GET":
            horario.getHorario(req, res, pool);
            break;
         case "HEAD":
            res.send({"ALLOWED":["GET", "HEAD"]});
            break;
         default:
            res.status(405).send();
      }
   });
};

var start = function(app) {

   // Create pool to mysql server
   pool = mysql.createPool({
      connectionLimit: 10,
      database: "agenda",
      user: "root",
      password: "root"
   });

   // Try to open pool
   pool.getConnection(function(err, conn) {
      if (err) {
         console.error('error connecting: ' + err.stack);
      }
      addAPI(app);
      console.log('connected succesfully to db');
      conn.release();
   });
};

module.exports = {
   start
};
