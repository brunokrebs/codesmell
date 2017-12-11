// require express, body-parser and shortid
// we could use es6 import here, but if we stick to the old style require syntax here it serves two purposes
// 1. there's no need to transpile our main.js before serving it up
// 2. it helps us see at a glance that we're dealing with server side vs client side
const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');

// instantiate express
const app = express();

// create an array of stories and populate it with a few examples
let stories = [
  { id: 'hwX6aOr7', user: 'joe', posted: '2017-10-05 22:00:00', title: 'ThinkPad Anniversary Edition 25: Limited Edition ThinkPad Goes Retro', text: 'As part of its celebration of the 25th anniversary of the ThinkPad lineup, Lenovo is launching a limited-edition ThinkPad Anniversary Edition 25. It feels like Lenovo might have an issue with this though, because ThinkPad loyalists are all going to want one of these exclusive devices. It features a retro look, along with some of the retro capabilities that ThinkPad has always been known for, but all built on a modern version of the device.' },
  { id: 'nYrnfYEv', user: 'donna', posted: '2017-10-05 19:00:00', title: 'Japanese Vending Machines at Night Juxtaposed with a Wintry Hokkaido Landscape', url: 'http://www.spoon-tamago.com/2017/10/04/japanese-vending-machines-at-night-juxtaposed-with-a-wintry-hokkaido-landscape/' }
];

// create an array of comments and add some sample data
// note: each comment has a storyId of one of the stories above!
let comments = [
  { id: 'a4vhAoFG', storyId: 'hwX6aOr7', posted: '2017-10-05 22:11:00', user: 'podge', text: 'Someone please bring back 14" Laptops with 4:3 screens!' },
  { id: '2WEKaVNO', storyId: 'nYrnfYEv', posted: '2017-10-05 19:19:00', user: 'rodge', text: 'Getting a hot chocolate out of a vending machine while the sky is dumping snow is one of life\'s many sublime pleasures.' }
];

// configure express to use body-parser as middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// allow static files in the 'dist' folder to be served
app.use(express.static(__dirname + '/../dist'));

// load our main app
app.get('/', function (req, res) {
  res.sendfile('../dist/index.html')
});

// GET a list of stories
app.get('/stories', function (req, res) {
  // return the array of stories
  res.send(stories)
});

// GET a single story by storyId
app.get('/stories/:storyId', function (req, res) {
  // in a real-world app you'd need to have some proper error handling in here,
  // but this will do us for now
  let storyId = req.params.storyId;
  // filter story by given storyId
  let story = stories.filter(x => { return x.id === storyId })[0];
  // get comments for this story
  story.comments = comments.filter(x => { return x.storyId === storyId });
  // return story
  res.send(story)
});

// POST a new comment to a given story
app.post('/stories/:storyId/comments', function (req, res) {
  // get vars from params / body
  let storyId = req.params.storyId;
  let text = req.body.text;
  let user = req.body.user;
  // create comment object
  let comment = {
    id: shortid.generate(),
    posted: new Date().toISOString(),
    storyId,
    text,
    user
  };
  // push it to the comments array
  comments.push(comment);
  // get story
  let story = stories.filter(x => { return x.id === storyId })[0];
  // get comments
  story.comments = comments.filter(x => { return x.storyId === storyId });
  // return relevant story
  res.send(story)
});

// POST a new story
app.post('/stories', function (req, res) {
  // get vars from body
  let title = req.body.title;
  let url = req.body.url;
  let text = req.body.text;
  let user = req.body.user;
  // create story object
  let story = {
    id: shortid.generate(),
    posted: new Date().toISOString(),
    title,
    text,
    url,
    user
  };
  // push it to the stories array
  stories.push(story);
  // return created story
  res.send(story)
});

let port = process.env.port || process.env.PORT || 3335;
app.listen(port, function () {
  console.log(`codesmell is now running on port ${port}`)
});
