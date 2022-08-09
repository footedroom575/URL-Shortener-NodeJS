
require('dotenv').config();
const express = require('express');
const cors = require('cors');
let bodyParser = require("body-parser")
const app = express();

function URL(original, short){
  this.short_url = short
  this.original_url = original
}

let list_urls = []

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended : false}))
app.use(function(req, res, next){
  console.log(req.method, req.path, req.body, req.params)
  next()
})


function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result+Date.now();
}

app.get("/api/shorturl/:url", (req, res)=>{
  let shortened = req.params.url
  let original = list_urls.filter((val)=>{
    return val.short_url == shortened
  })

  console.log({short_url: shortened, original_url: original[0].original_url}, "--- checking")

  if (!shortened || !original){
    res.json({ error: 'invalid url' })
  } else {
    res.redirect(original[0].original_url)
  }

})

app.post("/api/shorturl/", (req, res)=>{
  let shortened = makeid(5)
  let original = req.body.url

  const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if (!urlPattern.test(original)){
    res.json({ "error": 'invalid url' })
  } else {
    
    let url = new URL(original, shortened)
    list_urls.push(url)
  
    res.json({short_url: url.short_url, original_url: original})
  }

})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
