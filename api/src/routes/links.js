const express = require('express');
const router = express.Router();
var  jsdiff = require('diff');
var md5 = require('md5');
let lastcommitid = 0;
let indice = 0;
const pool = require('../database');

const compressor = require('../compressor.js');


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


router.get('/get', (req, res) => {
    const { repositorio } = req.body;
    const { file } = req.body;
     pool.query("SELECT newLinesAt, deletedLinesAt, newLines, arbol  FROM "+[file]+"_"+[repositorio]+' ORDER BY indice ASC' , (err, rows) => {
        if (!err) {
          //res.json(rows);
          console.log([file]);
          console.log(rows);
          var data = getFromHistory(rows);
          res.send(data);

        } else {
          res.send("Error");
        }
    });
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.post('/init',  (req, res) => {
    const {name} = req.body;
    console.log(req.body);
    var tablaRepositorio = "CREATE TABLE IF NOT EXISTS Repo_"+ [name] + "( lastcommit VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , nameFile VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , PRIMARY KEY (nameFile))";
     pool.query(tablaRepositorio);
     pool.query("INSERT INTO Repositorio (name) VALUES ('" + [name]+"')").then(res.send({status: "success"})).catch(error => res.send("Error"));
    });

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.post('/commit',  (req, res) => {
    const {name} = req.body;
    const {message} = req.body;
    const {files} = req.body; //Es un array
    const {fileContent} = req.body;//Es un array
    const {commitID} = req.body;
    var commitClient = [commitID];
    var commitServer;


      
      
    pool.query('SELECT * FROM Repo_' + [name],  (err, rows) => {

        if (rows.length == 0){
          commitServer = [""];
        }else{
          var {lastcommit} = rows[0];
          commitServer = [lastcommit]; 
        }

        if(lastcommitid == 0 && commitServer[0] != ""){
          while(commitServer[0] != md5(lastcommitid)){
            lastcommitid++;
          }
          
        }
        
  
  
          if ( commitClient[0] == commitServer[0] ){
            
            pool.query("TRUNCATE  Repo_"+[name]);
            for(var i=0; i<files.length;i++){

              var sql = "CREATE TABLE IF NOT EXISTS "+ [files[i]]+ "_"+ [name] + "(indice VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL, files VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL, arbol VARCHAR(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , newLinesAt VARCHAR(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , deletedLinesAt VARCHAR(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL, newLines VARCHAR(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,message VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , commitID VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , name VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , PRIMARY KEY (commitID))";
              pool.query(sql);
              

              pool.query("SELECT newLinesAt, deletedLinesAt, newLines, arbol, indice  FROM "+[files[i]]+"_"+[name]+' ORDER BY indice ASC' , (err,rows) => {
                
                tam = rows.length;
                if(tam != 0){
                  indice = parseInt(rows[tam-1].indice) + 1;
                }

                i--;
                lastcommitid--;
                console.log(i);
                var newLinesAt = [];
                var deletedLinesAt = [];
                var newLines = [];
                var newStringArray = (fileContent[i]);
                var oldStringArray = getFromHistory(rows);
                var h;
    
                for (h = 0; h < oldStringArray.length; h++) {
                    if (h < newStringArray.length) {
                        if (oldStringArray[h] != newStringArray[h]) {
                            newLinesAt.push(h);
                            newLines.push(newStringArray[h])
                        }
                    } else {
                        deletedLinesAt.push(h);
                    }
                }
    
                while (h < newStringArray.length) {
                    newLinesAt.push(h);
                    newLines.push(newStringArray[h])
                    h++
                }
                console.log(newLines.join(""));

                
                
                var { freqTable, encoded } = compressor.encode(newLines.join(""));
                
                if(freqTable == undefined){
                  freqTable = "";
                  encoded = "";
                }
    
                var sqlCommit = "INSERT INTO Repo_" + [name] + "(lastcommit, nameFile) VALUES ('" + md5(lastcommitid) + "', '"+ files[i] +"')";
                pool.query(sqlCommit);
                var data = "INSERT INTO "+ [files[i]]+ "_"+ [name] +" (indice, files, newLinesAt, deletedLinesAt, newLines, message, commitID, name, arbol) VALUES ('"+indice+"','"+ files[i] +"','"+newLinesAt+"','"+deletedLinesAt+"','"+encoded+"','"+[message]+"','"+md5(lastcommitid)+"','"+[name]+"','"+JSON.stringify(freqTable)+"')";
                pool.query(data); 
            
                lastcommitid++;
              }); 
            }
            res.send({status: "success", commiIDs: md5(lastcommitid)});
      
          }else{
            res.send({status:"rejected", reason : "Different Commit Version on Server" });
          }   
          lastcommitid++;
          //indice++;

      });

      
    

    
     
    
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/reset', (req, res) => {
  const { repositorio } = req.body;
    const { file } = req.body;
     pool.query("SELECT newLinesAt, deletedLinesAt, newLines  FROM "+[file]+"_"+[repositorio]+' ORDER BY indice ASC' , (err, rows) => {
        if (!err) {          
          var data = getFromHistory(rows);
          res.send(data);
        } else {
          res.send("Error");
        }
    });

})

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/sync', (req, res) => {
  const { repositorio } = req.body;
  const { file } = req.body;
   pool.query("SELECT newLinesAt, deletedLinesAt, newLines  FROM "+[file]+"_"+[repositorio]+' ORDER BY indice ASC' , (err, rows) => {
      if (!err) {          
        var data = getFromHistory(rows);
        res.send(data);
      } else {
        res.send("Error");
      }
  });
})

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/status', (req, res) => {
  const {repositorio} = req.body;
  const {file} = req.body;
  if([file]==""){
    
    pool.query('SELECT nameFile FROM Repo_'+[repositorio], (err, rows) => {
      if (!err) {
        var arrayData = [];

        res.json(rows);
      } else {
        res.send("Error");
      }
    });
  }else{

    pool.query("SELECT message, commitID  FROM "+ [file] +"_"+ [repositorio], (err, rows) => {
      if (!err) {
        res.json(rows);
      } else {
        res.send({err});
      }
    });

  }
})

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/rollback',  (req, res) => {
  const{name} = req.body;
  const{file} = req.body;
  const{commitID} = req.body; 

  pool.query("SELECT newLinesAt, deletedLinesAt, newLines, arbol, commitID  FROM "+[file]+"_"+[name]+' ORDER BY indice ASC' , (err, rows) => {
    if (!err) {  
      var dataCommit = [];
      var i = 0;
      while(rows[i].commitID != [commitID]){
        dataCommit.push(rows[i])
        i++;
      }
      dataCommit.push(rows[i]);
      var data = getFromHistory(dataCommit);
      res.send(data);
    } else {
      res.send("Error");
    }
});
  


})

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//Funcion para obtener el commit actual basado en el historial de commits
//Se espera un array de json 
function getFromHistory(commitHistory) {
  var finalText = [];
  for (i in commitHistory) {

      //Array con los indices de las nuevas lineas
      var newLinesAt = commitHistory[i].newLinesAt.split(",");
      //Array con los indices de las lineas eliminadas
      var deletedLinesAt = commitHistory[i].deletedLinesAt.split(",");
      //Array con las nuevas lineas
      var newlines = commitHistory[i].newLines;

      var arbol = commitHistory[i].arbol;

      if(newlines != ""){
        newlines = Array.from(compressor.decode(arbol+"\n"+newlines));
      }




      //Se agregan las nuevas lineas
      for (j in newlines) {
        if(newLinesAt[0] != ""){
          finalText[newLinesAt[j]] = newlines[j];
        }
      }

      //Se eliminan las lineas eliminadas
      for (j in deletedLinesAt) {
        if(deletedLinesAt[0] != ""){
          finalText.pop();
        }
      }

  }
  return finalText.join("");
}







module.exports = router;