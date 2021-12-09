const MongoClient = require('mongodb').MongoClient;
const conn = "mongodb+srv://Connor:Newman258@cluster0.s9fc0.mongodb.net/?retryWrites=true&w=majority";
var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function (req, res) {
  file="Ticker.html";
  fs.readFile(file, async function(err, txt) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(txt);
    var qobj = url.parse(req.url, true).query;
  	var name = qobj.stock;
    var type = qobj.rad;
    var data = "";
    if (name != undefined && type != undefined)
    {
      await MongoClient.connect(conn, { useUnifiedTopology: true }, async function(err, db) {
        console.log("connected!");
        console.log(name);
        console.log(type);

        var dbo = db.db("HW14");
        var collection = dbo.collection('companies');

        //theQuery = {author:"Bob Smith"};
        theQuery="";
        if (type == "Ticker")
        {
          theQuery = {"symbol":name};
        }

        else
        {
          theQuery = {"name":name};
        }
        collection.find(theQuery).toArray(async function(err, items) {
          if (err) {
          console.log("Error: " + err);
          } 
          else 
          {
          console.log("Items: ");
          for (i=0; i<items.length; i++)
            res.write("Ticker: " + items[i].symbol + " Name: " + items[i].name + "<br>"); 
            //console.log(data);
            //res.write("<br>"+data);
          }   
          
          res.end();
        });
        
        //await db.close();
      });
    }
    
  });
}).listen(8080);
