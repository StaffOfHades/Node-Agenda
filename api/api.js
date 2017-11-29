var user = require("./user.js");
var horario = require("./horario.js");
var actividad = require("./actividad.js");
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
            res.send(JSON.stringify(["GET", "POST", "PUT", "DELETE", "HEAD"]));
            break;
         default:
            res.status(405).send();
      }
   });

   app.all("/usuario/horario", function (req, res) {
      switch(req.method) {
         case "GET":
            horario.getHorario(req, res, pool);
            break;
         case "HEAD":
            res.send(JSON.stringify(["GET", "HEAD"]));
            break;
         default:
            res.status(405).send();
      }
   });

   app.post("/usuario/horario/actividad", function (req, res) {
      actividad.addActivity(req, res, pool);
   });

   app.get("/horario", function (req, res) {
      horario.getHorarioId(req, res, pool);
   });

   app.get("/actividad/:id", function (req, res) {
      actividad.getActivityById(req, res, pool);
   });

   app.get("/actividad", function (req, res) {
      actividad.getActivity(req, res, pool);
   });
};

var start = function(app) {

   // Create pool to mysql server
   pool = mysql.createPool({
      connectionLimit: 10,
      database: "agenda",
      user: "root",
      password: null
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
