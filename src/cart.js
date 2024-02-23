let basket = JSON.parse(localStorage.getItem("data")) || [];
let ShoppingCart = document.getElementById("shopping-cart");
let label = document.getElementById("label");
let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0)
};

// 애플리케이션 로드 시 항상 실행 => 장바구니 수량 계산이 항상 이루어짐
calculation();

let generateCartItems = () => {
    if(basket.length !== 0) {
        return (ShoppingCart.innerHTML = basket
            .map((x) => {
                let { id, item } = x;
                let search = shopItemsData.find((y) => y.id === id) || [];
                return ` 
            <div class="cart-item">
                <img width="100" src=${search.img} alt="" />
                <div class="details">
                    <div class="title-price-x">
                        <h4 class="title-price">
                            <p>${search.name}</p>
                            <p class="cart-item-price">$ ${search.price}</p>
                        </h4>
                        <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
                    </div>

                    <div class="buttons">
                        <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                        <div id=${id} class="quantity">${item}</div>
                        <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                    </div>

                    <h3>$ ${item * search.price}</h3>
                </div>
            </div>
            `;
        }).join(""));
    }
    else {
        ShoppingCart.innerHTML = ``
        label.innerHTML = `
        <h2>장바구니가 비었습니다!</h2>
        <a href="index.html">
            <button class="HomeBtn">홈으로 돌아가기</button>
        </a>
        `
    }
};

generateCartItems();

let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);

    // 물건이 존재하지 않으면 새로 push, 존재하면 수량만 증가 
    if(search === undefined) {
        basket.push({
            id: selectedItem.id,
            item: 1,
        });
    } else {
        search.item += 1;
    }
    
    // update전에 generateCartItems()를 호출하는 이유?
    generateCartItems();  
    update(selectedItem.id);
    localStorage.setItem("data", JSON.stringify(basket));
};

let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);

    // 바구니의 내용이 없으면
    if(search === undefined) return;
    // item이 0으로 떨어지면 함수 종료. 마이너스값 방지
    else if(search.item === 0) return;
    else {
        search.item -= 1;
    }
    
    update(selectedItem.id);
    
    // 필터링 후 generateCartItems() 를 다시 호출하면 x.item이 0인 제품이
    // 제거된 후 다시 렌더링 !!
    basket = basket.filter((x) => x.item !== 0);
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
    let search = basket.find((x) => x.id === id);
    // console.log(search.item);
    document.getElementById(id).innerHTML = search.item;
    calculation();
    TotalAmount();
};

let removeItem = (id) => {
    let selectedItem = id;
    basket = basket.filter((x) => x.id !== selectedItem.id);
    generateCartItems();
    TotalAmount();
    
    localStorage.setItem("data", JSON.stringify(basket));
};

let TotalAmount = () => {
     if (basket.length !== 0) {
        let amount = basket.map((x) => {
            let { item, id } = x;
            let search = shopItemsData.find((y) => y.id === id) || [];
            
            return item * search.price;
        }).reduce((x, y) => x + y, 0);
        // console.log(amount);
        label.innerHTML = `
        <h2>총 결제금액 : $ ${amount}</h2>
        <button class="checkout">결제하기</button>
        <button class="removeAll">카트 비우기</button>
        `;
     } else return;
};

TotalAmount();
