const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const{collection, collection2} = require('./config');
const fs = require('fs');

const app = express();
//convert data into JSON
app.use(express.json());

app.use(express.urlencoded({extended: false}));

// set ejs as view engine
app.set('view engine', 'ejs');
// static file
app.use(express.static('public'));



app.get('/', (req,res) => {
  res.render('rubik');
});

app.get('/signup', (req,res) => {
  res.render('signup');
});

app.get('/login', (req,res) => {
  res.render('login');
});

app.get('/checkout', (req,res) => {
  res.render('checkout');
});

app.get('/rubik1', (req,res) => {
  res.render('rubik1');
});  

app.get('/pay', (req,res) => {
  res.render('pay');
});

// Register user
app.post('/signup', async (req,res) => {
  const data = {
    name: req.body.username,
    password: req.body.password
  }

  //check if the user already exists in the database
  const existinguser = await collection.findOne({name: data.name})

  if(existinguser){
    res.send('User already exists. Please choose a different username');
  }else{
    //hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password,saltRounds);

    data.password = hashedPassword; //replace hash password with original password

    const userdata = await collection.insertMany(data);
    res.send('register succesfully');
  }

})

// Login user
app.post('/login', async(req,res) => {
  try{
    const check = await collection.findOne({name: req.body.username});
    if(!check){
      res.send('user name cannot found');
    }

    //compare the hash password from the database with plain text
    const isPasswordMatch = await bcrypt.compare(req.body.password,check.password);
    if(isPasswordMatch){
      res.render('rubik1');
    }else{
      req.send('wrong password');
    }  
  }catch{
    res.send('wrong detail');
  }
});

// order info
app.post('/pay', async(req,res) => {
  const data1 = {
    name1: req.body.ten,
    phone: req.body.sdt,
    address: req.body.diachi,
    time: req.body.time,
    option: req.body.payment
  }


  const userdata1 = await collection2.insertMany(data1);
  res.send('Đặt đơn thành công');
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on Port: ${port}`);
})