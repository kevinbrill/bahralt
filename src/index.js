var route = require('koa-route');
var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var mongo = require('co-mongo');

var app = koa();

function *priceByItem(id) {
    var db = yield mongo.connect("mongodb://127.0.0.1:27017/bahralt");
    var collection = yield db.collection('prices');

    var docs = yield collection.find( {'id' : id }).toArray();

    this.body = docs;

    yield db.close();
}

function *priceByItemByShard(id, shard) {

    var db = yield mongo.connect("mongodb://127.0.0.1:27017/bahralt");
    var collection = yield db.collection('prices');

    var docs = yield collection.find( {'id' : id, 'shards.name': shard }).toArray();

    this.body = docs;

    yield db.close();

}

function *upload() {
    console.log(this.request);
    this.body = { status: 'upload' };
}

app.use(bodyParser());
app.use(route.get('/api/v1/item/:id', priceByItem));
app.use(route.get('/api/v1/item/:id/shards/:shard', priceByItemByShard));
app.use(route.post('/api/v1/upload', upload));

var server = app.listen(3000);