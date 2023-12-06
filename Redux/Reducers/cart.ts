import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface CartItem {
  productId: number;
  quantity: number;
  subTotal: number;
  name: string | undefined;
  note: string | undefined;
  photos: string | undefined;
  basePrice: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartItemQuantity(state, action: PayloadAction<CartItem>) {
      const {productId, quantity, subTotal, name, photos, basePrice, note} =
        action.payload;
      const itemToUpdate = state.items.find(
        item => item.productId === productId,
      );
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
        itemToUpdate.subTotal = subTotal;
        itemToUpdate.note = note;
      } else {
        state.items.push({
          productId,
          quantity,
          subTotal,
          name,
          photos,
          basePrice,
          note,
        });
      }
    },
    clearCart: () => initialState,
  },
});

export const {updateCartItemQuantity, clearCart} = cartSlice.actions;

export default cartSlice.reducer;
