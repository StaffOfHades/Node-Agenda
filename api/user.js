// Verifies if a given variable is not null or undefined.
function exists(variable) {
   return typeof variable != "undefined" && variable;
}

// GET request for user with a given, returning data from server
var getUserById = function(req, res, conn) {
   conn.query(
      "select nombre, edad, correo from usuario where id = ?;",
      [req.params.id],
      function(error, results, fields) {
         if(error) throw error;
         res.send(results);
      }
   );
};

// GET request for user usign their password and username
var getUser = function(req, res, conn) {

   var pwd = req.query.password;
   var name = req.query.nombre;
   if(exists(pwd) && exists(name)) {
      conn.query(
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
};

// POST request for new user, adding it to db
var addUser = function(req, res, conn) {

   var name = req.body.nombre;
   var pwd = req.body.password;
   var edad = req.body.password;
   var correo = req.body.correo;
   var result =
      function(error, results, fields) {
         if(error) throw error;
         res.status(201).send();
      };


   if(exists(name) && exists(pwd) && exists(correo)) {
      if(exists(edad)) {
         conn.query(
            "insert into usuario(nombre, correo, password, edad) value(?, ?, ?, ?);",
            [name, correo, pwd, edad],
            result
         );
      } else {
         conn.query(
            "insert into usuario(nombre, correo, password) value(?, ?, ?);",
            [name, correo, pwd],
            result
         );
      }
   } else {
      res.status(400).send("Invalid body content");
   }
};

// DELETE request for a user given its name and password.
var deleteUser = function(req, res, conn) {

   var pwd = req.query.password;
   var name = req.query.nombre;
   if(exists(pwd) && exists(name)) {
      conn.query(
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
};

var hello = "Hello there!";
module.exports = {
   getUserById,
   getUser,
   addUser,
   deleteUser,
   hello
};
