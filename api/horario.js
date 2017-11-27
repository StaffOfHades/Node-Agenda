// Verifies if a given variable is not null or undefined.
function exists(variable) {
   return typeof variable != "undefined" && variable;
}

// GET request for user usign their password and username
var getHorario = function(req, res, conn) {

   var pwd = req.query.password;
   var id = req.query.id;
   if(exists(pwd) && exists(id)) {
      conn.query(
         "select horario.id from horario, usuario " +
         "where usuario.id = ? and password = ? and horario.idusuario = usuario.id;",
         [id, pwd],
         function(error, results, fields) {
            if(error) throw error;
            res.send(results);
         }
      );
   } else {
      res.status(400).send("Invalid query parameters. Must contain 'password' and 'id'");
   }
};

module.exports = {
   getHorario
};
