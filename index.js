// Productos en stock //
let stockProductos = [
    {id: 1, nombre: "Mate Thor", tipo: "mate", cantidad: 1, desc: "Mate de el Dios del Trueno", precio: 900, img: '../img/matethor.jpg'},
    {id: 2, nombre: "Mate Hogwarts", tipo: "mate", cantidad: 1, desc: "Mate de la escuela de magia", precio: 1400, img: '../img/hogwartsmate.jpg'},
    {id: 3, nombre: "Mate Minion", tipo: "mate", cantidad: 1, desc: "Mate de los Minions", precio: 900, img: '../img/mateminion.jpg'},
    {id: 4, nombre: "Mate Baby Yoda", tipo: "mate", cantidad: 1, desc: "Mate de Baby Yoda", precio: 950, img: '../img/mateyoda.jpg'},
    {id: 5, nombre: "Taza Peppa", tipo: "taza", cantidad: 1, desc: "Taza de Peppa Pig", precio: 1200, img: '../img/peppataza.jpg'},
    {id: 6, nombre: "Taza Bob Esponja", tipo: "taza", cantidad: 1, desc: "Taza de Bob Esponja", precio: 1300, img: '../img/bobtaza.jpg'},
    {id: 7, nombre: "Taza Stitch", tipo: "taza", cantidad: 1, desc: "Taza del personaje Stitch", precio: 1400, img: '../img/tazastitch.jpg'},
    {id: 8, nombre: "Taza Unicornio", tipo: "taza", cantidad: 1, desc: "Taza de Unicornio", precio: 1000, img: '../img/mateUnicornio.jpg'},
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
        title: 'Est?? seguro que desea eliminar el carrito?',
        text: "??No ser?? posible revertir esta acci??n!",
        icon: 'warning' ,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'S??, deseo eliminarlo!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Eliminado!',
            'Tu carrito ahora se encuentra vac??o',
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
  title: '??Bienvenido a Impresi??n 3D!',
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


























/* 
let producto = [
    {  id: 1, nombre: 'Taza 3D', precio: 500},
    {  id: 2, nombre: 'Mate 3D', precio: 150},
    {  id: 3, nombre: 'Lampara 3D', precio: 130},
    {  id: 4, nombre: 'Tapiz macrame', precio: 200},
    {  id: 5, nombre: 'Espejo macrame', precio: 150}

];
let carrito = []

let seleccion = prompt("Desea comprar alg??n producto ??si o no?")

while(seleccion != "si" && seleccion != "no"){
    alert ("Por favor ingrese si o no")
    seleccion = prompt("Desea comprar alg??n producto ??si o no?")
}

if (seleccion == "si"){
    alert("A continuaci??n nuestro stock")
    let todoslosProductos = producto.map((producto)=> producto.nombre + " " + producto.precio + "$") 
    alert(todoslosProductos.join (" - "))
}else if (seleccion == "no"){
    alert("Gracias por visitar nuestra tienda, hasta pronto!")
}

while (seleccion != "no"){
    let producto = prompt("Agrega un producto a tu carrito")
    let precio = 0

    if(producto == "Mate 3D" || producto == "Taza 3D" || producto == "Lampara 3D" || producto == "Tapiz macrame" || producto == "Espejo macrame"){
        switch(producto){
            case "Mate 3D":
            precio = 500
            break

            case "Taza 3D":
                precio = 150
                break;

            case "Lampara 3D":
                precio = 130
                break;
            case "Tapiz macrame":
                precio = 200
                break;    
            case "Mate 3D":
                precio = 150
                break;
                
            default:
                break;    
        }
     let unidades = parseInt(prompt ("??Cu??ntas unidades quiere llevar"))

     carrito.push ({producto, unidades, precio})
    }else{
        alert("No contamos en stock ese producto")
    }

    seleccion = prompt ("Desea comprar otro producto?")
    while (seleccion == "no"){
        alert("Gracias por su compra")
        carrito.forEach((carritoFinal) => {
            console.log(`producto: ${carritoFinal.producto}, unidades: ${carritoFinal.unidades}, total a pagar por producto ${carritoFinal.unidades * carrifoFinal.precio}`);
        }) 
    break;    
    }
}

const total = carrito.reduce((acc, el) => acc + el.precio * el.unidades, 0)

alert(`El total a pagar es: ${total}`); */