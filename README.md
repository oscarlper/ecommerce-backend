# Ecommerce-Backend Entrega Final 

## Listar todos los productos (GET)

http://localhost:3000/api/productos/

## Listar un producto por id (GET)

http://localhost:3000/api/productos/[id_prod]

## Listar productos por Categoria (GET)

http://localhost:3000/api/productos/[cat]/category

## Crear un nuevo producto (POST)

```

    timestamp
    code
    title
    thumbnail
    stock
    price
    category

```

## Borrar un producto por id (DELETE)

http://localhost:3000/api/productos/[id_prod]

## Actualizar un producto por id (PUT)

```

    timestamp
    code
    title
    thumbnail
    stock
    price
    category

```

## Agregar un producto al carrito por id (POST)

localhost:3000/api/carrito/[id_cart]/productos

```

    timestamp_prod
    id_prod
    stock
    cant

```

## Quitar un producto del carrito por id_cart e id_prod (DELETE)

localhost:3000/api/carrito/[id_cart]/productos/[id_prod]

## Crea un nuevo carrito (POST)

localhost:3000/api/carrito

```

    timestamp_cart
    timestamp_prod
    id_prod
    stock
    cant

```

## Elimina un carrito por id (DELETE)

http://localhost:3000/api/carrito/[id_cart]

## Carrito checkout (GET)

http://localhost:3000/api/carrito/checkout

```

    username
    fullname
    telephone

```