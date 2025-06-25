// Manifest V3 Service Worker for Download Notify Extension
// Cross-browser compatible (Chrome, Firefox, Edge)

// Browser API polyfill for cross-browser compatibility
const browserAPI = (() => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    return chrome;
  } else if (typeof browser !== 'undefined' && browser.runtime) {
    return browser;
  } else {
    throw new Error('Browser API not available');
  }
})();

// Permission Manager for Manifest V3
class PermissionManagerV3 {
  constructor() {
    this.hasNotificationPermission = false;
    this.init();
  }

  async init() {
    await this.checkPermissions();
  }

  async checkPermissions() {
    try {
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
    if (!this.hasNotificationPermission) {
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

  onPermissionRemoved() {
    this.hasNotificationPermission = false;
    console.info('Notification permission removed. Extension will continue without notifications.');
  }
}

// Download Manager for Manifest V3 with persistent storage
class DownloadNotifyManagerV3 {
  constructor() {
    this.THROTTLE_DELAY = 1000;
    this.MAX_STORED_DOWNLOADS = 100;
    this.CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
    this.permissionManager = new PermissionManagerV3();
    
    this.init();
  }

  async init() {
    // Initialize permission manager
    await this.permissionManager.init();
    
    // Set up periodic cleanup using alarms (service worker compatible)
    this.setupCleanupAlarm();
    
    // Bind event listeners
    this.bindEvents();
    
    // Clean up on startup
    await this.cleanupOldDownloads();
  }

  setupCleanupAlarm() {
    // Create a repeating alarm for cleanup
    browserAPI.alarms.create('cleanup-downloads', {
      delayInMinutes: 5,
      periodInMinutes: 5
    });
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

    // Download erased listener
    if (browserAPI.downloads.onErased) {
      browserAPI.downloads.onErased.addListener((downloadId) => {
        this.removeDownloadData(downloadId);
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

    // Alarm listener for cleanup
    browserAPI.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'cleanup-downloads') {
        this.cleanupOldDownloads();
      }
    });
  }

  // Use chrome.storage for persistent data in service workers
  async getStorageData() {
    try {
      const result = await browserAPI.storage.local.get(['downloads', 'lastNotificationTime']);
      return {
        downloads: new Map(result.downloads || []),
        lastNotificationTime: result.lastNotificationTime || 0
      };
    } catch (error) {
      console.error('Error getting storage data:', error);
      return {
        downloads: new Map(),
        lastNotificationTime: 0
      };
    }
  }

  async setStorageData(downloads, lastNotificationTime) {
    try {
      await browserAPI.storage.local.set({
        downloads: Array.from(downloads.entries()),
        lastNotificationTime: lastNotificationTime
      });
    } catch (error) {
      console.error('Error setting storage data:', error);
    }
  }

  async shouldShowNotification() {
    const { lastNotificationTime } = await this.getStorageData();
    const now = Date.now();
    
    if (now - lastNotificationTime < this.THROTTLE_DELAY) {
      return false;
    }
    
    // Update last notification time
    const { downloads } = await this.getStorageData();
    await this.setStorageData(downloads, now);
    return true;
  }

  async enforceMemoryLimit(downloads) {
    if (downloads.size > this.MAX_STORED_DOWNLOADS) {
      const entriesToRemove = Math.min(10, downloads.size - this.MAX_STORED_DOWNLOADS + 10);
      const iterator = downloads.keys();
      
      for (let i = 0; i < entriesToRemove; i++) {
        const key = iterator.next().value;
        if (key !== undefined) {
          downloads.delete(key);
        }
      }
    }
    return downloads;
  }

  async cleanupOldDownloads() {
    try {
      const { downloads, lastNotificationTime } = await this.getStorageData();
      const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
      
      for (const [id, data] of downloads.entries()) {
        if (data.timestamp < cutoffTime || data.completed) {
          downloads.delete(id);
        }
      }
      
      await this.setStorageData(downloads, lastNotificationTime);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  async removeDownloadData(downloadId) {
    try {
      const { downloads, lastNotificationTime } = await this.getStorageData();
      downloads.delete(downloadId);
      await this.setStorageData(downloads, lastNotificationTime);
    } catch (error) {
      console.error('Error removing download data:', error);
    }
  }

  async handleDownloadStart(item) {
    try {
      if (!(await this.shouldShowNotification())) {
        return;
      }

      const { downloads, lastNotificationTime } = await this.getStorageData();
      
      // Store download info
      downloads.set(item.id, {
        filename: item.filename || 'Unknown file',
        timestamp: Date.now(),
        completed: false
      });

      // Enforce memory limits
      const limitedDownloads = await this.enforceMemoryLimit(downloads);
      await this.setStorageData(limitedDownloads, lastNotificationTime);

      // Show notification
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
      const { downloads, lastNotificationTime } = await this.getStorageData();
      const downloadData = downloads.get(delta.id);
      
      if (!downloadData) {
        return;
      }

      // Handle completion
      if (delta.state && delta.state.current === "complete") {
        if (await this.shouldShowNotification()) {
          await this.permissionManager.createNotification({
            type: "basic",
            iconUrl: browserAPI.runtime.getURL("icons/icon-48.png"),
            title: "Download Completed",
            message: downloadData.filename
          });
        }

        // Mark as completed and schedule for cleanup
        downloadData.completed = true;
        downloads.set(delta.id, downloadData);
        await this.setStorageData(downloads, lastNotificationTime);

        // Remove after delay using alarm
        browserAPI.alarms.create(`cleanup-${delta.id}`, {
          delayInMinutes: 1
        });
      }

      // Handle interruption/failure
      if (delta.state && delta.state.current === "interrupted") {
        if (await this.shouldShowNotification()) {
          await this.permissionManager.createNotification({
            type: "basic",
            iconUrl: browserAPI.runtime.getURL("icons/icon-48.png"),
            title: "Download Failed",
            message: `${downloadData.filename} - Download interrupted`
          });
        }

        // Remove failed download after short delay
        browserAPI.alarms.create(`cleanup-${delta.id}`, {
          delayInMinutes: 0.08 // ~5 seconds
        });
      }

    } catch (error) {
      console.error('Error in handleDownloadChange:', error);
    }
  }

  async getStats() {
    try {
      const { downloads, lastNotificationTime } = await this.getStorageData();
      return {
        activeDownloads: downloads.size,
        lastNotification: new Date(lastNotificationTime).toISOString(),
        hasNotificationPermission: this.permissionManager.hasNotificationPermission
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        activeDownloads: 0,
        lastNotification: 'Unknown',
        hasNotificationPermission: false
      };
    }
  }
}

// Initialize the download manager
const downloadManagerV3 = new DownloadNotifyManagerV3();

// Handle individual cleanup alarms
browserAPI.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('cleanup-') && alarm.name !== 'cleanup-downloads') {
    const downloadId = parseInt(alarm.name.replace('cleanup-', ''));
    downloadManagerV3.removeDownloadData(downloadId);
  }
});

// Export for debugging (service worker global scope)
self.downloadManagerV3 = downloadManagerV3; 