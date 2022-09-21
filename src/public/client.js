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
const messageInput = document.querySelector('#messageInput')

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

async function renderProducts(apiData) {

    const response = await fetch('./productos.ejs')
    const plantilla = await response.text()
    
    apiData.forEach(product => {
        const html = ejs.render(plantilla, product)
        document.querySelector('#productos').innerHTML += html
    })
}

getProducts()