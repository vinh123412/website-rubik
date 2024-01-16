// add to cart
document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.js-add-to-cart');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const productName = button.dataset.productName;
      const productImage = button.dataset.productImage;
      const productPrice = button.dataset.productPrice;

      try {
        const response = await fetch('/add-to-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productName,
            productImage,
            productPrice,
          }),
        });

        const data = await response.json();

        if (data.success) {
          
          
          // Update the notification with the new totalQuantity
          updateNotification(data.totalQuantity);
        } else {
          alert('Failed to add product to cart');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
  
  function updateNotification(totalQuantity) {
    const notificationElement = document.querySelector('.js-notification');

    if (notificationElement) {
      // Update the notification text/content
      notificationElement.textContent = totalQuantity;
    }
  }
});


// search product
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('.js-search-button');
  const searchInput = document.querySelector('.search-bar');
  const productContainers = document.querySelectorAll('.product-container');

  function attachAddToCartEventListeners(buttons) {
    buttons.forEach(button => {
      button.addEventListener('click', async () => {
        const productName = button.dataset.productName;
        const productImage = button.dataset.productImage;
        const productPrice = button.dataset.productPrice;

        try {
          const response = await fetch('/add-to-cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productName,
              productImage,
              productPrice,
            }),
          });

          const data = await response.json();

          if (data.success) {
            // Update the notification with the new totalQuantity
            updateNotification(data.totalQuantity);
          } else {
            alert('Failed to add product to cart');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      });
    });
    function updateNotification(totalQuantity) {
      const notificationElement = document.querySelector('.js-notification');
  
      if (notificationElement) {
        // Update the notification text/content
        notificationElement.textContent = totalQuantity;
      }
    }
  }

  searchButton.addEventListener('click', async () => {
    const searchKeyword = searchInput.value.trim();

    // Check if there's a search keyword
    if (searchKeyword) {
      try {
        const response = await fetch(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
        const searchResults = await response.json();

        // Render the search results in the first product container
        productContainers.forEach((container, index) => {
          if (index === 0) {
            container.innerHTML = '';
            searchResults.forEach(product => {
              const productElement = document.createElement('div');
              productElement.classList.add('product1');
              productElement.innerHTML = `
                <div class="rubik-product1">
                  <img class="rubik-picture1" src="${product.image}">
                  <div class="product-info">
                    <p class="product-name">${product.name}</p>
                    <p class="price">${(product.price / 1000).toFixed(3)}đ</p>
                    <button class="purchase-button js-add-to-cart" 
                      data-product-name="${product.name}" 
                      data-product-image="${product.image}" 
                      data-product-price="${product.price}">
                      Thêm Vào Giỏ Hàng
                    </button>
                  </div>
                </div>
              `;
              container.appendChild(productElement);

              // Get the newly created Add to Cart button and attach event listener
              const addToCartButton = productElement.querySelectorAll('.js-add-to-cart');
              if (addToCartButton) {
                attachAddToCartEventListeners(addToCartButton);
              }
            });
            
          } else {
            // Clear content in other containers
            container.innerHTML = '';
          }
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });

  
  
});











