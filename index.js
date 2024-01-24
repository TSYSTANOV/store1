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
let index = 1;
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
      } else if (activeId === "cart") {
        renderCart(productCart);
      } else {
        getProductsByCategory(activeId);
      }
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
  renderGoods(products, productCart);
}
function itemsColorVisible(product, array) {
  let ownProperty = false;
  for (let j = 0; j < array.length; j++) {
    if (product.id === array[j].id) {
      ownProperty = true;
    }
  }
  return ownProperty;
}
function renderGoods(array, cartArray) {
  let prod = document.createElement("div");
  prod.className = "products";
  for (let i = 0; i < array.length; i++) {
    let product = array[i];
    console.log(product.category);
    console.log(cartArray);
    let span = document.createElement("span");
    let res = false;
    if (cartArray && cartArray.length > 0) {
      res = itemsColorVisible(product, cartArray);
    }

    let div = document.createElement("div");
    div.className = "item";
    div.dataset.itemGoodsId = product.id;
    div.innerHTML = `
    <img class='product-image' src='${product.image}'/>
    <h2 class='product-title'>${product.title}</h2>
    <p class='product-price'>${product.price} USD</p>`;
    if (res) {
      span.textContent = "🔥 In Cart";
      span.className = "Add-toCart";
      div.style.backgroundColor = "pink";
      span.style.pointerEvents = "none";
    } else {
      span.textContent = "Add to cart";
      span.className = "Add-toCart";
      span.addEventListener("click", addToCart(product, span));
    }
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
  renderGoods(products, productCart);
}
function addToCart(product, elem) {
  return () => {
    let nonVisibleDiv = document.createElement("div");
    nonVisibleDiv.className = "nonVisibleDiv";
    ///
    let div = document.createElement("div");
    div.className = "modal-product";
    let span = document.createElement("span");
    span.className = "modal-cart-close";
    span.textContent = "X";
    span.addEventListener("click", () => {
      document.querySelector(".nonVisibleDiv").remove();
    });
    div.append(span);

    let div2 = document.createElement("div");
    div2.className = "product-cart-modal";

    let spanPlus = document.createElement("span");
    spanPlus.className = "numbers";
    spanPlus.textContent = "+";
    spanPlus.addEventListener("click", changeCount(true));

    let spanMinus = document.createElement("span");
    spanMinus.className = "numbers";
    spanMinus.textContent = "-";
    spanMinus.addEventListener("click", changeCount(false));

    let div3 = document.createElement("div");
    div3.className = "product-info-modal";
    div3.innerHTML = `
    <h3>${product.title}</h3>
    <p>Rating: ${product.rating.rate}</p>
    <p>${product.description}</p>
    <div class="product-btns">
    <p class='countForCart'>${index}</p>
    </div>
    <p>Цена: ${product.price} USD</p>`;

    div2.innerHTML = `
    <div class='product-image-modal'>
    <img src='${product.image}'/></div`;

    let btn = document.createElement("button");
    btn.className = "addTocartModal";
    btn.textContent = "Add to cart";
    btn.addEventListener("click", clickToCartHandler(product, elem));

    div3.querySelector(".product-btns").append(spanPlus);
    div3.querySelector(".product-btns").prepend(spanMinus);

    div3.append(btn);

    div2.append(div3);

    div.append(div2);
    nonVisibleDiv.append(div);
    document.querySelector(".container").prepend(nonVisibleDiv);
  };
}
function changeCount(ident) {
  return () => {
    if (ident) {
      index++;
      document.querySelector(".countForCart").innerHTML = index;
      numb = index;
    }
    if (!ident) {
      if (index > 1) {
        index--;
        document.querySelector(".countForCart").innerHTML = index;
      }
    }
  };
}
function clickToCartHandler(product, elem) {
  return () => {
    elem.textContent = "🔥 In Cart";
    elem.closest(".item").style.backgroundColor = "pink";
    elem.style.pointerEvents = "none";

    document.querySelector(".nonVisibleDiv").style.cssText = `
    transition:0.5s;
    transform:scale(0);
    `;
    setTimeout(() => {
      document.querySelector(".nonVisibleDiv").remove();
    }, 500);

    let createProduct = { ...product, count: index };
    productCart.push(createProduct);
    console.log(productCart);
    checkCountData(productCart);
    index = 1;
  };
}
function renderCart(array) {
  console.log(array);
  if (array.length === 0) {
    return;
  }
  let nonVisibleDiv = document.createElement("div");
  nonVisibleDiv.className = "nonVisibleDiv";

  let div = document.createElement("div");
  div.className = "modal-cart";
  let span = document.createElement("span");
  span.className = "modal-cart-close";
  span.textContent = "X";
  span.addEventListener("click", () => {
    document.querySelector(".nonVisibleDiv").remove();
  });
  div.append(span);

  let table = document.createElement("table");
  table.className = "table";
  div.append(table);

  for (let i = 0; i < array.length; i++) {
    let product = array[i];

    let spanPlus = document.createElement("span");
    spanPlus.className = "numbers";
    spanPlus.textContent = "+";
    spanPlus.addEventListener(
      "click",
      changeCountByArray(product.id, array, true)
    );

    let spanMinus = document.createElement("span");
    spanMinus.className = "numbers";
    spanMinus.textContent = "-";
    spanMinus.addEventListener(
      "click",
      changeCountByArray(product.id, array, false)
    );

    let div2 = document.createElement("tr");
    div2.className = "modal-cart-item";
    div2.dataset.tdTableId = product.id;
    div2.innerHTML = `
    <td><img class='modal-cart-item-image' src='${product.image}'/></td>
    <td class='modal-cart-item-title'>${product.title}</td>
    <td class='modal-cart-item-price'>${product.price} USD</td>
    <td class='modal-cart-btns'>
    <p data-count-incart='${product.id}' class='modal-cart-item-count'>${
      product.count
    }</p>
    <td data-summary-price-id='${product.id}'>Summary:<p>${
      product.count * product.price
    }</p>USD</td>
    `;
    div2.querySelector(".modal-cart-btns").prepend(spanMinus);
    div2.querySelector(".modal-cart-btns").append(spanPlus);
    table.append(div2);
  }
  let p = document.createElement("p");
  p.className = "total-price";

  div.append(p);
  nonVisibleDiv.append(div);
  document.querySelector(".container").prepend(nonVisibleDiv);
  sumTotal();
}
function changeCountByArray(id, array, indent) {
  return () => {
    for (let i = 0; i < array.length; i++) {
      if (id === array[i].id) {
        if (indent) {
          array[i].count += 1;
          document.querySelector(`[data-count-incart='${id}']`).innerHTML =
            array[i].count;
          summaryItemPrice(id, array[i].price, array[i].count);
          sumTotal();
        } else {
          if (array[i].count > 0) {
            array[i].count -= 1;
            document.querySelector(`[data-count-incart='${id}']`).innerHTML =
              array[i].count;
            summaryItemPrice(id, array[i].price, array[i].count);
            sumTotal();
          }
        }
      }
    }
    checkCountArray(array);
    checkCountData(array);
    if (
      document.querySelector(`[data-count-incart='${id}']`).innerHTML === "0"
    ) {
      document.querySelector(`[data-td-table-id='${id}']`).remove();
      if (document.querySelector(`[data-item-goods-id='${id}']`)) {
        document.querySelector(
          `[data-item-goods-id='${id}']`
        ).style.backgroundColor = "white";
        document.querySelector(
          `[data-item-goods-id='${id}'] > .Add-toCart`
        ).style.pointerEvents = "auto";
        document.querySelector(
          `[data-item-goods-id='${id}'] > .Add-toCart`
        ).innerHTML = "Add to cart";
      }

      //   item-goods-id =
      // elem.textContent = "🔥 In Cart";
      // elem.closest(".item").style.backgroundColor = "pink";
      // elem.style.pointerEvents = "none";
    }
    console.log(array);
  };
}
function checkCountArray(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].count === 0) {
      array.splice(i, 1);
    }
  }
}
function checkCountData(array) {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    count += array[i].count;
  }
  document.querySelector(`[data-products-length]`).dataset.productsLength =
    count;
}
function summaryItemPrice(id, price, count) {
  document.querySelector(
    `[data-summary-price-id='${id}']`
  ).innerHTML = `Summary:<p>${(price * count).toFixed(2)}</p>USD`;
}
function sumTotal() {
  let result = 0;
  document.querySelectorAll(`[data-summary-price-id] > p`).forEach((el) => {
    result += parseFloat(el.textContent);
  });
  document.querySelector(".total-price").textContent = `Total: ${result} USD`;
}
