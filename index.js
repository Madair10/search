var express = require('express');
var app = express();
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

var cors = require('cors')

var app = express()
app.use(cors())

const search = function search(index, body) {
  return esClient.search({index: index, body: body});
};

// only for testing purposes
// all calls should be initiated through the module

app.get('/', function(req, res){
    let body = {
        size: 1,
        from: 0,
        query: {
          multi_match: {
            query: req.query.search,
            fields: ['title', 'authors.*name'],
            minimum_should_match: 3,
            fuzziness: 2
          }
        }
      };
    
      search('library', body)
      .then(results => {
        res.json(results.hits.hits);
      })
      .catch(console.error);
});

app.listen(3000);
