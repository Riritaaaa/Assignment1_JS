const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const data = require("./data.json");
const cart = [];

async function main() {
    while (true) {
        let input = await askQuestion("กรุณาพิมพ์คำสั่ง (ดูรายการสินค้า, ดูประเภทสินค้า, เพิ่มสินค้าในตะกร้า, ลบสินค้าในตะกร้า, แสดงสินค้าในตะกร้า) : ");
        if (input === 'ดูรายการสินค้า') {
            console.table(data);
        } else if(input === 'ดูประเภทสินค้า'){
            const cateShow = {};
            data.forEach(cat => {
                const category = cat.category;
                if(!cateShow[category]){
                    cateShow[category] = 0;
                }
                cateShow[category] += 1;
            });
            const cateShowTable = Object.keys(cateShow).map((category) => ({
                category: category,
                amount: cateShow[category]
            }))
            console.table(cateShowTable);

        } else if (input.startsWith('เพิ่มสินค้าในตะกร้า')) {
            const parts = input.trim().split(' ');
            if (parts.length === 2) {
                const productId = parts[1]; 
                const product = data.find(item => item.product_id === productId);
                if (product) {
                    product.balance--;
                    console.log(`เพิ่มสินค้า ${product.name} สำเร็จ`);
                    addToCart(product);
                } else {
                    console.log(`ไม่พบสินค้า`);
                }
            } else {
                console.log(`ไม่พบสินค้า`);
            }

        } else if (input.startsWith('ลบสินค้าในตะกร้า')) {
            const parts = input.trim().split(' ');
            if (parts.length === 2) {
                const productId = parts[1]; 
                const product = data.find(item => item.product_id === productId);
                if (product) {
                    removeFromCart(product);
                } else {
                    console.log(`ไม่พบสินค้าในตะกร้า`);
                }
            } else {
                console.log(`ไม่พบสินค้าในตะกร้า`);
            }

        } else if(input === 'แสดงสินค้าในตะกร้า'){
            console.table([...cart, calTotal()]); 
        } else {
            console.log(`คำสั่งไม่ถูกต้อง`)
        }
    }
    rl.close();
}

function askQuestion(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer);
        });
    });
}

function addToCart(product) {
    const index = cart.findIndex(item => item.name === product.name);
    if (index !== -1) {
        cart[index].amount++;
        cart[index].all_price += product.price;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            amount: 1,
            all_price: product.price
        });
    }
}

function removeFromCart(product) {
    const index = cart.findIndex(item => item.name === product.name);
    if (index !== -1) {
        product.balance++;
        console.log(`ลบ ${product.name} สำเร็จ`);
        cart[index].amount--;
        cart[index].all_price -= product.price;
        if (cart[index].amount === 0) {
            cart.splice(index, 1);
        }
    }
}

function calTotal() {
    let totalAmount = 0;
    let totalPrice = 0;
    for (const item of cart) {
        totalAmount += item.amount;
        totalPrice += item.all_price;
    }
    return { name: 'รวม', price: '', amount: '', all_price: totalPrice };
}

data.forEach(item => {
    item.balance = item.quantity - (item.cart_item || 0);
});

main();
