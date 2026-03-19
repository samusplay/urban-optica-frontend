
export interface CartItem {
    //datos que se envian
    productId: number
    cantidad: number
    prescriptionId?: number | null

    //datos visuales para el frontend
    nombreProducto:string
    imagenProducto:string
    precioUnitario:number

    //seguridad para manetener la atomicidad
    stockDisponible:number
}

//lo que enviamos a spring boot utilytpe types
export type OrderItemRequestDto=Pick<CartItem,'productId'|'cantidad'|'prescriptionId'>