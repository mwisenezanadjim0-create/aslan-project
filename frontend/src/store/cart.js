import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: JSON.parse(localStorage.getItem('cartItems')) || [],
        isCartOpen: false
    }),

    getters: {
        totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        isEmpty: (state) => state.items.length === 0
    },

    actions: {
        addItem(product) {
            const existingItem = this.items.find(item => item.id === product.id)
            if (existingItem) {
                existingItem.quantity++
            } else {
                this.items.push({
                    ...product,
                    quantity: 1
                })
            }
            this.saveToStorage()
        },

        removeItem(productId) {
            this.items = this.items.filter(item => item.id !== productId)
            this.saveToStorage()
        },

        updateQuantity(productId, quantity) {
            const item = this.items.find(item => item.id === productId)
            if (item) {
                item.quantity = quantity
                if (item.quantity <= 0) {
                    this.removeItem(productId)
                }
            }
            this.saveToStorage()
        },

        clearCart() {
            this.items = []
            this.saveToStorage()
        },

        toggleCart() {
            this.isCartOpen = !this.isCartOpen
        },

        saveToStorage() {
            localStorage.setItem('cartItems', JSON.stringify(this.items))
        }
    }
})
