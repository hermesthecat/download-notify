// Cross-browser Permission Manager for Download Notify Extension
// Compatible with Chrome, Firefox, Edge (Manifest V2)

// Browser API detection and polyfill
const browserAPI = (() => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    // Chrome/Edge - promisify APIs for consistency
    const chromeAPI = {
      permissions: {
        contains: (permissions) => new Promise((resolve) => {
          chrome.permissions.contains(permissions, resolve);
        }),
        request: (permissions) => new Promise((resolve) => {
          chrome.permissions.request(permissions, resolve);
        }),
        onRemoved: chrome.permissions.onRemoved
      },
      notifications: {
        create: (options) => new Promise((resolve, reject) => {
          chrome.notifications.create(options, (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(result);
            }
          });
        })
      },
      runtime: chrome.runtime
    };
    return chromeAPI;
  } else if (typeof browser !== 'undefined' && browser.runtime) {
    // Firefox - already promisified
    return browser;
  } else {
    throw new Error('Browser API not available');
  }
})();

class PermissionManager {
    constructor() {
        this.hasNotificationPermission = false;
        this.checkPermissions();
    }

    async checkPermissions() {
        try {
            // Check if notifications permission is already granted
            this.hasNotificationPermission = await browserAPI.permissions.contains({
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
            const granted = await browserAPI.permissions.request({
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
            return await browserAPI.notifications.create(options);
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

// Cross-browser export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PermissionManager;
} else if (typeof window !== 'undefined') {
    window.PermissionManager = PermissionManager;
} else {
    // Service worker or other environment
    self.PermissionManager = PermissionManager;
} 