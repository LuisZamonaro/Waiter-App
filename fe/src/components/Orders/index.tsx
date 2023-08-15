import { useEffect, useState } from 'react'
import { Order } from '../../types/Order'
import OrdersBoard from '../OrdersBoard'
import * as S from './styles'
import { api } from '../../utils/api'
import socketIo from 'socket.io-client'

const Orders = () => {

    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
       const socket = socketIo('http://localhost:3001', {
        transports: ['websocket'],
       })

        socket.on('orders@new', (order) => {                       //detalhes do pedido
            // console.log('Novo pedido cadastrado no banco de dados!', order)
            setOrders(prevState => prevState.concat(order))
        })
        // função de clean up para evitar bug // evitar acumulo de listner para não duplicar
        return () => {
            socket.off('orders@new')
        }
    }, [])

    // disparar a request e carregar os pedidos
    useEffect(() => {
        api.get('/orders').then(({data}) => {
            setOrders(data)
        })
    }, [])

    const waiting = orders.filter((order) => order.status === 'WAITING')
    const inProduction = orders.filter((order) => order.status === 'IN_PRODUCTION')
    const done = orders.filter((order) => order.status === 'DONE')

    function handleCancelOrder(orderId: string) {
        setOrders((prevState) => prevState.filter(order => order._id !== orderId)) // pegar os pedidos, filtrar mantendo apenas os pedidos que tiverem os id diferente do pedido deletado
    }

    function handleOrderStatusChange(orderId: string, status: Order['status']) { // saber qual é o ID da ordem que teve o status alterado
        setOrders((prevState) => prevState.map((order) => (
            order._id === orderId ? {...order, status } : order
        )))
    }

    return (
        <S.Container>
            <OrdersBoard
                icon="🕔"
            title="Fila de espera"
            orders={waiting}
            onCancelOrder={handleCancelOrder}
            onChangeOrderStatus={handleOrderStatusChange}
            />
            <OrdersBoard
                icon="👨‍🍳"
            title="Em preparação"
            orders={inProduction}
            onCancelOrder={handleCancelOrder}
            onChangeOrderStatus={handleOrderStatusChange}
            />
            <OrdersBoard
                icon="✔"
            title="Pronto!"
            orders={done}
            onCancelOrder={handleCancelOrder}
            onChangeOrderStatus={handleOrderStatusChange}
            />
        </S.Container>
    )
}

export default Orders
