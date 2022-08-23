// Productos en stock //
let stockProductos = [
    {id: 1, nombre: "Hoja sujetador", tipo: "sujetador", cantidad: 1, desc: "Sujetador de cortinas", precio: 600, img: '../img/sujeta.jpg'},
    {id: 2, nombre: "Cuello termico", tipo: "cuello", cantidad: 1, desc: "Cuellito de lana termico", precio: 800, img: '../img/cuellito.jpg'},
    {id: 3, nombre: "Canastas Macramé", tipo: "canasta", cantidad: 1, desc: "Canastas hechas en macramé", precio: 1200, img: '../img/canastasv3.jpg'},
    {id: 4, nombre: "Espejo Macramé", tipo: "espejo", cantidad: 1, desc: "Espejo de 30cm en macramé", precio: 2200, img: '../img/espejomacrame.jpg'},
    {id: 5, nombre: "Manta", tipo: "manta", cantidad: 1, desc: "Manta de lana suave", precio: 4500, img: '../img/manta.jpg'},
    {id: 6, nombre: "Cartera de Rafia", tipo: "cartera", cantidad: 1, desc: "Cartera de Rafia", precio: 2500, img: '../img/carterarafia.jpg'},
    {id: 7, nombre: "Centro de mesa", tipo: "centro", cantidad: 1, desc: "Centro de mesa de algodón de 20cm", precio: 900, img: '../img/centrodemesa.jpg'},
    {id: 8, nombre: "Centro de mesa en algodón", tipo: "centro", cantidad: 1, desc: "Centro de mesa de algodón de 30cm", precio: 1400, img: '../img/centrodemesav2.jpg'},
]


// Constantes para interactuar con el html //

const contenedorProductos = document.getElementById('contenedor-productos')

const contenedorCarrito = document.getElementById('carrito-contenedor')

const botonVaciar = document.getElementById('vaciar-carrito')
const botonMp = document.getElementById ('pagar')
const contadorCarrito = document.getElementById('contadorCarrito')
const cantidad = document.getElementById('cantidad')
const precioTotal = document.getElementById('precioTotal')
const cantidadTotal = document.getElementById('cantidadTotal')

let carrito = []

document.addEventListener ('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})

botonVaciar.addEventListener('click', () => {
    carrito.length = 0
    actualizarCarrito()
    Swal.fire({
        title: 'Está seguro que desea eliminar el carrito?',
        text: "¡No será posible revertir esta acción!",
        icon: 'warning' ,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, deseo eliminarlo!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Eliminado!',
            'Tu carrito ahora se encuentra vacío',
            'success'
          )
        }
      })
})


stockProductos.forEach((producto) => {
    const div = document.createElement('div')
    div.classList.add('producto')
    div.innerHTML = `
    <img src=${producto.img} alt= "">
    <h4>${producto.nombre}</h4>
    <p>${producto.desc}</p>
    <p class="precioProducto">Precio: $${producto.precio}</p>
    <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>

    `
    contenedorProductos.appendChild(div)


    const boton = document.getElementById(`agregar${producto.id}`)

    boton.addEventListener('click', () => {
        //Agregar al carrito con la id del producto
        agregarAlCarrito(producto.id)
        //
    })
})


const agregarAlCarrito = (prodId) => {

    //Aumentar la cantidad sin que se repita y comprobar si existe el producto en el carro
    const existe = carrito.some (prod => prod.id === prodId)

    if (existe){
        const prod = carrito.map (prod => { 

            if (prod.id === prodId){
                prod.cantidad++
            }
        })
    } else {
        const item = stockProductos.find((prod) => prod.id === prodId)

        carrito.push(item)
    }

    actualizarCarrito() 
    
}


const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId)

    const indice = carrito.indexOf(item) 

    carrito.splice(indice, 1) 

    actualizarCarrito() 
    
    console.log(carrito)
}

const actualizarCarrito = () => {

    contenedorCarrito.innerHTML = "" 

    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `

        contenedorCarrito.appendChild(div)

        localStorage.setItem ('carrito', JSON.stringify(carrito))

    })

    contadorCarrito.innerText = carrito.length // actualiza la longitud del carro

    console.log(carrito)
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)
    //Por cada producto recorrido sumo con la propiedad precio arrancando en 0//

}

let timerInterval
Swal.fire({
  title: '¡Bienvenido a Decoración!',
  html: '',
  timer: 1000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading()
    const b = Swal.getHtmlContainer().querySelector('b')
    timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft()
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log('I was closed by the timer')
  }
})


// Api MP // 

botonMp.addEventListener('click', e => comprar())

const comprar = async () => {
    
    const productosToMap = stockProductos.map(Element => {
        let newElement = {
            title: Element.nombre,
            description: Element.desc,
            picture_url: Element.img,
            category_id: Element.id,
            quantity: Element.cantidad,
            currency_id: "ARS",
            unit_price: Element.precio
        }
        return newElement
    })
    
    let response = await fetch('https://api.mercadopago.com/checkout/preferences',{
        method: "POST",
        headers: {
            Authorization: "Bearer TEST-4635163528194726-081114-fc27789a4240cbaa92069e5ed091c8a5-1071307545"
        },
        body: JSON.stringify({
            items: productosToMap
        })

    })

    let data = await response.json()

    window.open(data.init_point, "_blank")

    console.log(data);
}
