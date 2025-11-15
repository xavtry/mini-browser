// This script runs inside the home.html webview
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('home-search-input');

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value;
      if (!query) return;

      let finalUrl;
      // Check if it's a URL or a search term
      if (query.includes('.') && !query.includes(' ') && !query.startsWith('http')) {
        finalUrl = `https://${query}`;
      } else if (query.startsWith('http://') || query.startsWith('https://')) {
        finalUrl = query;
      } else {
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }
      
      // Navigate the current window (which is inside the webview)
      window.location.href = finalUrl;
    }
  });
});
