// Verifies if a given variable is not null or undefined.
function exists(variable) {
   return typeof variable != "undefined" && variable;
}

// GET request for user with a given, returning data from server
var getUserById = function(req, res, pool) {
   pool.query(
      "select nombre, edad, correo from usuario where id = ?;",
      [req.params.id],
      function(error, results, fields) {
         if(error) throw error;
         res.send(results);
      }
   );
};

// GET request for user usign their password and username
var getUser = function(req, res, pool) {

   var pwd = req.query.password;
   var name = req.query.nombre;
   if(exists(pwd) && exists(name)) {
      pool.query(
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
var addUser = function(req, res, pool) {

   var name = req.body.nombre;
   var pwd = req.body.password;
   var edad = req.body.edad;
   var correo = req.body.correo;
   var values = [name, correo, pwd];

   if(exists(name) && exists(pwd) && exists(correo)) {

      var query = "insert into usuario(nombre, correo, password";
      if(exists(edad)) {
         values.push(edad);
         query += ", edad) value(?, ?, ?, ?";
      } else {
         query += ") values(?, ?, ?";
      }
      query += ");";
      var queries =
         [
            query,
            "insert into horario (idusuario) select max(id) from usuario;",
            "select id, password from usuario where id = (select max(id) from usuario);"
         ];
      var count = 0;

      var callback = function(error, results, fields) {
         if(error) throw error;
         if(count == 2) {
            res.status(201).send(results);
         } else {
            pool.query( queries[++count], callback );
         }
      };
      pool.query( query, values, callback );
   } else {
      res.status(400).send("Invalid body content");
   }
};

// PUT request for updating user data given its id and password.
var updateUser = function(req, res, pool) {

   var id = req.body.id;
   var name = req.body.nombre;
   var pwd = req.body.password;
   var newPwd = req.body.newpassword;
   var edad = req.body.edad;
   var correo = req.body.correo;
   var values = [];
   var query = "update usuario set";
   if( exists(newPwd) ) {
      query += " password = ?,";
      values.push(newPwd);
   }
   if( exists(name) ) {
      query += " nombre = ?,";
      values.push(name);
   }
   if( exists(edad) ) {
      query += " edad = ?,";
      values.push(edad);
   }
   if( exists(correo) ) {
      query += " correo = ?,";
      values.push(correo);
   }
   if(values.length > 0) {
      query = query.slice(0, -1);
      query += " where id = ? and password = ?;";
      values.push(id);
      values.push(pwd);
      if(exists(pwd) && exists(id)) {

         pool.query(
            query,
            values,
            function(error, results, fields) {
               if(error) throw error;
               res.status(200).send();
            }
         );
      } else {
         res.status(400).send("Invalid query parameters. Must contain 'password' and 'id'");
      }
   } else {
      res.status(400).send("No values to update");
   }


};

// DELETE request for a user given its id and password.
var deleteUser = function(req, res, pool) {

   var pwd = req.query.password;
   var id = req.query.id;
   if(exists(pwd) && exists(id)) {
      pool.query(
         "delete from usuario where id = ? and password = ?;",
         [id, pwd],
         function(error, results, fields) {
            if(error) throw error;
            res.status(204).send();
         }
      );
   } else {
      res.status(400).send("Invalid query parameters. Must contain 'password' and 'id'");
   }
};

var hello = "Hello there!";
module.exports = {
   getUserById,
   getUser,
   addUser,
   deleteUser,
   updateUser
};
