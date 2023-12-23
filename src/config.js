const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/Login-tut')

//check database connect or not
connect.then(()=>{
  console.log('Database connected Successfully');
});

// Create a schema
const LoginSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  name1:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  time:{
    type: String,
    required: true
  },
  option:{
    type: String,
    required: true
  }
});

//collection part
const collection = new mongoose.model('users',LoginSchema);

const collection2 = new mongoose.model('orders',orderSchema);


module.exports = { collection, collection2 };