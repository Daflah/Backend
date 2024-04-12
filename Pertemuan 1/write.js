var fs= require("fs");

console.log("Going to write into existing file");
fs.writeFile('input.txt','Asik Asik Ahe',function(err){
    if (err){
        return console.error(err);
    }
    console.log("Data written successfully");
    console.log("Lets read newly written data");

    fs.readFile('input.txt',function(err,data){
        if (err) {
            return console.error(err);
        }
        console.log("Asynchronous read:"+data.toString());
    });
});