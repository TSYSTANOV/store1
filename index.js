// fetch(
//   "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=645460d5f9c0c46c07c1e70022ea4f3f"
// )
//   .then((info) => {
//     return info.json();
//   })
//   .then((inform) => {
//     console.log(inform);
//   });
///
let productCart = [];
let activeId = "";

getCategories();
async function getCategories() {
  await getUllCategories();
  document.querySelectorAll(".category-btn").forEach((el) => {
    if (activeId === el.dataset.catName) {
      if (activeId === "All") {
        getAllProduct();
      }
      el.classList.add("activebBtn");
    }
    el.addEventListener("click", () => {
      document
        .querySelector(`[data-cat-name="${activeId}"]`)
        .classList.remove("activebBtn");
      activeId = event.target.dataset.catName;
      event.target.classList.add("activebBtn");
      if (activeId === "All") {
        getAllProduct();
      } else {
        getProductsByCategory(activeId);
      }
      console.log(activeId);
    });
  });
}

async function getUllCategories() {
  let categories = await fetch("https://fakestoreapi.com/products/categories")
    .then((info) => {
      return info.json();
    })
    .then((inform) => {
      return inform;
    });

  let div = document.createElement("div");
  div.className = "categories";
  let btn = document.createElement("button");
  btn.textContent = "All";
  btn.className = "category-btn";
  btn.dataset.catName = "All";
  activeId = "All";
  div.append(btn);
  let btnCart = document.createElement("div");
  btnCart.textContent = "🛒 CART";
  btnCart.className = "category-btn Btncart";
  btnCart.dataset.catName = "cart";
  btnCart.dataset.productsLength = "0";
  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    let button = document.createElement("button");
    button.className = "category-btn";
    button.textContent = `${category}`;
    button.dataset.catName = `${category}`;
    div.append(button);
  }
  div.append(btnCart);
  document.querySelector(".container").prepend(div);
}
async function getAllProduct() {
  if (document.querySelector(".products")) {
    document.querySelector(".products").remove();
  }
  let products = await fetch("https://fakestoreapi.com/products")
    .then((info) => {
      return info.json();
    })
    .then((inform) => {
      return inform;
    });
  renderGoods(products);
}

function renderGoods(array) {
  let prod = document.createElement("div");
  prod.className = "products";
  for (let i = 0; i < array.length; i++) {
    let product = array[i];
    let span = document.createElement("span");
    span.textContent = "Add to cart";
    span.className = "Add-toCart";
    span.addEventListener("click", addToCart(product, span));

    let div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
    <img class='product-image' src='${product.image}'/>
    <h2 class='product-title'>${product.title}</h2>
    <p class='product-price'>${product.price} USD</p>`;
    div.append(span);
    prod.append(div);
    document.querySelector(".container").append(prod);
  }
}

async function getProductsByCategory(category) {
  let products = await fetch(
    `https://fakestoreapi.com/products/category/${category}`
  )
    .then((info) => {
      return info.json();
    })
    .then((inform) => {
      return inform;
    });
  if (document.querySelector(".products")) {
    document.querySelector(".products").remove();
  }
  renderGoods(products);
}

function addToCart(product, elem) {
  return () => {
    elem.textContent = "🔥 In Cart";
    elem.closest(".item").style.backgroundColor = "pink";
    elem.style.pointerEvents = "none";
    console.log(elem);
    productCart.push(product);
    renderCart(productCart);
  };
}

function renderCart(array) {
  console.log(array);
}
