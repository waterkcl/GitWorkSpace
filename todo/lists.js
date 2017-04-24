
var rand = require('csprng')
var builder = require('xmlbuilder')
var mongo = require('./schema.js')

var lists = []

// Check Json format
function validateJson(json) {
  if (typeof json.name !== 'string') {
    console.log('name not a string')
    return false
  }
  if (typeof json.password !== 'string') {
    console.log('password not a string')
  return false
  }
  return true
}



/* This public property contains a function that is passed a resource id and returns the associated list. */
exports.getByID = function(listID) {
  console.log('getById: '+listID)
  /* Here we loop through the lists. If we find one that matches the supplied id it is returned. */
  for(var i=0; i < lists.length; i++) {
    console.log(lists)
    if (lists[i].id === listID) {
      /* Note that every public method in this module returns an object with the same properties. This consistency makes the routes file simpler. */
      return {code:200, response:{status:'success', contentType:'application/json', message:'list found', data: lists[i]}}
    }
  }
  /* If there are no matching lists a 'resource not found' error is returned. */
  return {code:406, response:{status:'error', contentType:'application/json', message:'list not found', data: listID}}
}

exports.getAll = function(host, callback) {
  
  console.log('getAll')
  mongo.weatherList.find(function(err, data) {
    console.log('mongo list')
    if (err) {
      console.log('err: '+err)
        callback({code:400, contentType:'application/json', response:{status:'error', message:'lists found', data: err}})
    }
    console.log('getAll data: '+data)
        callback({code:200, contentType:'application/json', response:{status:'success', message:'lists found', data: data}})
  })
  
}

// This public property contains a function that is passed a resource id and returns the associated list.
exports.login = function(username, password, callback) {
  console.log('getUserByName: '+username)
//    Here we loop through the lists. If we find one that matches the supplied id it is returned. /
  mongo.User.find({ 'name': username ,'password': password }, function (err, users) {
  if (err) {
    callback( {code:406, response:{status:'error', contentType:'application/json', message:'user not found', data: username}})
  }
    callback ({code:200, response:{status:'success', contentType:'application/json', message:'user found', data: users}})
  })
}

/* This is a sister property to 'getAll' but returns an XML representation instead. */
exports.getAllXML = function(host) {
  console.log('getAllXML')
  /* Here the xmlbuilder module is used to construct an XML document. */
  var xml = builder.create('root', {version: '1.0', encoding: 'UTF-8', standalone: true})
  /* If there are no lists in the array we build a single message node. */
  if (lists.length === 0) {
    xml.ele('message', {status: 'error'}, 'no lists found')
  } else {
    /* If there are lists we build a different message node. */
    xml.ele('message', {status: 'success'}, 'lists found')
    /* Then we create a 'lists' node which will be used to contain each list node. */
    var xmlLists = xml.ele('lists', {count: lists.length})
    /* We now loop through the lists, create a list node for each and add the details. */
    for(var i=0; i < lists.length; i++) {
      var list = xmlLists.ele('list', {id: lists[i].id})
      list.ele('name', lists[i].name)
      list.ele('link', {href:'http://'+host+'/lists/'+lists[i].id})
    }
  }
  /* Once the XML document is complete we call 'end()' to turn it into an XML string. */
  xml.end({pretty: true})
  /* There is a logical error in this code, can you spot it? */
  return {code: 200, contentType:'application/xml', response: xml}
}

exports.addNew = function(body, callback) {
  console.log('register body:'+body)
//   The second parameter contains the request body as a 'string'. We need to turn this into a JavaScript object then pass it to a function to check its structure. /
  var json = body
  const valid = validateJson(json)
   if(typeof body == "object"){
    json = body
  }else{
    json = JSON.parse(body)
  }
  
//   If the 'validateJson()' function returns 'false' we need to return an error. /
  console.log('register fuck:'+ json)
  var newUser = new mongo.User({name: json.name, password: json.password});
  newUser.save(function(err) {
    if (err) {
      console.log('err: '+err)
        callback({code:400, contentType:'application/json', response:{status:'error', message:'datas added fail'}})
    }
    console.log('add data: '+newUser)
        callback({code:200, contentType:'application/json', response:{status:'success', message:'datas added sucess'}})
  })
}

