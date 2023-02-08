let cartItems = [];
let products = [];

fetch("https://fakestoreapi.com/products?limit=6")
  .then((res) => res.json())
  .then((items) => {
    products = [...items];
    renderProducts();
});

// Checkout
const form = document.querySelector("#checkout-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = form.email.value;

  let handler = PaystackPop.setup({
    key: "",
    email: email,
    amount: getCartTotal() * 100,
    ref: "Catty" + Math.floor(Math.random() * 1000000000 + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
    // label: "Optional string that replaces customer email"
    onClose: function () {
      alert("Please try complete the payment");
    },
    callback: function (response) {
      let message = "Payment complete! Reference: " + response.reference;
      alert(message);
      cartItems = [];
      renderCartItems();
    },
  });

  handler.openIframe();
});


function addProducToCart(productId) {
  const item = cartItems.find((item) => item.id == productId);
  if (item) {
    item.quantity += 1;
  } else {
    const product = products.find((p) => p.id == productId);
    const item = { ...product, quantity: 1 };
    cartItems.push(item);
  }
}

function getCartTotal() {
  return cartItems.reduce(function (a, b) {
    return a + b.price * b.quantity;
  }, 0);
}

function renderCartCounter() {
  document
    .querySelectorAll("[data-counter]")
    .forEach((el) => (el.textContent = cartItems.length));
}

function renderCartTotal() {
  document.querySelector("#cart-total").textContent = getCartTotal();
}

function renderProducts() {
  const productListElement = document.querySelector("#product-list");
  const productHTMLArray = products.map(
    (product) =>
      `
    <div class="product-card">
        <img src="${product.image}" alt="product image">
        <div class="content">
            <h4>${product.title}</h4>
            <p>${new Intl.NumberFormat("en-us", {
              style: "currency",
              currency: "EUR",
            }).format(product.price)}</p>
            <button class="button" data-productid='${
              product.id
            }'>Add To Cart</button>
        </div>
    </div>
    `
  );

  productListElement.innerHTML = productHTMLArray.join("");

  document.querySelectorAll("[data-productid]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = btn.dataset.productid;
      addProducToCart(productId);
      renderCartItems();
    });
  });
}

function renderCartItems() {
  renderCartTotal();
  renderCartCounter();
  const cartListElement = document.querySelector("#cart-list");
  const cartHTMLArray = cartItems.map(
    (item) =>
      `
      <div class="cart-item">
        <div class="cart-image-container">
            <img src="https:via.placeholder.com/50" alt="item image">
            <div>
                <h4>${item.name}</h4>
                <p>${new Intl.NumberFormat("en-us", {
                  style: "currency",
                  currency: "EUR",
                }).format(item.price)}</p>
            </div>
        </div>
        <span>X${item.quantity}</span>
        <span>$${item.price * item.quantity}</span>
        <button class="icon-button" data-cartid='${item.id}'>X</button>
    </div>
    `
  );

  cartListElement.innerHTML = cartHTMLArray.join("");

  document.querySelectorAll("[data-cartid]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const cartId = btn.dataset.cartid;
      cartItems = cartItems.filter((item) => item.id != cartId);
      renderCartItems();
    });
  });
}
