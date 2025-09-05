const express = require("express");
const session = require("express-session");
const app = express();

const sessionOption ={
    secret:"mySecret",
    resave:false,
    saveUninitialized:true, 
}

app.use(session(sessionOption));

app.get("/register",(req, res)=>{
    let {name} = req.query;
    req.session.name = name;
    res.send(`user is registered with name ${name}`);
});

app.get("/login",(req, res)=>{
    let name = req.session.name;
    if(name){
        res.send(`user is logged in with name ${name}`);
    }else{
        res.send("user is not logged in");
    }
});


app.listen(3000,()=>{
    console.log("server listning on the port no 3000");
});

