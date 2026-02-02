import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: []
    }),
    actions: {
        add(message, type = 'info', duration = 5000) {
            const id = Date.now()
            this.notifications.push({ id, message, type, duration })

            if (duration > 0) {
                setTimeout(() => {
                    this.remove(id)
                }, duration)
            }
            return id
        },
        success(message, duration) {
            return this.add(message, 'success', duration)
        },
        error(message, duration) {
            return this.add(message, 'error', duration)
        },
        info(message, duration) {
            return this.add(message, 'info', duration)
        },
        remove(id) {
            const index = this.notifications.findIndex(n => n.id === id)
            if (index !== -1) {
                this.notifications.splice(index, 1)
            }
        }
    }
})
