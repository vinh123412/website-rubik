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
  },
  cart: [
    {
      product: {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: String, required: true },
      },
      quantity: { type: Number, default: 1 },
    },
  ],
  orders: [
    {
      products: [
        {
          name: { type: String, required: true },
          image: { type: String, required: true },
          price: { type: String, required: true },
        },
      ],
      totalQuantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
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
    },
  ],
});



const cubeSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  price: {
    type: String,
  }
});

const cubeSchema2 = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  price: {
    type: String,
  }
});

const cubeSchema3 = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  price: {
    type: String,
  }
});



//collection part
const collection = new mongoose.model('users',LoginSchema);

const Cube = mongoose.model('cube', cubeSchema);

const Cube2 = mongoose.model('cube2', cubeSchema2);

const Cube3 = mongoose.model('cube3', cubeSchema3);



module.exports = { collection, Cube, Cube2, Cube3};