const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const{collection, Cube, Cube2, Cube3} = require('./config');
const fs = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
//convert data into JSON
app.use(express.json());

app.use(express.urlencoded({extended: false}));

// set ejs as view engine
app.set('view engine', 'ejs');
// static file
app.use(express.static('public'));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



app.get('/signup', (req,res) => {
  res.render('signup');
});

app.get('/login', (req,res) => {
  res.render('login');
});

app.get('/checkout', async (req, res) => {
  try {
    const userName = req.session.user ? req.session.user.username : null;

    
    const user = await collection.findOne({ name: userName });

    
    if (user && user.cart) {
      // Calculate total quantity and total price from the cart
      const { totalQuantity, totalPrice } = calculateCartTotal(user.cart);

      res.render('checkout', { userName, cart: user.cart, totalQuantity, totalPrice });
    } else {
      res.render('checkout', { userName, cart: [], totalQuantity: 0, totalPrice: 0 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to calculate total quantity and total price from the cart
function calculateCartTotal(cart) {
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.quantity * parseFloat(item.product.price)), 0);
  return { totalQuantity, totalPrice };
}


  

app.get('/pay', (req,res) => {
  res.render('pay');
});

app.get('/', async (req, res) => {
  try {
    const cubes = await Cube.find();
    const cubes2 = await Cube2.find();
    const cubes3 = await Cube3.find();
    const userName = req.session.user ? req.session.user.username : null;

    if (userName) {
      
      const user = await collection.findOne({ name: userName });

      
      if (user && user.cart) {
        // Calculate total quantity from the cart
        const totalQuantity = user.cart.reduce((total, item) => total + item.quantity, 0);

        res.render('rubik2', { cubes, cubes2, cubes3, userName, totalQuantity });
      } else {
        res.render('rubik2', { cubes, cubes2, cubes3, userName, totalQuantity: 0 });
      }
    } else {
      res.render('rubik2', { cubes, cubes2, cubes3, userName: null, totalQuantity: 0 });
    }
  } catch (error) {
    console.error('Error in / route:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/logout', (req, res) => {
  // Destroy the user's session
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // Redirect the user to the home page
      res.redirect('/');
    }
  });
});

// updated cart summary
app.get('/get-cart-summary', async (req, res) => {
  try {
    const userName = req.session.user ? req.session.user.username : null;

    // Fetch updated cart summary data based on the user's session
    const userData = await collection.findOne({ name: userName });
    const cartSummary = calculateCartSummary(userData.cart);

    res.status(200).json({ orderSummary: cartSummary });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// caculate cart summary
function calculateCartSummary(cart) {
  if (!cart) {
    return {
      totalPrice: '0.000',
      shippingFee: '0.000',
      taxAmount: '0.000',
      overallTotal: '0.000',
      total: '0.000',
    };
  }
  
  let totalPrice = 0;

  
  for (const item of cart) {
    const productPrice = item.product.price;
    
    const itemTotal = productPrice * item.quantity;

    totalPrice += itemTotal;
  }

  const shippingFee = 10000; 
  const taxPercentage = 0.1; 

  const taxAmount = (totalPrice + shippingFee) * taxPercentage;

  
  const overallTotal = totalPrice + shippingFee + taxAmount;
  const total = totalPrice + shippingFee;


  return {
    totalPrice: totalPrice.toFixed(3),
    shippingFee: shippingFee.toFixed(3),
    taxAmount: taxAmount.toFixed(3),
    overallTotal: overallTotal.toFixed(3),
    total: total.toFixed(3),
  };
}


// Tìm kiếm sản phẩm
app.get('/search', async (req, res) => {
  try {
    const searchKeyword = req.query.keyword;

    const searchResultsCube = await Cube.find({ name: { $regex: new RegExp(searchKeyword, 'i') } });
    const searchResultsCube2 = await Cube2.find({ name: { $regex: new RegExp(searchKeyword, 'i') } });
    const searchResultsCube3 = await Cube3.find({ name: { $regex: new RegExp(searchKeyword, 'i') } });

    
    const allSearchResults = [...searchResultsCube, ...searchResultsCube2, ...searchResultsCube3];

    // Loại bỏ sản phẩm trùng lặp
    const uniqueSearchResults = Array.from(new Set(allSearchResults.map(product => product.name)))
      .map(name => allSearchResults.find(product => product.name === name));

    
    res.json(uniqueSearchResults);
  } catch (error) {
    console.error('Error in /search route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/success', (req,res) => {
  res.render('success');
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
    res.json({ success: false, message: 'User already exists. Please choose a different username' });
  }else{
    //hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password,saltRounds);

    data.password = hashedPassword; //replace hash password with original password

    const userdata = await collection.insertMany(data);
    res.json({ success: true, message: 'Register successfully' });
  }

})

// Login user
app.post('/login', async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (check) {
      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
    
      if (isPasswordMatch) {
        // Store user information in the session
        req.session.user = {
          username: check.name,
          // Add other user-related information if needed
        };
    
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Wrong username or password' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Wrong username or password' });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


app.post('/pay', async (req, res) => {
  try {
    const userName = req.session.user ? req.session.user.username : null;

    // Lấy thông tin người dùng từ MongoDB
    const user = await collection.findOne({ name: userName });

    if (user) {
      // Check if the required fields are provided
      const { ten, sdt, diachi, time, payment } = req.body;
      if (!ten || !sdt || !diachi || !time || !payment) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
      }

      // Lấy thông tin đơn hàng từ giỏ hàng của người dùng
      const orderData = {
        products: user.cart.map(item => item.product),
        totalQuantity: user.cart.reduce((total, item) => total + item.quantity, 0),
        totalPrice: user.cart.reduce((total, item) => total + (item.quantity * parseFloat(item.product.price)), 0),
        name1: ten,
        phone: sdt,
        address: diachi,
        time: time,
        option: payment
      };

      user.orders.push(orderData);
      
      user.cart = [];

      await user.save();

      res.json({success: 'đặt đơn thành công'});
    } else {
      res.status(400).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// add to cart 
app.post('/add-to-cart', async (req, res) => {
  const { productName, productImage, productPrice } = req.body;
  const username = req.session.user.username;

  try {
    // Find the user in the database
    const user = await collection.findOne({ name: username });

    // Check if the product is already in the cart
    const existingProductIndex = user.cart.findIndex(
      (item) => item.product.name === productName
    );

    if (existingProductIndex !== -1) {
      user.cart[existingProductIndex].quantity += 1;
    } else {
      user.cart.push({
        product: {
          name: productName,
          image: productImage,
          price: productPrice,
        },
        quantity: 1, 
      });
    }

    await user.save();

    // Calculate total quantity from the updated cart
    const totalQuantity = user.cart.reduce((total, item) => total + item.quantity, 0);

    res.json({ success: true, message: 'Product added to cart successfully',totalQuantity, });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.json({ success: false, message: 'Failed to add product to cart' });
  }
});

// delete request
app.post('/delete-product', async (req, res) => {
  try {
    const userName = req.session.user ? req.session.user.username : null;
    const productPrice = req.body.productPrice;

    // Update the user's cart by removing the specified product
    await collection.updateOne(
      { name: userName },
      { $pull: { cart: { 'product.price': productPrice } } }
    );

    res.status(200).send('Product deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});




const port = 5000;
app.listen(port, () => {
  console.log(`Server running on Port: ${port}`);
})