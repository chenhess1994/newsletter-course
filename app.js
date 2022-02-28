//jshint esversion: 6
const PORT = 3000;
//imports of libraries that i used.
const bodyParser= require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");
const { Console } = require("console");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

//send to the server the details and html file.
app.get("/", (req,res)=>{
   res.sendFile(__dirname+"/signup.html");
});

//get details from user and connect to newsletter.
app.post("/", function(req, res) {

  const listId = "2b2df7cc0e";

  const subscribingUser = {
    firstName: req.body.fname,
    lastName: req.body.lname,
    email: req.body.email
  };


  async function run() {

    const response = await mailchimp.lists.addListMember(listId,{
      
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });    
  };//run function

  try{
    run();
    res.sendFile(__dirname+"/sucess.html");
  }catch(e){
    res.sendFile(__dirname+"/failure.html");
  }

});//post
  
app.post("/failure",function(req,res){
  res.redirect("/");
});

app.post("/success",function(req,res){
  res.redirect("/");
});

//configuration to the api
mailchimp.setConfig({

apiKey: "04962c94419cf3dc73f0baf0a538abdf-us14",

server: "us14",

//app key
//04962c94419cf3dc73f0baf0a538abdf-us14

//List ID
//2b2df7cc0e
});

app.listen(process.env.PORT || PORT,()=>{
    console.log("server is running on port 3000");
});

