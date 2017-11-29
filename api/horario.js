// Verifies if a given variable is not null or undefined.
function exists(variable) {
   return typeof variable != "undefined" && variable;
}

// GET request for horario id usign user password and username
var getHorarioId = function(req, res, pool) {

   var pwd = req.query.password;
   var id = req.query.id;
   if(exists(pwd) && exists(id)) {
      pool.query(
         "select horario.id from horario, usuario " +
         "where usuario.id = ? and password = ? and horario.idusuario = usuario.id;",
         [id, pwd],
         function(error, results, fields) {
            if(error) throw error;
            res.send(results);
         }
      );
   } else {
      res.status(400).send(
         "Invalid query parameters.</br>\nRequired query parameters: " +
         JSON.stringify(['password','id'])
      );
   }
};

// GET request for horario usign user password and username
var getHorario = function(req, res, pool) {

   var pwd = req.query.password;
   var id = req.query.id;
   if(exists(pwd) && exists(id)) {
      var query = pool.query(
         "select actividad.hora, actividad.lugar, actividad.nombre, agenda.dia, agenda.frecuencia " +
         "from actividad, agenda, horario, usuario " +
         "where actividad.id = agenda.idactividad and agenda.idhorario = horario.id " +
            "and horario.idusuario = usuario.id and usuario.id = ? " +
            "and password = ? order by agenda.dia, actividad.hora;",
         [id, pwd],
         function(error, results, fields) {
            if(error) throw error;
            res.send(results);
         }
      );

   } else {
      res.status(400).send(
         "Invalid query parameters.</br>\nRequired query parameters: " +
         JSON.stringify(['password','id'])
      );
   }
};

module.exports = {
   getHorario,
   getHorarioId
};
