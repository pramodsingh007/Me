const express = require("express");
const request = require("request");
const ejs = require("ejs");
// const jsdom = require("jsdom")
// const jquery = require("jquery")("dom.window")

// const dom = new jsdom.JSDOM("")
const app = express();
const bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// const key = "feb210bb46msh61ab2b263b5bacap1ee6ffjsn574f04514ee3";
const key = "bbabb397e6msh7c46733f774de85p189212jsnae908d7bdc37";
const host = "youtube-search-results.p.rapidapi.com";

let mydata = [];

 function fechData(query) {
  const options = {
    method: "GET",
    url: "https://youtube-search-results.p.rapidapi.com/youtube-search/",
    qs: { q:query},
    headers: {
      "content-type": "application/octet-stream",
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host,
    },
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    const results = JSON.parse(body).items;
    for (var x in results) {
      try {
        const url = results[x].url.replace('watch?v=','embed/');
        const title = results[x].title;
        const bestThumbnail = results[x].bestThumbnail.url;
        const channelName = results[x].author.name;
        const description = results[x].description;
        const views = results[x].views;
        const duration = results[x].duration;
        const uploadedAt = results[x].uploadedAt;
        const bestAvatar = results[x].author.bestAvatar.url

        const searches = {
          title: title,
          url: url,
          bestThumbnail: bestThumbnail,
          channelName: channelName,
          description: description,
          views: views,
          duration: duration,
          uploadedAt: uploadedAt,
          avatar:bestAvatar
        };
        mydata.push(searches);
      } catch {
        console.log("not found");
      }
    }
  });
}

app.get("/", (req, res) => {
        fechData("tranding")
        let waitForSec = new Promise((resolve,reject)=>{
          setTimeout(resolve,3000)
        })
        waitForSec.then(()=>{
          res.render("index.ejs", { results: mydata });

        })
    })


app.post("/", (req, res) => {
  mydata = [];
  const query = req.body.searchbar.replaceAll(" ", "+");
    fechData(query)
    res.redirect("/result");;
});


app.get("/result",(req,res)=>{
  let waitForSec = new Promise((resolve,reject)=>{
    setTimeout(resolve,3000)
  })

  waitForSec.then(()=>{
   
    res.render('index.ejs',{results:mydata})
  })
})

app.get("/result/:query",(req,res)=>{
  mydata = []
  const q = req.params.query
  fechData(q)
  let waitForSec = new Promise((resolve,reject)=>{
    setTimeout(resolve,3000)
  })
  waitForSec.then(()=>{
   
    
    res.render('index.ejs',{results:mydata})
  })
})



app.listen(4000);
