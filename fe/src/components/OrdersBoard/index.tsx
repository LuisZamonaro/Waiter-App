import * as S from './styles'
import { Order } from '../../types/Order'
import { OrderModal } from '../OrderModal'
import { useState } from 'react'
import { api } from '../../utils/api'
import {toast} from 'react-toastify'

interface OrdersBoardProps {
    icon: string
    title: string
    orders: Order[]
    onCancelOrder: (orderId: string) => void
    onChangeOrderStatus: (orderId: string, status: Order['status']) => void
}
//props: (outra maneira sem ser a do objeto)
const OrdersBoard = ({ icon, title, orders, onCancelOrder, onChangeOrderStatus }: OrdersBoardProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<null | Order>(null)
    const [isLoading, setIsLoading] = useState(false)
    function handleOpenModal(order: Order) {
        setIsModalVisible(true)
        setSelectedOrder(order)
    }

    function handleCloseModal() {
        setIsModalVisible(false)
        setSelectedOrder(null)
    }

    async function handleChangeOrderStatus() {
        setIsLoading(true)

        const status = selectedOrder?.status === 'WAITING' ? 'IN_PRODUCTION' : 'DONE'

        await api.patch(`/orders/${selectedOrder?._id}`, {status}) // esse status vem do DB

        toast.success(`O pedido da mesa ${selectedOrder?.table} teve o status alterado!`)
        onChangeOrderStatus(selectedOrder!._id, status)// ! -> assegurar o TS de que a função vai ser executada, pq ele acha que não vai
        setIsLoading(false)
        setIsModalVisible(false)
    }

    async function handleCancelOrder() {
        setIsLoading(true)

        await new Promise(resolve => setTimeout(resolve, 3000))
        await api.delete(`/orders/${selectedOrder?._id}`)

        toast.success(`O pedido da mesa ${selectedOrder?.table} foi cancelado!`)
        onCancelOrder(selectedOrder!._id) // ! -> assegurar o TS de que a função vai ser executada, pq ele acha que não vai
        setIsLoading(false)
        setIsModalVisible(false)
    }
    return (
        <S.Board>
            <OrderModal
            visible={isModalVisible}
            order={selectedOrder}
            onClose={handleCloseModal}
            onCancelOrder={handleCancelOrder}
            isLoading={isLoading}
            onChangeOrderStatus={handleChangeOrderStatus}
            />
            <header>
                <span>{icon}</span>
                <strong>{title}</strong>
                <span>(1)</span>
            </header>
            {orders.length > 0 && (
                <S.OrdersContainer>
                    {orders.map((order) => (
                        <button type='button' key={order._id} onClick={() =>handleOpenModal(order)}>
                            <strong>{order.table}</strong>
                            <span>{order.products.length}</span>
                        </button>
                    ))}
                </S.OrdersContainer>
            )}
        </S.Board>
    )
}

export default OrdersBoard
