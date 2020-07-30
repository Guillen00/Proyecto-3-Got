const express = require('express');
const router = express.Router();
var  jsdiff = require('diff');
var md5 = require('md5');
let lastcommitid=0;

const pool = require('../database');

router.get('/get', (req, res) => {
    const { repositorio } = req.body;
    const { file } = req.body;
     pool.query("SELECT * FROM "+[file]+"_"+[repositorio] , (err, rows) => {
        if (!err) {
          res.json(rows[0]);
        } else {
          res.send("Error");
        }
    });
});

router.post('/init', async (req, res) => {
    const {name} = req.body;
    var tablaRepositorio = "CREATE TABLE IF NOT EXISTS Repo_"+ [name] + "( lastcommit VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , nameFile VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , PRIMARY KEY (nameFile))";
    await pool.query(tablaRepositorio);
    await pool.query('INSERT INTO Repositorio set ? ', req.body).then(res.send({status: "success"})).catch(error => res.send("Error"));
});

router.post('/commit',  (req, res) => {
    const {name} = req.body;
    const {message} = req.body;
    const {files} = req.body; //Es un array
    const {fileContent} = req.body;//Es un array
    const {commitID} = req.body;
    var commitClient = [commitID];
    var commitServer;

    pool.query('SELECT * FROM Repo_' + [name], (err, rows) => {
        var {lastcommit} = rows[0];
        commitServer = [lastcommit]; 

        if ( commitClient[0] == commitServer[0]){
          for(var i=0; i<files.length;i++){
            var sql = "CREATE TABLE IF NOT EXISTS "+ files[i]+ "_"+ [name] + "( files VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , newLinesAt VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , deletedLinesAt VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL, newLines VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,message VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , commitID VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , name VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , PRIMARY KEY (files))";
            pool.query(sql);
            
            var j=0;
            var newLinesAt=[];
            var deletedLinesAt=[];
            var newLines=[];
            console.log(fileContent[0]);
            var diff= jsdiff.diffTrimmedLines("hola", fileContent[i]);
            diff.forEach(function(part){
                if(part.added){
                  //Se agrega esta parte
                  newLinesAt.push(j);
                  newLines.push(part);
                }else if(part.deleted){
                  //se quita esta parte
                  deletedLinesAt.push(j);
                }
                j++;
                //Como se guardaria esto?
            });
           console.log(newLines)
           console.log(newLinesAt)
            console.log(deletedLinesAt);

            var sqlCommit = "INSERT INTO Repo_" + [name] + "(lastcommit, nameFile) VALUES ('" + md5(lastcommitid) + "', '"+ files[i] +"')";
            pool.query(sqlCommit);
            var data = "INSERT INTO "+ files[i]+ "_"+ [name] +" (files, newLinesAt, deletedLinesAt, newLines, message, commitID, name) VALUES ('"+ files[i] +"','"+newLinesAt+"','"+deletedLinesAt+"','"+newLines+"','"+[message]+"','"+md5(lastcommitid)+"','"+[name]+"')";
            pool.query(data);  
          }
          res.send({status: "success", commiIDs: md5(lastcommitid)});
    
        }else{
          res.send({status:"rejected", reason : "Different Commit Version on Server" });
        }   
        lastcommitid++;
    });
     
    
});

router.get('/status', (req, res) => {
  const {repositorio} = req.body.name;
  const {fileName} = req.body.file;

  if(file==""){
    //Envia los ultimos cambios
    /**
     * retorna:
        {
            cambiados: "[fileName1, fileName2...]",
            eliminados: "[fileName1, fileName2...]",
            agregados: "[fileName1, fileName2...]"
        } o algo asi xD
     */
    pool.query('SELECT * FROM Repo_'+[repositorio], (err, rows) => {
      if (!err) {
        res.json(rows);
      } else {
        res.send("Error");
      }
    });
  }else{
    //Envia el historial de fileName 
    /**
     * {
          commitID: "[id1, id2...]",
          cambios: "[fileContent1, fileContent2...]",
      } 
     */
  }
})

router.put('/rollback', function (req, res) {
  const{repositorio} = req.body.name;
  const{fileName} = req.body.file;
  const{commitID} = req.body.commitID; //Commit al cual volver
  
  //Se devuelve a la version de commit solicitada
  //res.send({file: file, fileContent:fileContent});

})


//Funcion para obtener el commit actual basado en el historial de commits
//Se espera un array de json 
function getFromHistory(commitHistory){
  var finalText=[];
  for(commit in commitHistory){
    //Array con los indices de las nuevas lineas
    var newLinesAt=commit.newLinesAt;
    //Array con los indices de las lineas eliminadas
    var deletedLinesAt=commit.newLinesAt;
    //Array con las nuevas lineas
    var newlines = commit.newlines;


    //Se agregan las nuevas lineas
    for(line in newlines){
      finalText.splice(newLinesAt.shift(), 0, line);
    }

    //Se eliminan las lineas eliminadas
    for(line in deletedlines){
      finalText.splice(deletedLinesAt.shift(), 1)
    }

  }

  return finalText.join();

}



module.exports = router;