exports.userDelete = function(username, password, callback){
//   Delete user by user name and passwords
  mongo.User.remove({ 'name': username ,'password': password },function(err) {
    if (err) {
      console.log('err: '+err)
        callback({code:400, contentType:'application/json', response:{status:'error', message:'datas added fail'}})
    }
    console.log('add data: ')
        callback({code:200, contentType:'application/json', response:{status:'success', message:'datas added sucess'}})
  })
}

exports.addNewFav = function(body, callback) {
  console.log('FavoriteList body:'+body)
//   The second parameter contains the request body as a 'string'. We need to turn this into a JavaScript object then pass it to a function to check its structure. /
  var json = body
//   const valid = validateJson(json)
   if(typeof body == "object"){
    json = body
  }else{
    json = JSON.parse(body)
  }
  
//   If the 'validateJson()' function returns 'false' we need to return an error. /
  console.log('FavoriteList fuck:'+ json)
  var newFav = new mongo.FavoriteList({name: json.name, favorite:json.favorite, history:json.history});
  newFav.save(function(err) {
    if (err) {
      console.log('err: '+err)
        callback({code:400, contentType:'application/json', response:{status:'error', message:'datas added fail'}})
    }
    console.log('add data: '+newFav)
        callback({code:200, contentType:'application/json', response:{status:'success', message:'datas added sucess'}})
  })
}

// This public property contains a function that is passed a resource id and returns the associated list.
exports.findList = function(name, callback) {
  console.log('getUserByName: '+name)
//    Here we loop through the lists. If we find one that matches the supplied id it is returned. /
  mongo.FavoriteList.find({ 'name': name }, function (err, favorites) {
  if (err) {
    callback( {code:406, response:{status:'error', contentType:'application/json', message:'user not found', data: name}})
  }
    callback ({code:200, response:{status:'success', contentType:'application/json', message:'user found', data: favorites}})
  })
}

exports.update = function(name, favorite,callback) {
  console.log('getUserByName: '+name)
  console.log('callback '+callback)
//    Here we loop through the lists. If we find one that matches the supplied id it is returned. /
  mongo.FavoriteList.update({ 'name': name },  { $push: {favorite}  }, function (err, favorites) {
  if (err) {
    callback( {code:406, response:{status:'error', contentType:'application/json', message:'user not found', data: name}})
  }
    callback ({code:200, response:{status:'success', contentType:'application/json', message:'user found', data: favorites}})
  })
}

exports.favoriteDel = function(name, favorite,callback) {
  console.log('getUserByName: '+name)
  console.log('callback '+callback)
//    Here we loop through the lists. If we find one that matches the supplied id it is returned. /
  mongo.FavoriteList.update({ 'name': name },  { $pull: {favorite}  }, function (err, favorites) {
  if (err) {
    callback( {code:406, response:{status:'error', contentType:'application/json', message:'user not found', data: name}})
  }
    callback ({code:200, response:{status:'success', contentType:'application/json', message:'user found', data: favorites}})
  })
}

exports.updateHistory = function(name, history,callback) {
  console.log('getUserByName: '+name)
  console.log('callback '+callback)
//    Here we loop through the lists. If we find one that matches the supplied id it is returned. /
  mongo.FavoriteList.update({ 'name': name },  { $push: {history}  }, function (err, history) {
  if (err) {
    callback( {code:406, response:{status:'error', contentType:'application/json', message:'user not found', data: name}})
  }
    callback ({code:200, response:{status:'success', contentType:'application/json', message:'user found', data: history}})
  })
}


