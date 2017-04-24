
/* import the 'restify' module and create an instance. */
var restify = require('restify')
var server = restify.createServer()
var mongo = require('./lists.js')

/* import the required plugins to parse the body and auth header. */
server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

/* import our custom module. */
lists = require('./lists')

/* if we receive a GET request for the base URL redirect to /lists */
server.get('/', function(req, res, next) {
  res.redirect('/lists', next)
})

/* this route provides a URL for the 'lists' collection. It demonstrates how a single resource/collection can have multiple representations. */
server.get('/lists', function(req, res) {
  console.log('getting a list of all the lists')
  /* we will be including URLs to link to other routes so we need the name of the host. Notice also that we are using an 'immutable variable' (constant) to store the host string since the value won't change once assigned. The 'const' keyword is new to ECMA6 and is supported in NodeJS. */
  const host = req.headers.host
  console.log(host)
  /* creating some empty variables */
  var data, type
  /* is the client requesting xml data? The req.header object stores any headers passed in the request. The 'Accept' header lets the client express a preference for the format of the representation. Note you should always provide a sensible default. */
  if (req.header('Accept') === 'application/xml') {
    data = lists.getAllXML(host)
  } else {
    console.log('json requested')
    data = lists.getAll(host,function(data){
      console.log('data: '+data)
      res.setHeader('content-type', 'application/json')
      res.send(data.code, data.response)
      res.end()
    })
    
  }
  /* we need to set the content-type to match the data we are sending. We then send the response code and body. Finally we signal the end of the response. */
  
})

/* This route provides a URL for each list resource. It includes a parameter (indicated by a :). The string entered here is stored in the req.params object and can be used by the script. */
server.get('/lists/:listID', function(req, res) {
  console.log('getting a list based on its ID')
  /* Here we store the id we want to retrieve in an 'immutable variable'. */
  const listID = req.params.listID
  /* Notice that all the business logic is kept in the 'lists' module. This stops the route file from becoming cluttered and allows us to implement 'unit testing' (we cover this in a later topic) */
//   const data = lists.getByID(listID)
  users.getByID(username, function(data){
    res.setHeader('content-type', 'application/json')
    res.send(data.code, data.response)
    res.end()
  })
})

// Get user by user name and password
server.get('/lists/:username/:password', function(req, res) {
  console.log('getting a data based on its ID')
//   / Here we store the id we want to retrieve in an 'immutable variable'. /
  const username = req.params.username
  const password = req.params.password
//   / Notice that all the business logic is kept in the 'lists' module. This stops the route file from becoming cluttered and allows us to implement 'unit testing' (we cover this in a later topic) /
  lists.login(username, password, function(data){
    res.setHeader('content-type', 'application/json')
    res.send(data.code, data.response)
    res.end()
  })
})

/* This route points to the 'lists' collection. The POST method indicates that we indend to add a new resource to the collection. Any resource added to a collection using POST should be assigned a unique id by the server. This id should be returned in the response body. */
server.post('/users', function(req, res) {
  console.log('adding a new list')
  const body = req.body
  const auth = req.authorization
  lists.addNew(body, function(data){
      res.setHeader('content-type', 'application/json')
      res.send(data.code, data.response)
      res.end()
    })
})

server.post('/favorite', function(req, res) {
  console.log('adding a new list')
  const body = req.body
  const auth = req.authorization
  lists.addNewFav(body, function(data){
      res.setHeader('content-type', 'application/json')
      res.send(data.code, data.response)
      res.end()
    })
})

// Get user by user name and password
server.get('/favorite/:name', function(req, res) {
  console.log('getting a data based on its ID')
//   / Here we store the id we want to retrieve in an 'immutable variable'. /
  const name = req.params.name
//   / Notice that all the business logic is kept in the 'lists' module. This stops the route file from becoming cluttered and allows us to implement 'unit testing' (we cover this in a later topic) /
  lists.findList(name, function(data){
    res.setHeader('content-type', 'application/json')
    res.send(data.code, data.response)
    res.end()
  })
})


/* The PUT method is used to 'update' a named resource. This is not only used to update a named resource that already exists but is also used to create a NEW RESOURCE at the named URL. It's important that you understand how this differs from a POST request. */
server.put('/favorite/:name', function(req, res) {
  
  const body = req.body
  const name = req.params.name
  
  lists.update(name, body, function(data){
    res.setHeader('content-type', 'application/json')
    res.send(data.code, {status: data.status, message: 'this should update the specified resource'})
    res.end()
  })
})

/* The PUT method is used to 'update' a named resource. This is not only used to update a named resource that already exists but is also used to create a NEW RESOURCE at the named URL. It's important that you understand how this differs from a POST request. */
server.put('/favorites/:name', function(req, res) {
  
  const body = req.body
  const name = req.params.name
  
  lists.favoriteDel(name, body, function(data){
    res.setHeader('content-type', 'application/json')
    res.send(data.code, {status: data.status, message: 'this should update the specified resource Delete'})
    res.end()
  })
})


server.put('/history/:name', function(req, res) {
  
  const body = req.body
  const name = req.params.name
  
  lists.updateHistory(name, body, function(data){
    res.setHeader('content-type', 'application/json')
    res.send(data.code, {status: data.status, message: 'this should update the specified resource'})
    res.end()
  })
})

/* The PUT method is used to 'update' a named resource. This is not only used to update a named resource that already exists but is also used to create a NEW RESOURCE at the named URL. It's important that you understand how this differs from a POST request. */
server.put('/lists/:listID', function(req, res) {
  
  const body = req.body
  const auth = req.authorization
  const listID = req.params.listID
  
  lists.updata(auth, listID, body, function(data){
    res.setHeader('content-type', 'application/json')
    res.send(data.code, {status: data.status, message: 'this should update the specified resource'})
    res.end()
  })
})

/* The DELETE method removes the resource at the specified URL. */
server.del('/lists/:username/:password', function(req, res) {
  //   / Here we store the id we want to retrieve in an 'immutable variable'. /
  const username = req.params.username
  const password = req.params.password
  lists.userDelete(username, password, function(data){
    res.setHeader('content-type', 'application/json')
    res.send(data.code, {status: data.status, message: 'this should delete the specified resource'})
    res.end()
  })         
})

var port = process.env.PORT || 8080;
server.listen(port, function (err) {
  if (err) {
      console.error(err);
  } else {
    console.log('App is ready at : ' + port);
  }
})




