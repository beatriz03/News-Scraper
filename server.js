const cheerio = require('cheerio');
const axios = require('axios');
const logger = require("morgan");
const mongoose = require('mongoose');
const express = require('express');

const app = express();
var db = require('./models'); 

var PORT = process.env.PORT || 8000;

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI)


app.get('/scrape', function(req, res) {
    $(document).on('click', '#scrapeButton', function(){

    axios.get('https://www.bbc.com/news').then(function(response) {

        var $ = cheerio.load(response.data);

        $('').each(function(i, element) {
            var result = {};

            result.title = $(this).text();
            result.link = $(this).attr('href');
            result.summary =  $(this).attr('.nw-c-promo-summary');


            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
        }).catch(function(err) {
            console.log(err);
        });
    });
    res.send('Scrape Complete');
})
});



app.get('/articles', function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});


app.get('/articles/:id', function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate('note')
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});


app.post('/articles/:id', function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id}, {new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});



app.listen(PORT, function () {
    console.log('App running on port ' + PORT);
});