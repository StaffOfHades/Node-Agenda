// Verifies if a given variable is not null or undefined.
function exists(variable) {
   return typeof variable != "undefined" && variable;
}

// GET request for activity with a given id, returning data from server
var getActivityById = function(req, res, pool) {
   pool.query(
      "select hora, lugar, nombre from actividad where id = ?;",
      [req.params.id],
      function(error, results, fields) {
         if(error) throw error;
         res.send(results);
      }
   );
};

// GET request for activity usign their id
var getActivity = function(req, res, pool) {

   var id = req.query.id;
   if(exists(id) && exists(id)) {
      pool.query(
         "select hora, lugar, nombre from actividad where id = ?;",
         [id],
         function(error, results, fields) {
            if(error) throw error;
            res.send(results);
         }
      );
   } else {
      res.status(400).send(
         "Invalid query parameters.</br>\nRequired query parameters: " +
         JSON.stringify(['id'])
      );
   }
};

// POST request for new activity, adding it to db
var addActivity = function(req, res, pool) {
   console.log(req.body);

   var id = req.body.id;
   var password = req.body.password;
   var hora = req.body.hora;
   var lugar = req.body.lugar;
   var nombre = req.body.nombre;
   var dias = req.body.dias;
   var importancia = req.body.importancia;

   if( exists(id) && exists(password) && exists(hora)
      && exists(lugar) && exists(nombre)
      && exists(dias) && exists(importancia) ) {

      var queries =
         [
            "insert into actividad(hora, lugar, nombre) value(?, ?, ?);",
            "insert into evaluacion(idactividad, calificacion, importancia) " +
            "select max(id), ?, ? from actividad;"
         ];
      var values =
         [
            [hora, lugar, nombre],
            [importancia, importancia]
         ];
      for ( var pos in dias ) {
         queries.push(
            "insert into agenda(idhorario, dia, frecuencia, idactividad) " +
            "select horario.id, ?, ?, (select max(actividad.id) from actividad) " +
            "from horario, usuario " +
            "where usuario.id = ? and password = ? and horario.idusuario = usuario.id;"
         );
         values.push( [dias[pos], dias.length, id, password] );
      }
      queries.push(
         "select actividad.id, hora, lugar, nombre, importancia, dia " +
         "from actividad, evaluacion, agenda " +
         "where actividad.id = evaluacion.idactividad " +
            "and actividad.id = agenda.idactividad " +
            "and actividad.id in (select max(a.id) from actividad a);"
      );
      values.push([]);
      var count = 0;

      var callback = function(error, results, fields) {
         if(error) throw error;
         if(count == queries.length - 1) {
            res.status(201).send(results);
         } else {
            var query = pool.query( queries[++count], values[count], callback );
         }
      };
      var query = pool.query( queries[count], values[count], callback );

   } else {
      res.status(400).send(
         "Invalid body contents.</br>\nRequiered body contents: " +
         JSON.stringify(['password','nombre','hora', 'id', 'lugar', 'dias', 'importancia'])
      );
   }
};

var hello = "Hello there!";
module.exports = {
   getActivityById,
   getActivity,
   addActivity,
};
