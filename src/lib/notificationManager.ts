export interface NotificationOption {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    redirectUrl?: string;
}

class NotificationManager {
    private swRegistration: ServiceWorkerRegistration | null = null;

    // Inisialisasi Service Worker
    async intialize(): Promise<boolean> {
        if (!('serviceWorker' in navigator) || !('Notification' in window)) {
            console.warn('Service Worker atau Notification API tidak didukung di browser ini.');
        }

        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
            });

            console.log('Service Worker terdaftar dengan scope:', this.swRegistration.scope);

            //Tunggu hingga service worker aktif
            await navigator.serviceWorker.ready;

            return true; 
        } catch (error) {
            console.error('Gagal mendaftarkan Service Worker:', error);
            return false;
        }
    }

    //Minta izin notifikasi
    async requestPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            console.warn('Notification API tidak didukung di browser ini.');
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        if (Notification.permission === 'denied') {
            const permission = await Notification.requestPermission();
            return permission;
        }

        return Notification.permission;
    }

    //Cek Apakah Notifikasi sudah diizinkan
    isPermissionGranted(): boolean {
        return 'Notification' in window && Notification.permission === 'granted';
    }

    // Kirim Notifikasi
    async sendNotification(options: NotificationOption): Promise<void> {
        if (!this.swRegistration) {
            console.warn('Permission Untuk Notifikasi Belum Diberikan');
            return;
        }

        if (!this.swRegistration) {
            await this.intialize();
        }

        if (!this.swRegistration) {
            console.warn('Service Worker TIdak tersedia().');
            return;
        }

        try {
            const notificationOptions: NotificationOptions & { data?: { url: string } } = {
                body: options.body,
                icon: options.icon || '/icon-192x192.png',
                badge: options.badge || '/icon-72x72.png',
                data: {
                    url: options.redirectUrl || window.location.pathname
                }
            };

            await this.swRegistration.showNotification(options.title, notificationOptions);
        } catch (error) {
            console.error('Gagal mengirim notifikasi:', error);
        }
    }

    //helper untuk unregister sevice worker (untuk development/debugging)
    async unregister(): Promise<boolean> {
        if (!this.swRegistration) {
            return false;
        }

        try {
            const result = await this.swRegistration.unregister();
            this.swRegistration = null;
            return result;
        } catch (error) {
            console.error('Error unregistering service worker', error);
            return false;
        }
    }
}

// Export singleton instance
export const notificationManager = new NotificationManager();