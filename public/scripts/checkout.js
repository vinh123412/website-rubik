// delete product
document.addEventListener('DOMContentLoaded', () => {
  const deleteLinks = document.querySelectorAll('.js-delete-link');

  deleteLinks.forEach(link => {
    link.addEventListener('click', async (event) => {
      const productPrice = event.target.dataset.productPrice;

      const response = await fetch('/delete-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productPrice })
      });

      if (response.ok) {
        // Remove the product container from the UI
        const productContainer = document.querySelector(`.js-product-container-grid-${productPrice}`);
        if (productContainer) {
          productContainer.remove();
        }
        
        updateOrderSummary();
        
      } else {
        console.error('Failed to delete product from the cart');
      }
    });
  });

  async function updateOrderSummary() {
    const response = await fetch('/get-cart-summary');

    if (response.ok) {
      const cartSummary = await response.json();

      // Update the order summary UI with the fetched data
      const orderPriceElement = document.querySelector('.js-order-price');
      if (orderPriceElement) {
        const { totalPrice, shippingFee, overallTotal, taxAmount, total } = cartSummary.orderSummary;

        // Access individual properties and update the HTML
        orderPriceElement.innerHTML = `
          <div class="order-price-grid">
            <div>Sản phẩm:</div>
            <div>${(totalPrice/1000).toFixed(3)}đ</div>
          </div>
          <div class="order-price-grid">
            <div>Phí vận chuyển:</div>
            <div>${(shippingFee/1000).toFixed(3)}đ</div>
          </div>
          <div class="order-price-grid">
            <div>Tổng tiền (chưa tính thuế):</div>
            <div>${(total/1000).toFixed(3)}đ</div>
          </div>
          <div class="order-price-grid">
            <div>Thuế (10%):</div>
            <div>${(taxAmount/1000).toFixed(3)}đ</div>
          </div>
          <hr>
          <div class="order-price-grid total-price">
            <div>Tổng tiền:</div>
            <div>${(overallTotal/1000).toFixed(3)}đ</div>
          </div>
          <a href="pay"><button class="buy-button">Đặt đơn hàng</button></a>
        `;

      }
    } else {
      console.error('Failed to fetch cart summary from the server');
    }
  }

  
  
});