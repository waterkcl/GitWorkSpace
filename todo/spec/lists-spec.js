'use strict'
/*istanbul ignore next*/
var frisby = require('frisby')
var request = require('request');

var URL = 'http://port-8080.305CDE-longchan082528856.codeanyapp.com'

// get weather list from mongodb
frisby.create('Test Get Weather')
  .get(URL+'/lists')
  .expectStatus(200)
	.expectHeaderContains('Content-Type', 'application/json')
	.expectJSON({status: 'success', message: 'lists found'})
  .toss()

// add new user to mongodb
frisby.create('Test Add User')
.post(URL+'/users', {
    "name" : "abc",
    "password" : "123456"
}, { json: true })
.expectStatus(200)
.expectJSON({status: 'success', message: 'datas added sucess'})
.expectHeaderContains('Content-Type', 'json')
.toss()

// get user by name and password from mongodb
frisby.create('Test Get User')
  .get(URL+'/lists/abc/123456')
  .expectStatus(200)
	.expectHeaderContains('Content-Type', 'application/json')
	.expectJSON({status: 'success', message: 'user found'})
  .toss()

// delete user by name and password from mongodb
frisby.create('Test Delete User')
.delete(URL+'/lists/abc/123456')
.expectStatus(200)
.expectJSON({message: 'this should delete the specified resource'})
.expectHeaderContains('Content-Type', 'json')
.toss()