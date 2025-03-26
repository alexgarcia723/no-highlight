chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete' || !tab.url) return;
  
    try {
      const urlObj = new URL(tab.url);
      const domain = urlObj.hostname;
  
      const { params = [], blacklist = [] } = await chrome.storage.sync.get(['params', 'blacklist']);
  
      // Skip if the domain is blacklisted
      if (blacklist.some(site => domain.includes(site))) return;
  
      let changed = false;
      const searchParams = new URLSearchParams(urlObj.search);
  
      params.forEach(param => {
        if (searchParams.has(param)) {
          searchParams.delete(param);
          changed = true;
        }
      });
  
      if (changed) {
        urlObj.search = searchParams.toString();
        const cleanedUrl = urlObj.toString();
  
        if (cleanedUrl !== tab.url) {
          chrome.tabs.update(tabId, { url: cleanedUrl });
        }
      }
    } catch (err) {
      console.error('ParamCleaner error:', err);
    }
  });
  