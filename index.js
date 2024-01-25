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
// localStorage.clear()
let productCart
let compareArr = [];
let activeId 

if(localStorage.getItem('cart'))
{
  productCart = JSON.parse(localStorage.getItem('cart'))
}
else
{
  productCart = []
}
////
if(localStorage.getItem('activeId'))
{
  activeId = localStorage.getItem('activeId')
  if(activeId === "All")
  {
    getAllProduct()
  }
  else
  {
  getProductsByCategory(activeId)
  }
}
else
{
  activeId = "All"
  getAllProduct()
}
;
let index = 1;
getCategories(activeId);
async function getCategories(ident) {
  await getUllCategories();
  checkCountData(productCart)
  document.querySelector(`[data-cat-name="${ident}"]`).classList.add('activebBtn')
  document.querySelectorAll(".category-btn").forEach((el) => {
    // console.log(ident)
    // // console.log(el.dataset.catName)
    // if (activeId === el.dataset.catName) {
    // //   if (activeId === "All") {
    // //     getAllProduct();
    // //   }
    //   el.classList.add("activebBtn");
    // }
    el.addEventListener("click", () => {
      document
        .querySelector(`[data-cat-name="${ident}"]`)
        .classList.remove("activebBtn");
      ident = event.target.dataset.catName;
      event.target.classList.add("activebBtn");
      if (ident === "All") {
        toLocalStorActiveBtn('activeId', ident)
        getAllProduct();
      } else if (ident === "cart") {
        renderCart(productCart);
      } else if (ident === "compare") {
        compareGoods(compareArr);
      } else {
        toLocalStorActiveBtn('activeId', ident)
        getProductsByCategory(ident);
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
  let btnCart = document.createElement("button");
  btnCart.textContent = "🛒 CART";
  btnCart.className = "category-btn Btncart";
  btnCart.dataset.catName = "cart";
  btnCart.dataset.productsLength = "0";
  let btnToCompare = document.createElement("button");
  btnToCompare.textContent = "COMPARE";
  btnToCompare.className = "category-btn btnToCompare";
  btnToCompare.dataset.catName = "compare";
  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    let button = document.createElement("button");
    button.className = "category-btn";
    button.textContent = `${category}`;
    button.dataset.catName = `${category}`;
    div.append(button);
  }
  div.append(btnCart);
  div.append(btnToCompare);
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
  renderGoods(products, productCart, compareArr);
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
function itemsCompareVisible(product, array) {
  let ownProperty = false;
  for (let j = 0; j < array.length; j++) {
    if (product.id === array[j].id) {
      ownProperty = true;
    }
  }
  return ownProperty;
}
function renderGoods(array, cartArray, compareArr) {
  let prod = document.createElement("div");
  prod.className = "products";
  for (let i = 0; i < array.length; i++) {
    let product = array[i];

    let btnCompare = document.createElement("button");
    btnCompare.dataset.compareBtn = product.id;
    btnCompare.className = "compare-button";

    let span = document.createElement("span");
    let res = false;
    let compare = false;
    if (cartArray && cartArray.length > 0) {
      res = itemsColorVisible(product, cartArray);
    }
    if (compareArr && compareArr.length > 0) {
      compare = itemsCompareVisible(product, compareArr);
    }
    ////
    /////
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
    if (compare) {
      btnCompare.textContent = "Added";
      btnCompare.style.pointerEvents = "none";
    } else {
      btnCompare.textContent = "Add To Compare";
      btnCompare.addEventListener(
        "click",
        compareProducts(product, product.id)
      );
    }
    div.append(span);
    div.append(btnCompare);
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
  renderGoods(products, productCart, compareArr);
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
    toLocalStorProductCart('cart', productCart)
    console.log(productCart);
    checkCountData(productCart);
    index = 1;
  };
}
function renderCart(array) {
  console.log(array);
  toLocalStorProductCart('cart', array)
  if (array.length === 0) {
    let params = document.querySelector(`[data-cat-name="cart"]`).getBoundingClientRect()
    addictionVisible(params.left)
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
          toLocalStorProductCart('cart', array)
          sumTotal();
        } else {
          if (array[i].count > 0) {
            array[i].count -= 1;
            document.querySelector(`[data-count-incart='${id}']`).innerHTML =
              array[i].count;
            summaryItemPrice(id, array[i].price, array[i].count);
            toLocalStorProductCart('cart', array)
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
    }
  };
}
function checkCountArray(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].count === 0) {
      array.splice(i, 1);
      toLocalStorProductCart('cart', array)
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
function compareProducts(product, id) {
  return () => {
    let item = document.querySelector(`[data-compare-btn ='${id}']`);
    item.textContent = "Added";
    item.style.pointerEvents = "none";
    compareArr.push(product);
  };
}
function compareGoods(array) {
  if (array.length === 0) {
    let params = document.querySelector(`[data-cat-name="compare"]`).getBoundingClientRect()
    addictionVisibleCompare(params.left)
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
    compareArr = [];
    document.querySelectorAll(`[data-compare-btn]`).forEach((el) => {
      el.textContent = "Add To Compare";
      el.style.pointerEvents = "auto";
    });
  });
  div.append(span);

  let table = document.createElement("table");
  table.className = "tableCompare";
  for (let i = 0; i < array.length; i++) {
    let item = array[i];
    let { price, rate } = chooseBest(array);
    let p1 = document.createElement("p");
    p1.className = "border-table";
    p1.innerHTML = `Rate: ${item.rating.rate}`;
    if (item.rating.rate === rate) {
      p1.classList.add("specialChar");
    }
    let p2 = document.createElement("p");
    p2.className = "border-table";
    p2.innerHTML = `Price: ${item.price} USD`;
    if (item.price === price) {
      p2.classList.add("specialChar");
    }

    let td = document.createElement("td");
    td.className = "table-td-compare";
    td.innerHTML = `
    <img class='compare-table' src='${item.image}'/>
    <p class='border-table'>Title: ${item.title}</p>
    `;
    td.append(p1);
    td.append(p2);
    table.append(td);
  }
  div.append(table);
  nonVisibleDiv.append(div);
  document.querySelector(".container").prepend(nonVisibleDiv);
  //
  document.querySelector('.products').remove()
  // document
  //   .querySelector(`[data-cat-name="${activeId}"]`)
  //   .classList.remove("activebBtn");
  // activeId = "All";
  // document
  //   .querySelector(`[data-cat-name='${activeId}']`)
  //   .classList.add("activebBtn");
  // getAllProduct();
}
function chooseBest(array) {
  let price = 1000000;
  let rate = 0;
  for (let i = 0; i < array.length; i++) {
    let item = array[i];
    if (item.rating.rate > rate) {
      rate = item.rating.rate;
    }
    if (item.price < price) {
      price = item.price;
    }
  }
  return { price, rate };
}
function addictionVisible(left)
{
let span = document.createElement('span')
span.className = 'aditional-elem'
span.textContent = 'Cart is Empty'
document.querySelector('.container').append(span)
span.style.left = `${left}px`
span.style.animation = 'visibleElem 2s linear;'
setTimeout(()=>
{
document.querySelector('.aditional-elem').remove()
},3000)
}
function addictionVisibleCompare(left)
{
let span = document.createElement('span')
span.className = 'aditional-elem'
span.textContent = 'CompareList is Empty'
document.querySelector('.container').append(span)
span.style.left = `${left}px`
span.style.animation = 'visibleElem 2s linear;'
setTimeout(()=>
{
document.querySelector('.aditional-elem').remove()
},3000)
}
function toLocalStorActiveBtn(name,activeBtn)
{
  localStorage.setItem(name,activeBtn)
}
function toLocalStorProductCart(name,array)
{
  localStorage.setItem(name,JSON.stringify(array))
}