// Cross-browser Download notification manager with optimizations
// Compatible with Chrome, Firefox, Edge (Manifest V2)

// Browser API detection for cross-browser compatibility
const browserAPI = (() => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    // Chrome/Edge - promisify APIs for consistency
    const chromeAPI = {
      downloads: {
        onCreated: chrome.downloads.onCreated,
        onChanged: chrome.downloads.onChanged,
        onErased: chrome.downloads.onErased
      },
      permissions: chrome.permissions,
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

class DownloadNotifyManager {
    constructor() {
        this.downloads = new Map(); // Use Map for better performance
        this.lastNotificationTime = 0;
        this.THROTTLE_DELAY = 1000; // 1 second between notifications
        this.MAX_STORED_DOWNLOADS = 100; // Prevent unlimited memory usage
        this.CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
        this.permissionManager = new PermissionManager();
        
        this.init();
    }

    init() {
        // Set up periodic cleanup to prevent memory leaks
        setInterval(() => this.cleanupOldDownloads(), this.CLEANUP_INTERVAL);
        
        // Bind event listeners
        this.bindEvents();
    }

    bindEvents() {
        // Download started listener
        browserAPI.downloads.onCreated.addListener((item) => {
            this.handleDownloadStart(item);
        });

        // Download status changed listener
        browserAPI.downloads.onChanged.addListener((delta) => {
            this.handleDownloadChange(delta);
        });

        // Download erased listener - cleanup when user manually removes from history
        if (browserAPI.downloads.onErased) {
            browserAPI.downloads.onErased.addListener((downloadId) => {
                this.downloads.delete(downloadId);
            });
        }

        // Permission change listener
        if (browserAPI.permissions && browserAPI.permissions.onRemoved) {
            browserAPI.permissions.onRemoved.addListener((permissions) => {
                if (permissions.permissions && permissions.permissions.includes('notifications')) {
                    this.permissionManager.onPermissionRemoved();
                }
            });
        }
    }

    // Throttling: Prevent too many notifications
    shouldShowNotification() {
        const now = Date.now();
        if (now - this.lastNotificationTime < this.THROTTLE_DELAY) {
            return false;
        }
        this.lastNotificationTime = now;
        return true;
    }

    // Memory management: Limit stored downloads
    enforceMemoryLimit() {
        if (this.downloads.size > this.MAX_STORED_DOWNLOADS) {
            // Remove oldest entries (first 10)
            const entriesToRemove = Math.min(10, this.downloads.size - this.MAX_STORED_DOWNLOADS + 10);
            const iterator = this.downloads.keys();
            
            for (let i = 0; i < entriesToRemove; i++) {
                const key = iterator.next().value;
                if (key !== undefined) {
                    this.downloads.delete(key);
                }
            }
        }
    }

    // Cleanup old completed downloads to prevent memory leaks
    cleanupOldDownloads() {
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
        
        for (const [id, data] of this.downloads.entries()) {
            if (data.timestamp < cutoffTime || data.completed) {
                this.downloads.delete(id);
            }
        }
    }

    async handleDownloadStart(item) {
        try {
            // Throttling check
            if (!this.shouldShowNotification()) {
                return;
            }

            // Store download info with timestamp
            this.downloads.set(item.id, {
                filename: item.filename || 'Unknown file',
                timestamp: Date.now(),
                completed: false
            });

            // Enforce memory limits
            this.enforceMemoryLimit();

            // Show notification using permission manager
            await this.permissionManager.createNotification({
                type: "basic",
                iconUrl: browserAPI.runtime.getURL("icons/icon-48.png"),
                title: "Download Started",
                message: item.filename || 'Unknown file'
            });

        } catch (error) {
            console.error('Error in handleDownloadStart:', error);
        }
    }

    async handleDownloadChange(delta) {
        try {
            const downloadData = this.downloads.get(delta.id);
            
            // Only proceed if we have stored data for this download
            if (!downloadData) {
                return;
            }

            // Handle completion
            if (delta.state && delta.state.current === "complete") {
                // Throttling check
                if (!this.shouldShowNotification()) {
                    // Mark as completed but don't show notification due to throttling
                    downloadData.completed = true;
                    return;
                }

                await this.permissionManager.createNotification({
                    type: "basic",
                    iconUrl: browserAPI.runtime.getURL("icons/icon-48.png"),
                    title: "Download Completed",
                    message: downloadData.filename
                });

                // Mark as completed and schedule for cleanup
                downloadData.completed = true;
                setTimeout(() => {
                    this.downloads.delete(delta.id);
                }, 60000); // Remove after 1 minute
            }

            // Handle interruption/failure
            if (delta.state && delta.state.current === "interrupted") {
                if (this.shouldShowNotification()) {
                    await this.permissionManager.createNotification({
                        type: "basic",
                        iconUrl: browserAPI.runtime.getURL("icons/icon-48.png"),
                        title: "Download Failed",
                        message: `${downloadData.filename} - Download interrupted`
                    });
                }

                // Remove failed download after short delay
                setTimeout(() => {
                    this.downloads.delete(delta.id);
                }, 5000);
            }

        } catch (error) {
            console.error('Error in handleDownloadChange:', error);
        }
    }

    // Public method to get current stats (useful for debugging)
    getStats() {
        return {
            activeDownloads: this.downloads.size,
            lastNotification: new Date(this.lastNotificationTime).toISOString(),
            hasNotificationPermission: this.permissionManager.hasNotificationPermission,
            browserType: typeof chrome !== 'undefined' ? 'Chrome-based' : 'Firefox-based'
        };
    }
}

// Initialize the download manager
const downloadManager = new DownloadNotifyManager();

// Cross-browser debug access
if (typeof window !== 'undefined') {
    window.downloadManager = downloadManager;
} else if (typeof self !== 'undefined') {
    self.downloadManager = downloadManager;
}
