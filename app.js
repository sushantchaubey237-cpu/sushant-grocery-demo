const sampleProducts=[
 {id:1,name:'Sugar',category:'Grocery',price:45,unit:'1 kg',emoji:'🍚'},
 {id:2,name:'Wheat Flour',category:'Grocery',price:38,unit:'1 kg',emoji:'🌾'},
 {id:3,name:'Mustard Oil',category:'Oil',price:145,unit:'1 litre',emoji:'🫙'},
 {id:4,name:'Arhar Dal',category:'Grocery',price:125,unit:'1 kg',emoji:'🫘'},
 {id:5,name:'Bath Soap',category:'Personal Care',price:32,unit:'1 piece',emoji:'🧼'},
 {id:6,name:'Detergent',category:'Household',price:85,unit:'1 pack',emoji:'🧺'}
];
let cart=JSON.parse(localStorage.getItem('sg-cart')||'{}');let orders=JSON.parse(localStorage.getItem('sg-orders')||'[]');
const $=id=>document.getElementById(id);const money=n=>'₹'+n;
function save(){localStorage.setItem('sg-cart',JSON.stringify(cart));localStorage.setItem('sg-orders',JSON.stringify(orders))}
function renderProducts(){const q=$('search').value.toLowerCase(),cat=$('category').value;const list=sampleProducts.filter(p=>(cat==='all'||p.category===cat)&&(p.name.toLowerCase().includes(q)));$('products').innerHTML=list.map(p=>`<article class="product"><div class="emoji">${p.emoji}</div><h3>${p.name}</h3><div class="muted">${p.unit} · ${p.category}</div><div class="price">${money(p.price)}</div><button class="primary" onclick="add(${p.id})">Add to cart</button></article>`).join('')||'No products found.'}
function add(id){cart[id]=(cart[id]||0)+1;save();renderCart()}function change(id,d){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];save();renderCart()}
function renderCart(){let ids=Object.keys(cart);$('cartItems').innerHTML=ids.length?ids.map(id=>{let p=sampleProducts.find(x=>x.id==id),n=cart[id];return `<div class="cart-row"><span>${p.emoji} ${p.name} · ${money(p.price*n)}</span><span class="qty"><button onclick="change(${id},-1)">−</button> ${n} <button onclick="change(${id},1)">+</button></span></div>`}).join(''):'Your cart is empty.';$('total').textContent=money(ids.reduce((s,id)=>s+sampleProducts.find(p=>p.id==id).price*cart[id],0))}
$('search').addEventListener('input',renderProducts);$('category').addEventListener('change',renderProducts);$('clearCart').onclick=()=>{cart={};save();renderCart()};
$('checkout').addEventListener('submit',e=>{e.preventDefault();if(!Object.keys(cart).length){$('message').textContent='Please add a product first.';return}let f=new FormData(e.target),items=Object.keys(cart).map(id=>({name:sampleProducts.find(p=>p.id==id).name,qty:cart[id]}));orders.unshift({id:Date.now(),customer:f.get('customer'),phone:f.get('phone'),fulfilment:f.get('fulfilment'),payment:f.get('payment'),items,total:Object.keys(cart).reduce((s,id)=>s+sampleProducts.find(p=>p.id==id).price*cart[id],0),status:'Received'});cart={};save();renderCart();e.target.reset();$('message').textContent='Demo order placed! Check Owner panel.'});
function renderOwner(){if(!orders.length){$('ownerOrders').textContent='No orders yet.';return}$('ownerOrders').innerHTML=orders.map(o=>`<article class="product" style="margin:10px 0"><b>Order #${String(o.id).slice(-6)} · ${o.customer}</b><p>${o.items.map(i=>i.name+' × '+i.qty).join(', ')}</p><p>${o.phone} · ${o.fulfilment} · ${o.payment}</p><b>${money(o.total)}</b><p>Status: <select onchange="setStatus(${o.id},this.value)">${['Received','Preparing','Ready','Completed'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></p></article>`).join('')}
function setStatus(id,status){orders=orders.map(o=>o.id===id?{...o,status}:o);save();renderOwner()}
$('ownerToggle').onclick=()=>{let pin=prompt('Enter demo owner PIN (2468)');if(pin==='2468'){$('customerView').hidden=true;$('ownerView').hidden=false;renderOwner()}else if(pin!==null)alert('Incorrect demo PIN')};$('backCustomer').onclick=()=>{$('ownerView').hidden=true;$('customerView').hidden=false};
renderProducts();renderCart();if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
