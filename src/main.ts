import './style.css';
import { worker } from './mocks/browser';
import { isTrulyOnline, showStatusMessage, showConnectionStatus, listenToConnectivityChanges } from './status';

// Start MSW and wait for it to be ready
await worker.start({
  onUnhandledRequest: 'warn'
});
console.log('MSW is ready');

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <section class="nav">
        <h1>Network Connection Issues Test</h1> 
       <div class="row"><div id="connection"></div></div>
    </section>
    <section class="content">
      <div class="row"><span>Request Timing:</span><div id="status"></div></div>
    </section>
  </div>
`;
// Start monitoring connectivity
listenToConnectivityChanges();

// Simulate a Gorilla service fetch
const loadGorillaData = async () => {
  const stillLoading = setTimeout(() => {
    showStatusMessage('Still loading... Thanks for your patience.', 'info');
  }, 2000);

  const longDelay = setTimeout(async () => {
    const online = await isTrulyOnline();
    if (!online) {
      showConnectionStatus(false);
      showStatusMessage('You appear to be offline. Trying to reconnect...', 'error');
    } else {
      showConnectionStatus(true);
      showStatusMessage('This is taking longer than expected. Please check your network.', 'warning');
    }
  }, 8000);

  try {
    console.log('Fetching /api/tesst...');
    const res = await fetch('/api/test');
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const json = await res.json();
    console.log('Response data:', json);
    clearTimeout(stillLoading);
    clearTimeout(longDelay);
    showConnectionStatus(true);
    showStatusMessage(`✅ Request responded: ${json.message}`, 'info');
  } catch (err) {
    console.error('Fetch error:', err);
    clearTimeout(stillLoading);
    clearTimeout(longDelay);
    
    // Check if we're truly online when the request fails
    const online = await isTrulyOnline();
    showConnectionStatus(online);
    
    showStatusMessage('❌ Failed to load api service.', 'error');
  }
};

loadGorillaData();
