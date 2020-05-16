self.addEventListener('push', function (e) {
  console.log('Push received:', e);
  let _data = e.data ? JSON.parse(e.data.text()) : {};
  console.log({ _data });
  e.waitUntil(
    self.registration.showNotification(_data.title, {
      body: _data.message,
      data: { url: self.location.origin },
      icon: `${self.location.origin}/${_data.icon}`,
      tag: _data.tag,
      badge: `${self.location.origin}/${_data.badge}`,
      requireInteraction: true,
      actions: [
        {
          action: 'action-here',
          title: 'Any-action',
          icon: 'https://cdn3.iconfinder.com/data/icons/happy-x-mas/501/santa15-128.png'
        },
      ]
    })
  )
})

// notification url redirect event click
self.addEventListener('notificationclick', function (e) {
  // Close the notification popout
  e.notification.close();
  // Get all the Window clients

  e.waitUntil(clients.matchAll({
    type: 'window'
  }).then(clientsArr => {
    // If a window tab matching the targeted URL already exist, focus that;
    const hadWindowToFocus = clientsArr.some(windowClient => windowClient.url === e.notification.data.url ? (windowClient.focus(), true) : false);

    // Otherwise, open a new tab to the applicable URL and focus it.
    if (!hadWindowToFocus) clients.openWindow(e.notification.data.url).then(windowClient => windowClient ? windowClient.focus() : null);
  })
  );
})