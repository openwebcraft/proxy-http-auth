require('dotenv').load();

var http = require('http'),
    httpProxy = require('http-proxy'),
    connect = require('connect'),
    auth = require('basic-auth');

// Config
var username = process.env.HTTP_BASIC_AUTH_USERNAME || 'Bob',
    password = process.env.HTTP_BASIC_AUTH_PASSWORD || 'Secret',
    realm    = process.env.HTTP_BASIC_AUTH_REALM || 'Secret Resource',
    port     = process.env.PORT || 1338,
    proxyUrl = process.env.PROXY_URL || 'http://example.com:80';
    
// Basic Connect App
var app = connect();

// respond to all requests
app.use(function(req, res, next){
  var credentials = auth(req);

  if (!credentials || credentials.name !== username || credentials.pass !== password) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="'+realm+'"'
    })
    res.end("Access denied!");
  } else {
    next();
  }
});

// now requests to '/x/y/z' are proxied to 'https://example.com:80/x/y/z' 
app.use('/', function (req, res) {
    proxy.web(req, res);
  }
);

// Basic Http Proxy Server
var proxy = httpProxy.createProxyServer({
  target: proxyUrl
});

//create Node.js http server and listen on port
http.createServer(app).listen(port)

console.log("Proxy Server listening on port "+port);