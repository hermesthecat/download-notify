// Permission Manager for Download Notify Extension
class PermissionManager {
    constructor() {
        this.hasNotificationPermission = false;
        this.checkPermissions();
    }

    async checkPermissions() {
        try {
            // Check if notifications permission is already granted
            this.hasNotificationPermission = await browser.permissions.contains({
                permissions: ['notifications']
            });
            
            if (!this.hasNotificationPermission) {
                console.info('Notifications permission not granted. Extension will work without notifications.');
            }
        } catch (error) {
            console.warn('Error checking permissions:', error);
            this.hasNotificationPermission = false;
        }
    }

    async requestNotificationPermission() {
        try {
            const granted = await browser.permissions.request({
                permissions: ['notifications']
            });
            
            this.hasNotificationPermission = granted;
            return granted;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    async createNotification(options) {
        // Only create notification if permission is granted
        if (!this.hasNotificationPermission) {
            // Optionally request permission on first use
            const granted = await this.requestNotificationPermission();
            if (!granted) {
                console.info('Notification skipped - permission not granted');
                return null;
            }
        }

        try {
            return await browser.notifications.create(options);
        } catch (error) {
            console.warn('Failed to create notification:', error);
            return null;
        }
    }

    // Graceful permission removal handler
    onPermissionRemoved() {
        this.hasNotificationPermission = false;
        console.info('Notification permission removed. Extension will continue without notifications.');
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PermissionManager;
} else {
    window.PermissionManager = PermissionManager;
} 