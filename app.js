const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const service = require('feathers-knex');
const knex = require('knex');
/*
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite'
  }
});*/

var db = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        user : 'root',
        password : '',
        database : 'items'
    }
});

// Create a feathers instance.
const app = express(feathers());
// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());
// Enable Socket.io services
app.configure(socketio());
// Create Knex Feathers service with a default page size of 2 items
// and a maximum size of 4
app.use('/items', service({
  Model: db,
  name: 'items',
  paginate: {
    default: 10,
    max: 20
  }
}))
app.use(express.errorHandler());

db.schema.createTableIfNotExists('items', table => {
    console.log('Creating messages table');
table.increments('id');
table.string('name',150);
table.text('description');

});

// Start the server.
const port = 3030;

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`);
});
