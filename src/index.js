const itemsListElement = document.querySelector('[items-grid]');

const itemCardTemplate = document.querySelector('[item-card]');

(async () => {
  const response = await fetch('https://api.escuelajs.co/api/v1/products');

  const responseJson = await response.json();

  const itemsCartArray = JSON.parse(localStorage.getItem('itemsCart') || '[]');

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

  const renderStore = (products) => {
    itemsListElement.innerHTML = '';

    products.forEach((product) => {
      const cardElement = itemCardTemplate.content.cloneNode(true);

      cardElement.querySelector('[item-image]').src = './public/t-shirt.jpeg';
      cardElement.querySelector('[item-name]').innerText = product.title;
      cardElement.querySelector('[item-category]').innerText = product.category.name;
      cardElement.querySelector('[item-price-value]').innerText = '$ ' + product.price;

      // --- Dynamic description logic
      const descriptionElement = cardElement.querySelector('[item-description]');
      const readMoreSpan = cardElement.querySelector('[item-read-more]');

      const isDescriptionLong = product.description.length >= 30;

      if (!isDescriptionLong) {
        readMoreSpan.style.display = 'none';
      }

      const descriptionFirstPart = isDescriptionLong ? product.description.slice(0, 30) : product.description;
      const descriptionSecondPart = isDescriptionLong ? product.description.slice(30, product.description.length) : product.description;

      descriptionElement.innerText = descriptionFirstPart;

      readMoreSpan.addEventListener('click', () => {
        if (!isDescriptionLong) {
          return;
        }

        descriptionElement.innerText = descriptionFirstPart + descriptionSecondPart;
        readMoreSpan.style.display = 'none';
      })

      // --- Add To Cart button logic
      const isProductInCart = itemsCartArray.includes(product.id);

      const cartButton = cardElement.querySelector('[item-add-to-cart-button]');

      cartButton.addEventListener('click', () => {
        isProductInCart ? removeFromCart(product.id) : addToCart(product.id);

        renderStore(products);
      });

      cartButton.textContent = isProductInCart ? 'Remove from cart' : 'Add to cart';
      cartButton.style.backgroundColor = isProductInCart ? '#BE7B72' : '#713af7';

      itemsListElement.appendChild(cardElement);
    })
  }

  renderStore(responseJson);
})()
