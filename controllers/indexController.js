'use strict';
const controller = {}; 
const models = require('../models');

controller.showHomePage = async (req,res)=>{
    const categories = await models.Category.findAll();
    const secondArray =categories.splice(2,2);
    const thirdArray =categories.splice(1,1);
    res.locals.categoryArray = [categories,secondArray,thirdArray]

    const featureProduct =await models.Product.findAll({
        attributes: ['id','name','imagePath','price','oldPrice','price','stars'],
        order: [['stars','DESC']],
        limit:10
    })
    res.locals.featureProduct = featureProduct;

    const recentProduct = await models.Product.findAll({
        attributes: ['id','name','imagePath','price','oldPrice','price','stars'],
        order: [['createdAt','DESC']],
        limit:10
    })
    res.locals.recentProduct =recentProduct ;

    const Brand = models.Brand;
    const brands = await Brand.findAll();
    res.locals.brands = brands;

    res.render('index');
}
controller.showPage = (req,res,next)=>{
    const pages = ['cart','checkout','contact','login','my-account','product-detail',
    'product-list','wistlist'];
    if(pages.includes(req.params.page))
    {
        res.render(req.params.page);
    }
    else
    {
        next();
    }
}
module.exports = controller;