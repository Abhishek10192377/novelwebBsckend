const express = require('express');
const Novelrouter = express.Router();

const { novelInsert, novelRead, readAllNovels , novelUpdate , novelDelete} = require('../Controller/Novelcontroller');


Novelrouter.delete('/novels/delete/:id', novelDelete);
Novelrouter.put('/novels/update/:id', novelUpdate);
Novelrouter.post('/novels/insert', novelInsert);
Novelrouter.get('/novels/read/:id', novelRead);
Novelrouter.get('/novels', readAllNovels);

module.exports = Novelrouter;
