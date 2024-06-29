const http=require("http");
const fs=require("fs");
var requests=require("requests");
const homeFile=fs.readFileSync("index.html","utf-8");
const replaceVal=(tempVal,orgVal)=>{
 let temperature=tempVal.replace("{%tempval%}",((orgVal.main.temp)-(273.15)).toFixed(2));
  temperature=temperature.replace("{%tempmin%}",((orgVal.main.temp_min)-(273.15)).toFixed(2));
  temperature=temperature.replace("{%tempmax%}",((orgVal.main.temp_max)-(273.15)).toFixed(2));
  temperature=temperature.replace("{%location%}",orgVal.name);
  temperature=temperature.replace("{%country%}",orgVal.sys.country);
  temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
   return temperature;
}
const server=http.createServer((req,res)=>{
    if(req.url="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=2529b7bd5f34757d6974eebf5660a9b9")
        .on("data",(chunk)=>{
            // convert json into object data
            const objdata=JSON.parse(chunk);
            // convert object data into array data
            const arrData=[objdata];
        //   console.log(arrData[0].main.temp);
            const realTimeData=arrData.map((val)=>
             replaceVal(homeFile,val)).join("");
             res.write(realTimeData);
           
        })
        .on("end",(err)=>{
            if(err) return console.log("connection closed due to errors",err);
            res.end();
        });
    }
});
server.listen(8000,"127.0.0.1");