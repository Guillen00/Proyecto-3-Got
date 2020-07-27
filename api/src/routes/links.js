const express = require('express');

const router = express.Router();

const pool = require('../database');

router.get('/get', (req, res) => {
    const { id } = req.body;
     pool.query('SELECT * FROM Repositorio WHERE ID = ? ', [id], (err, rows) => {
        if (!err) {
        
          res.json(rows[0]);
        } else {
          res.send("Error");
        }
    });
  
});

router.post('/init', async (req, res) => {
    const {id} = req.body;
    var tablaRepositorio = "CREATE TABLE IF NOT EXISTS Repo_"+ [id] + "( lastcommit VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , nameFile VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , PRIMARY KEY (nameFile))";
    pool.query(tablaRepositorio);
    await pool.query('INSERT INTO Repositorio set ? ', req.body).then(res.send("Agregado")).catch(error => res.send("Error"));
    
});

router.post('/commit',  (req, res) => {
    const {nombre} = req.body;
    const {datos} = req.body;
    const {commit} = req.body;
    const {idcommit} = req.body;
    const {repositorio} = req.body;
    var verificarCommit;
    var lastcommit = "Ultimo";

    pool.query('SELECT * FROM Repo_' + [repositorio], (err, rows) => {
      if (!err) {
        verificarCommit = rows[0];
        lastcommit = verificarCommit.commit;
      } 
  });
    
    if (lastcommit == [commit]){

      var sqlCommit = "INSERT INTO Repo_" + [repositorio] + "(commit, nameFile) VALUES (" + [commit] + ", "+ [nombre] +")";
      var sql = "CREATE TABLE IF NOT EXISTS "+ [nombre]+ "_"+ [repositorio] + "( nombre VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , datos VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , commit VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , idcommit VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , repositorio VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL , PRIMARY KEY (nombre))";
      pool.query(sql);
      pool.query(sqlCommit);
      pool.query('INSERT INTO '+ [nombre]+ "_"+ [repositorio] +' set ? ', req.body).then(res.send("Agregado")).catch(error => res.send({error}));

    }
    
    
});

router.get('/status', (req, res) => {
  const {repositorio} = req.body;
  pool.query('SELECT * FROM Repo_'+[repositorio], (err, rows) => {
    if (!err) {
      res.json(rows);
    } else {
      res.send("Error");
    }
});
})





module.exports = router;