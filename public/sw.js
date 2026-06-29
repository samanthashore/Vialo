// PYN Service Worker for local notifications

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, peptideName, time } = event.data;

    // Schedule notification via scheduled notification API if available
    self.registration.getNotifications().then(notifications => {
      // Check if notification already exists
      const exists = notifications.some(n => n.tag === peptideName);
      if (!exists) {
        self.registration.showNotification(title, {
          body: body || `Time to log ${peptideName}`,
          icon: '/pyn-icon.png',
          tag: peptideName,
          requireInteraction: true,
          actions: [
            { action: 'open', title: 'Log dose' },
            { action: 'close', title: 'Later' }
          ]
        });
      }
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});
