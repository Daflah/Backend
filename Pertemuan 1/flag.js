var fs = require("fs");

//Asynchrons - opening file
console.log("Going to  open file!");
fs.open('input.txt','r+',function(err,fd){
    if(err){
        return console.error(err);
    }
    console.log("file opened successfully!");
});