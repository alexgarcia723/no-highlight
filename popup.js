const paramList = document.getElementById('paramList');
const blacklist = document.getElementById('blacklist');
const saveBtn = document.getElementById('saveBtn');
const status = document.getElementById('status');
const darkToggle = document.getElementById('darkModeToggle');

// Load saved settings
chrome.storage.sync.get(['params', 'blacklist', 'darkMode'], (data) => {
  if (data.params) paramList.value = data.params.join(', ');
  if (data.blacklist) blacklist.value = data.blacklist.join('\\n');
  if (data.darkMode) {
    document.body.classList.add('dark');
    darkToggle.checked = true;
  }
});

// Save settings on click
saveBtn.addEventListener('click', async () => {
    const params = paramList.value.split(',').map(p => p.trim()).filter(Boolean);
    const sites = blacklist.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const darkMode = darkToggle.checked;
  
    await chrome.storage.sync.set({ params, blacklist: sites, darkMode });
  
    status.textContent = 'Settings saved!';
    setTimeout(() => status.textContent = '', 2000);
  
    document.body.classList.toggle('dark', darkMode);
  });
  

// Live toggle dark mode
darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', darkToggle.checked);
});
