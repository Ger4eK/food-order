import { useContext, useState } from 'react';
import CartContext from '../../store/cart-context';
import Modal from '../UI/Modal/Modal';
import classes from './Cart.module.css';
import CartItem from './CartItem/CartItem';
import Checkout from './Checkout/Checkout';

const Cart = (props) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };
  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={() => cartItemRemoveHandler(item.id)}
          onAdd={() => cartItemAddHandler(item)}
        />
      ))}
    </ul>
  );

  const orderHandler = () => {
    setIsCheckingOut(true);
  };

  //! Here we wanna wait for this fetch function to finish.
  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    await fetch(
      'https://react-http-9066a-default-rtdb.firebaseio.com/orders.json',
      {
        method: 'POST',
        body: JSON.stringify({
          user: userData,
          orderedItems: cartCtx.items,
        }),
      }
    );
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && (
        <>
          {cartItems}
          <div className={classes.total}>
            <span>Total Amount</span>
            <span>{totalAmount}</span>
          </div>
          {isCheckingOut && (
            <Checkout
              onCancel={props.onClose}
              submitOrderHandler={submitOrderHandler}
            />
          )}
          {!isCheckingOut && (
            <div className={classes.actions}>
              <button
                className={classes['button--alt']}
                onClick={props.onClose}
              >
                Close
              </button>
              {hasItems && (
                <button className={classes.button} onClick={orderHandler}>
                  Order
                </button>
              )}
            </div>
          )}
        </>
      )}
      {isSubmitting && <p>Sending order data...</p>}
      {!isSubmitting && didSubmit && (
        <>
          <p>Successfully sent the order!</p>
          <div className={classes.actions}>
            <button className={classes['button--alt']} onClick={props.onClose}>
              Close
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default Cart;
