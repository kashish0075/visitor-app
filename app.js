const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const fast2sms = require('fast-two-sms');
const currentDay = require(__dirname+"/models/day.js");
const currentTime = require(__dirname+"/models/time.js");

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Kashish:creaters123@cluster0.psbwz.mongodb.net/visitordb")
.then(() => console.log("DBConnected"))
.catch((err) => console.log(err));



const visitorSchema = new mongoose.Schema({
       name: {
           type: String,
           required: true
       },
       number: {
           type: String,
           min: 10,
           required: true,
       },
       email: {
        type: String,
        required: true,
        trim: true
      },
      isAvailable: {
          type: Boolean,
          required: true,
      },
      entryTime:{
          type: String,
      },
      exitTime:{
          type: String,
      },
      day: {
          type: String,
      }
 }, { collection: 'Visitor' });


 const Visitor = mongoose.model('Visitor', visitorSchema);



app.get("/", function(req,res){
    res.render("home");
});

app.post("/", function(req,res){
    let route = req.body.route;
    var num = req.body.number;
    if(route === "info"){
        Visitor.find({number: num},function(err,docs){
            if(docs.length){
                Visitor.findOne({number: num}, function(err,visitor){
                let check = "";
                if(visitor.isAvailable)
                 check = "Inside";
                else
                  check = "Outside";

                res.render("info",{Name: visitor.name,Email: visitor.email,Number: visitor.number,Day: visitor.day,Check: check,Entry: visitor.entryTime, Exit: visitor.exitTime});
             });
            }else{
                res.redirect('/error');
            }
    });
    }else{
        res.redirect(`/${route}`);
    }
});

app.get('/entry', function(req,res){

    res.render("entry");
    
});

app.post('/entry', function(req,res){

    let Name = req.body.Name;
    let Number = req.body.Number;
    let Email = req.body.Email;

    let message = `You checked-in the campus at ${currentTime()} on ${currentDay()}.\n\nfrom: Chitkara University`;
     

   Visitor.find({number: Number}, function(err,docs){
    if(docs.length){
        Visitor.updateOne({number:Number},{entryTime: currentTime(),isAvailable:true,day: currentDay()},function(err){
            console.log(err);
        });
      }else{
        const visitor1 = new Visitor({
            name: Name,
            number: Number,
            email: Email,
            isAvailable: true,
            entryTime: currentTime(),
            day: currentDay(),
        });
       
        visitor1.save();
      }
   });

    let options = {
        authorization: process.env.API_KEY,
        message: message,
        numbers: [Number],
    }

    fast2sms.sendMessage(options);

    res.redirect("/");
});


app.get("/exit", function(req,res){
   res.render("exit");
});

app.post("/exit", function(req,res){
    let Name = req.body.Name;
    let Number = req.body.Number;
    
    Visitor.find({number: Number},function(err,docs){
        if(docs.length){
            Visitor.updateOne({number: Number},{exitTime: currentTime(),isAvailable: false,day: currentDay(),},function(err){
                let message = `You checked-out  the campus at ${currentTime()} on ${currentDay()}.\n\nfrom: Chitkara University`;

                let options = {
                    authorization: process.env.API_KEY,
                    message: message,
                    numbers: [Number],
                }
            
                fast2sms.sendMessage(options);
            
                res.redirect("/");
            });
        }else{
            res.redirect('/error');
        }
    });
  
});

app.post('/info', function(req,res){
    res.redirect('/');
});

app.get('/error', function(req,res){
   res.render("error");
});

app.listen(3000, function(){
    console.log('listening');
});

