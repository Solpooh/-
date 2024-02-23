let shop = document.getElementById('shop');

// let basket = [];
// localStorage에 data가 없을 경우 빈배열
let basket = JSON.parse(localStorage.getItem("data")) || [];

let generateShop = () => {
    return shop.innerHTML = shopItemsData
    .map((x) => {
        let {id, name, price, desc, img} = x; // Object Destructuring
        let search = basket.find((x) => x.id === id) || []
        return `<div id=product-id-${id} class="item">
        <img width="220" src=${img} alt="">
        <div class="details">
            <h3>${name}</h3>
            <p>${desc}</p>
            <div class="price-quantity">
                <h2>$ ${price}</h2>
                <div class="buttons">
                    <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                    <div id=${id} class="quantity">
                    ${search.item === undefined? 0 : search.item}
                    </div>
                    <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                </div>
            </div>
        </div>
    </div>`
    })
    .join("");
}

generateShop();

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

    // console.log(basket);
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
    basket = basket.filter((x) => x.item !== 0);
    // console.log(basket);
    localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
    let search = basket.find((x) => x.id === id);
    // console.log(search.item);
    document.getElementById(id).innerHTML = search.item;
    calculation();
};

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0)
};

// 애플리케이션 로드 시 항상 실행 => 장바구니 수량 계산이 항상 이루어짐
calculation();