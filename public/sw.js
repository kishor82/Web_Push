let notification = '';
self.addEventListener('push', function (event) {
  console.log('Push received:', event);
  let _data = event.data ? JSON.parse(event.data.text()) : {};
  console.log({ _data });
  notificationUrl = _data.url;
  event.waitUntil(
    self.registration.showNotification(_data.title, {
      body: _data.message,
      icon: _data.icon,
      tag: _data.tag,
      badge: _data.badge,
      requireInteraction: true,
      actions: [
        {
          action: 'coffee-action',
          title: 'Coffee',
          icon: 'https://cdn3.iconfinder.com/data/icons/happy-x-mas/501/santa15-128.png'
        },
      ]
    })
  )
})

// notification url redirect event click
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
      .then(function (clienttList) {
        if (clients.openWindow) {
          return clients.openWindow(notificationUrl);
        }
      })
  )
})