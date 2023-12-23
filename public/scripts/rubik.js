import {cart, addToCart} from './cart.js';


export const products1 = [{
  image:'picture/img_201405191004073256.webp',
  name: 'Rubik1',
  price: 10000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik2',
  price: 20000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik3',
  price: 30000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik4',
  price: 40000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik5',
  price: 50000
}];

export const products2 = [{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik6',
  price: 60000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik7',
  price: 70000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik8',
  price: 80000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik9',
  price: 90000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik10',
  price: 100000
}];

export const products3 = [{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik11',
  price: 110000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik12',
  price: 120000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik13',
  price: 130000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik14',
  price: 140000
},{
  image: 'picture/img_201405191004073256.webp',
  name: 'Rubik15',
  price: 150000
}];
export const products = products1+products2+products3;

let products1HTML = '';
let products2HTML = '';
let products3HTML = '';

products1.forEach((product) => {
  products1HTML += `
    <div class="rubik-product">
      <img class="rubik-picture" src="${product.image}">
      <p class="product-name">${product.name}</p>
      <p class="price">${(product.price/1000).toFixed(3)}đ</p>
      <button class="purchase-button js-add-to-cart" data-product-name="${product.name}" data-product-image="${product.image}" data-product-price="${product.price}">Thêm Vào Giỏ Hàng</button>
    </div>
  `;
});

products2.forEach((product) => {
  products2HTML += `
    <div class="rubik-product">
      <img class="rubik-picture" src="${product.image}">
      <p class="product-name">${product.name}</p>
      <p class="price">${(product.price/1000).toFixed(3)}đ</p>
      <button class="purchase-button js-add-to-cart" data-product-name="${product.name}" data-product-image="${product.image}" data-product-price="${product.price}">Thêm Vào Giỏ Hàng</button>
    </div>
  `;
});

products3.forEach((product) => {
  products3HTML += `
    <div class="rubik-product">
      <img class="rubik-picture" src="${product.image}">
      <p class="product-name">${product.name}</p>
      <p class="price">${(product.price/1000).toFixed(3)}đ</p>
      <button class="purchase-button js-add-to-cart" data-product-name="${product.name}" data-product-image="${product.image}" data-product-price="${product.price}">Thêm Vào Giỏ Hàng</button>
    </div>
  `;
});

document.querySelector('.js-product1').innerHTML = products1HTML;
document.querySelector('.js-product2').innerHTML = products2HTML;
document.querySelector('.js-product3').innerHTML = products3HTML;



function updateCartQuantity(){
  let cartQuantity=0;
  cart.forEach((cartItem) => {
    cartQuantity+=cartItem.quantity;
  });
  
  document.querySelector('.js-notifycation').innerHTML=cartQuantity;
}



document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productName = button.dataset.productName;
    const productImage = button.dataset.productImage;
    const productPrice = button.dataset.productPrice;
    
    addToCart(productName, productImage, productPrice);
    updateCartQuantity();

  });
});

updateCartQuantity();