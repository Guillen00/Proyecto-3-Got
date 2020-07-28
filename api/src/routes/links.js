const express = require('express');

const router = express.Router();

var jsdiff = require('diff');
var md5 = require('md5');
let lastcommitid=0;

const pool = require('../database');

router.get('/get', (req, res) => {
    const { repositorio } = req.body.name;
    const { file } = req.body.file;
     pool.query('SELECT * FROM Repositorio WHERE ID = ? ', [repositorio], (err, rows) => {
        if (!err) {
          res.json(rows[0]);
        } else {
          res.send("Error");
        }
    });
});

router.post('/init', async (req, res) => {
    const {id} = req.body.name;
    var tablaRepositorio = "CREATE TABLE IF NOT EXISTS Repo_"+ [id] + "( lastcommit VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , nameFile VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , PRIMARY KEY (nameFile))";
    pool.query(tablaRepositorio);
    await pool.query('INSERT INTO Repositorio set ? ', req.body).then(res.send({status: "success"})).catch(error => res.send("Error"));
});

router.post('/commit',  (req, res) => {
    const {repositorio} = req.body.name;
    const {mensaje} = req.body.message;
    const {fileName} = req.body.files; //Es un array
    const {fileContent} = req.body.fileContent;//Es un array
    const {commitID} = req.body.commitID;

    var verificarCommit;
    var lastcommit = "Ultimo";

    pool.query('SELECT * FROM Repo_' + [repositorio], (err, rows) => {
      if (!err) {
        verificarCommit = rows[0];
        lastcommit = verificarCommit.commit;
      } 
    });
    
    if (lastcommit == [commitID]){
      
      for(var i=0; i<fileName.length;i++){
        //var diff= JsDiff.diffTrimmedLines(oldCommit, newCommit)
        diff.forEach(function(part){
            if(part.added){
              //Se agrega esta part
            }
            if(part.deleted){
              //se quita esta parte
            }
            //Como se guardaria esto?
        });

        var sqlCommit = "INSERT INTO Repo_" + [repositorio] + "(commit, nameFile) VALUES (" + [md5(lastcommitid)] + ", "+ [fileName[i]] +")";
        var sql = "CREATE TABLE IF NOT EXISTS "+ [fileName[i]]+ "_"+ [repositorio] + "( nombre VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , datos VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , commit VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , idcommit VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , repositorio VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , PRIMARY KEY (nombre))";
        pool.query(sql);
        pool.query(sqlCommit);
        pool.query('INSERT INTO '+ [fileName[i]]+ "_"+ [repositorio] +' set ? ', fileContent[i]);  
      }
      res.send({status: "success", commiIDs: md5(lastcommitid)});
    }else{
      res.send({status:"rejected", reason : "Different Commit Version on Server" });
    }   
    lastcommitid++;
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

app.put('/rollback', function (req, res) {
  const{repositorio} = req.body.name;
  const{fileName} = req.body.file;
  const{commitID} = req.body.commitID; //Commit al cual volver
  
  //Se devuelve a la version de commit solicitada
  //res.send({file: file, fileContent:fileContent});

})



module.exports = router;