export async function isTrulyOnline(): Promise<boolean> {
  return navigator.onLine;
}

export function showStatusMessage(message: string, type: 'info' | 'warning' | 'error' = 'info') {
  const status = document.querySelector<HTMLDivElement>('#status')
  if (!status) return
  status.textContent = message
  status.className = type
}

export function showConnectionStatus(isOnline: boolean) {
  const connection = document.querySelector<HTMLDivElement>('#connection')
  if (!connection) return;
  
  if (isOnline) {
    connection.textContent = '🟢 Online'
    connection.className = 'info'
  } else {
    connection.textContent = '🔴 Offline'
    connection.className = 'error'
  }
}

export function listenToConnectivityChanges() {
  // Show initial connection status
  showConnectionStatus(navigator.onLine)
  
  window.addEventListener('online', () => {
    showConnectionStatus(true)
    showStatusMessage('🟢 Back online.', 'info')
  })
  window.addEventListener('offline', () => {
    showConnectionStatus(false)
    showStatusMessage('🔴 You are offline.', 'error')
  })
  
  // Periodically check true online status, but only if navigator says we're online
  setInterval(async () => {
    if (navigator.onLine) {
      const trulyOnline = await isTrulyOnline()
      showConnectionStatus(trulyOnline)
    }
  }, 10000) // Check every 10 seconds
}
