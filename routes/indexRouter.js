'use strict';

const express = require('express');
const router = express.Router();
// router.get('/createTables',(req,res)=>{
//     let models = require('../models');
//     models.sequelize.sync().then(()=>{
//         res.send("bảng đã dc tạo xong");
//     })
// })
const controller = require('../controllers/indexController');
router.get('/',controller.showHomePage);
router.get('/:page',controller.showPage);
// router.get('/:page',(req,res)=>{
//     res.render(req.params.page);
// })
// router.get('/',(req,res)=>{
//     res.render('index');
// })



// app.get('/',(req,res)=>{
//     res.send("hello world");
// });

module.exports = router;