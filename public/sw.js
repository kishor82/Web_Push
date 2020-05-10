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
      vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
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