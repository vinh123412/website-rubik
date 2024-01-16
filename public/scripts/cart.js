//export let cart = JSON.parse(localStorage.getItem('cart'));
/*
if(!cart){
  cart = [{
    productName: 'Rubik1',
    quantity: 1
  }]
}

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productName, productImage, productPrice){
  let matchItem;

    cart.forEach((cartItem) => {
      if(cartItem.productName === productName){
        matchItem=cartItem;
      }
    });

    if(matchItem){
      matchItem.quantity+=1;
    }else{
      cart.push({
        productName: productName,
        productImage: productImage,
        productPrice: productPrice,
        quantity: 1
      });
      
    }

    saveToStorage();
}

export function removeFromCart(productName){
  const newCart = [];

  cart.forEach((cartItem) => {
    if(cartItem.productName !== productName) newCart.push(cartItem);
  });

  cart = newCart;
  saveToStorage();
}
*/