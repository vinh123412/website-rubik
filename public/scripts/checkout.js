import {cart, removeFromCart} from './cart.js';


let cartSummaryHTML = '';

cart.forEach((cartItem) => {

  cartSummaryHTML +=`
    <div class="product-container-grid js-product-container-grid-${cartItem.productName}">
      <img src="${cartItem.productImage}" class="product-image">
      <div class="product-info">
        <div class="product-name">${cartItem.productName}</div>
        <div class="product-price">${(cartItem.productPrice/1000).toFixed(3)}đ</div>
        <div class="product-quantity">Số lượng: ${cartItem.quantity} <span class="delete-link js-delete-link" data-product-name="${cartItem.productName}">Delete</span></div>
      </div>
    </div>
  `;
});

document.querySelector('.js-container').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productName = link.dataset.productName;
    removeFromCart(productName);
    
    const container = document.querySelector(
      `.js-product-container-grid-${productName}`
    );
    container.remove();

    renderPaymentSummary();
  });
});

export function renderPaymentSummary(){
  let productPrice = 0;
  cart.forEach((cartItem) =>{
    productPrice += cartItem.productPrice * cartItem.quantity;
  });
  
  const totalBeforeTax = productPrice + 10000;
  const tax = totalBeforeTax * 0.1;
  const total = totalBeforeTax + tax;

  const paymentSummaryHTML = `
    <div class="order-price-grid">
      <div>Sản phẩm:</div>
      <div>${(productPrice/1000).toFixed(3)}đ</div>
    </div>
    <div class="order-price-grid">
      <div>Phí vận chuyển:</div>
      <div>10.000đ</div>
    </div>
    <div class="order-price-grid">
      <div>Tổng tiền (chưa tính thuế):</div>
      <div>${(totalBeforeTax/1000).toFixed(3)}đ</div>
    </div>
    <div class="order-price-grid">
      <div>Thuế (10%):</div>
      <div>${(tax/1000).toFixed(3)}đ</div>
    </div>
    <hr>
    <div class="order-price-grid total-price">
      <div>Tổng tiền:</div>
      <div>${(total/1000).toFixed(3)}đ</div>
    </div>
    <a href="pay"><button class="buy-button">Đặt đơn hàng</button></a>
  `;

  document.querySelector('.js-order-price').innerHTML = paymentSummaryHTML;
}

renderPaymentSummary();

