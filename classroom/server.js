const express = require("express");
const app = express();
const session = require("express-session");

const sessionOptions = {
    secret :"mysupersecretstring",
    resave : false,
    saveUninitialized :true,
};

app.use(session(sessionOptions));

app.get("/reqcount" , (req , res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`You have sent a request ${req .sesssion.count} times`);
})