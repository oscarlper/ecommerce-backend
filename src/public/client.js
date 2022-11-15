const formProduct = document.querySelector('#formProduct')
const titleInput = document.querySelector('#titleInput')
const priceInput = document.querySelector('#priceInput')
const thumbnailInput = document.querySelector('#thumbnailInput')

const formMessage = document.querySelector('#formMessage')
const idInput = document.querySelector('#idInput')
const nombreInput = document.querySelector('#nombreInput')
const apellidoInput = document.querySelector('#apellidoInput')
const edadInput = document.querySelector('#edadInput')
const aliasInput = document.querySelector('#aliasInput')
const avatarInput = document.querySelector('#avatarInput')
const totargetMsgInput = document.querySelector('#targetMsgInput')
const messageInput = document.querySelector('#messageInput')
let messageHistory;

async function getProducts() {

    const apiURLProductos = "/api/productos";
    $.ajax({
        dataType: "json",
        method: "GET",
        url: apiURLProductos,
        success: function(apiData) {
            renderProducts(apiData);
        }
    })
}

async function getCart() {

    const apiURLProductos = "/api/carrito/username";
    $.ajax({
        dataType: "json",
        method: "GET",
        url: apiURLProductos,
        success: function(apiDataCart) {
            renderCart(apiDataCart);
        }
    })
}

async function renderProducts(apiData) {

    const response = await fetch('./productos.ejs')
    const plantilla = await response.text()
    
    apiData.forEach(product => {
        const html = ejs.render(plantilla, product)
        document.querySelector('#productos').innerHTML += html
    })
}

async function renderCart(apiDataCart) {

    const response = await fetch('./cartitems.ejs')
    const plantilla = await response.text()

    apiDataCart[0].products.forEach(item => {
        const html = ejs.render(plantilla, item)
        document.querySelector('#cartItems').innerHTML += html
    })
}

//getProducts()
//getCart()

//CHAT

const socket = io()

function renderChat(messageInput) {
    try {
        const html = messageInput.map(messageValue => {
            if ((document.getElementById('myMsgInput').value) == "Solo mis mensajes") {
                if (messageValue.author.id == idInput.value || messageValue.targetMsg == idInput.value) {
                    return(`<div>
                    <div><span class=text-primary style='font-size:0.65rem; font-weight: bold'>${messageValue.author.timestamp} - 
                    <span style='font-size:0.75rem; color: brown;font-weight: normal'>${messageValue.author.id}: </span></span>
                    <em class="text-success text-wrap" style="width: 24rem;">${messageValue.text}</em>`)
                } 
            } else {       
                    return(`<div>
                    <div><span class=text-primary style='font-size:0.65rem; font-weight: bold'>${messageValue.author.timestamp} - 
                    <span style='font-size:0.75rem; color: brown;font-weight: normal'>${messageValue.author.id}: </span></span>
                    <em class="text-success text-wrap" style="width: 24rem;">${messageValue.text}</em>`)
            }
        }).join(" ");
        areaChat.innerHTML = html
    } catch(error) {
        console.log(`Hubo un error ${error}`)
    }
}

$('#myMsgInput').change(function(){
    renderChat(messageHistory);
});

formMessage.addEventListener('submit', eventChat => {
    eventChat.preventDefault()
    submitMessage()
})

function submitMessage() {
    try {
        const newDate = new Date();
        const dateMark = newDate.toLocaleString()
        const id = idInput.value
        const nombre = nombreInput.value
        const apellido = apellidoInput.value
        const edad = edadInput.value
        const alias = aliasInput.value
        const avatar = avatarInput.value
        const targetMsg = targetMsgInput.value
        const message = messageInput.value

        socket.emit('server:chat', {dateMark,id,nombre,apellido,edad,alias,avatar,targetMsg,message})
    } catch(error) {
        console.log(`Hubo un error ${error}`)
    }
}
socket.on('server:chat', messageInput => {
    document.querySelector('#areaChat').innerHTML=""
    messageHistory = messageInput;
    renderChat(messageInput)
})