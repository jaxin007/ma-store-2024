const itemsListElement = document.querySelector('[items-grid]');

const itemCardTemplate = document.querySelector('[item-card]');

(async () => {
  const response = await fetch('https://api.escuelajs.co/api/v1/products');

  const responseJson = await response.json();

  const itemsCartMaybe = localStorage.getItem('itemsCart');

  const itemsCartArray = itemsCartMaybe ? JSON.parse(itemsCartMaybe) : [];

  const addToCart = (productId) => {
    if (itemsCartArray.includes(productId)) {
      return;
    }

    itemsCartArray.push(productId);

    localStorage.setItem('itemsCart', JSON.stringify(itemsCartArray));
  }

  const removeFromCart = (productId) => {
    const index = itemsCartArray.indexOf(productId);

    if (index === -1) {
      return;
    }

    itemsCartArray.splice(index, 1);

    localStorage.setItem('itemsCart', JSON.stringify(itemsCartArray));
  }

  const renderStore = () => {
    itemsListElement.innerHTML = ''

    responseJson.forEach((product) => {
      const cardElement = itemCardTemplate.content.cloneNode(true);

      cardElement.querySelector('[item-image]').src = './public/t-shirt.jpeg';
      cardElement.querySelector('[item-name]').innerText = product.title;
      cardElement.querySelector('[item-description]').innerText = product.description;
      cardElement.querySelector('[item-category]').innerText = product.category.name;
      cardElement.querySelector('[item-price-value]').innerText = '$ ' + product.price;

      const isProductInCart = itemsCartArray.includes(product.id);

      const cartButton = cardElement.querySelector('[item-add-to-cart-button]');

      cartButton.addEventListener('click', () => {
        isProductInCart ? removeFromCart(product.id) : addToCart(product.id);

        renderStore();
      });

      cartButton.textContent = isProductInCart ? 'Remove from cart' : 'Add to cart';
      cartButton.style.backgroundColor = isProductInCart ? '#BE7B72' : '#713af7';

      itemsListElement.appendChild(cardElement);
    })
  }

  renderStore()
})()
