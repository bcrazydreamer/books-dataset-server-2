const mongoose = require("mongoose");
const Book = require("../model/books.model");
const config    = require("../utils/config");
const mongo_url = "mongodb://"+config.user+":"+config.pwd+"@ds335648.mlab.com:35648/books";

connectDb();
function connectDb(){
    mongoose.connect(mongo_url,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },(err)=>{
        if(err){
            return console.error(err);
        }
    });
}
//On connect
mongoose.connection.on('connected', function () {
    var msg = 'Mongo connected with '+mongo_url;
    console.log(msg);
    return startProcess();
});

//On error
mongoose.connection.on('error',function (err) {
    console.log('Error occur in mongo ',err);
    return process.exit(0);
});

//On disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongo connection disconnected');
    return process.exit(0);
});



async function startProcess(){
    try{
        var books = await Book.find({},{pages : 1});
    }catch(err){
        console.log(err);
        return process.exit(0);
    }
    for(var i = 0 ; i < books.length ; i++){
        console.log("Left--->",books.length - i);
        var page = null;
        if(books[i].pages){
            try{
                page = books[i].pages.replace(/\D/g,"");
            } catch(err){page = null}
        }
        var update = await Book.updateOne({_id : books[i]._id},{$set : {pages : page}});
    }   
}