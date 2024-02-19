const express=require('express')
const app=express();
const puppeteer = require('puppeteer');
const port=process.env.PORT||3000;
const cors=require('cors')
const {getProduct } = require('./controllers/getProduct.js');
app.use(cors({
    origin:5500,
}))
app.get('/search',getProduct);
app.listen(port,()=>{
    console.log(`App listening on port :${port}`)
})

