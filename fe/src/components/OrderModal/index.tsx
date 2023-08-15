import * as S from './styles'
import closeIcon from '../../assets/images/close-icon.svg'
import { Order } from '../../types/Order'
import { formatCurrency } from '../../utils/formatCurrency'
import {useEffect} from 'react'

interface OrderModalProps {
    visible: boolean
    order: Order | null
    onClose: () => void // como ela n tem retorno, é void
    onCancelOrder: () => Promise<void>
    isLoading: boolean
    onChangeOrderStatus: () => void
}

export function OrderModal({ visible, order, onClose, onCancelOrder, isLoading, onChangeOrderStatus }: OrderModalProps) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if(event.key === 'Escape') { // escape é Esc em si
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose])

    if (!visible || !order) {
        return null
    }

    //forma não recomendável:
    // let total = 0
    // order.products.forEach(({product, quantity}) => {
    //     total += product.price * quantity
    // })

    // a outra forma                   //este total é um acumulador
    const total = order.products.reduce((total, {product, quantity}) => {
        return total + (product.price * quantity)
    }, 0)
    //o 0 é o valor inicial

    return (
        <S.Overlay>
            <S.ModalBody>
                <header>
                    <strong>Mesa 2</strong>
                    <button type='button' onClick={onClose}>
                        <img src={closeIcon} alt="Icon close" />
                    </button>
                </header>
                <div className="status-container">
                    <small>Status do pedido</small>
                    <div>
                        <span>
                            {order.status === 'WAITING' && '🕔'}
                            {order.status === 'IN_PRODUCTION' && '👨‍🍳'}
                            {order.status === 'DONE' && '✔'}
                        </span>
                        <strong>
                            {order.status === 'WAITING' && 'Fila de espera'}
                            {order.status === 'IN_PRODUCTION' && 'Em produção'}
                            {order.status === 'DONE' && 'Pronto!'}
                        </strong>
                    </div>
                </div>
                <S.OrderDetails>
                    <strong>Itens</strong>
                    <div className="order-items">
                        {order.products.map(({ _id, product, quantity }) => (
                            <div className="item" key={_id}>
                                <img src={`http://localhost:3001/uploads/${product.imagePath}`} alt={product.name}
                                    width='56'
                                    height='28.51' />

                                <span className='quantity'>{quantity}x</span>
                                <div className="product-details">
                                    <strong>{product.name}</strong>
                                    <span>{formatCurrency(product.price)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="total">
                        <span>Total</span>
                        {/*forma não recomendável:
                        <strong>{formatCurrency(total)}</strong> */}
                        <strong>{formatCurrency(total)}</strong>
                    </div>
                </S.OrderDetails>
                <S.Actions>
                   {order.status !== 'DONE' && (
                     <button disabled={isLoading} onClick={onChangeOrderStatus} type='button' className='primary'>
                     <span>
                        {order.status === 'WAITING' && '👨‍🍳'}
                        {order.status === 'IN_PRODUCTION' && '✔'}
                     </span>
                     <span>
                        {order.status === 'WAITING' && 'Iniciar Produção'}
                        {order.status === 'IN_PRODUCTION' && 'Concluir Pedido'}
                        </span>
                 </button>
                   )}
                    <button onClick={onCancelOrder} disabled={isLoading} type='button' className='secundary'>
                        <span>Cancelar pedido</span>
                    </button>
                </S.Actions>
            </S.ModalBody>
        </S.Overlay>
    )
}
