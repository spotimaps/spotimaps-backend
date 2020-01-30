const express = require('express');
const request = require('request');
const app = express();
require('dotenv').config()

const {CLIENT_SECRET, CLIENT_ID, REDIRECT_URI} = process.env

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/login', function (req, res) {
    let url = `https://spotimaps.github.io/spotimaps/`;
    var state = generateRandomString(5);
    let scope = 'user-read-currently-playing';
    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${encodeURI(url)}&state=${state}`);
})
app.get('/token', function (req, res) {
    let code = req.query.code;
    request({
        'method': 'POST',
        'url': 'https://accounts.spotify.com/api/token',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic NTJhNjQxYzk1NDk5NDExYWFiMDY3NTg0Y2M3MjlmYjc6ZDEyM2U4ODg2MmVhNDEyOGI0M2JhNGM3ZjNmYTRjZDg='
        },form: {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': 'https://spotimaps.github.io/spotimaps/'
        }
        }, function (error, response) { 
        if (error) throw new Error(error);
        res.send(response.body);
    });

})
  
app.listen(8080);