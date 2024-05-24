'use strict';

const prefs = {
  'enabled': false,
  'overwrite-origin': true,
  'overwrite-methods': true,
  'methods': ['GET', 'HEAD', 'POST'] // GET, HEAD, POST needn't Access-Control-Allow-Methods to make CORS request
};
const cors = {};
const bypassOrigin = ['http://localhost:63342'];

cors.onHeadersReceived = (details) => {
  // if resource server return the preflight request without header 'Access-Control-Allow-Origin'
  // that also mean that browser will block all CORS request
  // Only request's origin (initiator) listed in bypassOrigin will overwrite 'Access-Control-Allow-Origin'
  let flag = bypassOrigin.find(s => s === details.initiator) !== undefined;

  if (prefs['overwrite-origin'] === true && flag) {
    details.responseHeaders.push({
      'name': 'Access-Control-Allow-Origin',
      'value': bypassOrigin.join(', ')
    });

    if (prefs['overwrite-methods'] === true) {
      details.responseHeaders.push({
        'name': 'Access-Control-Allow-Methods',
        'value': prefs.methods.join(', ')
      });
    }
  }

  return {responseHeaders: details.responseHeaders};
};

cors.install = () => {
  cors.remove();
  chrome.webRequest.onHeadersReceived.addListener(cors.onHeadersReceived, {
    urls: ['<all_urls>']
  }, ['blocking', 'responseHeaders', 'extraHeaders']);
};

cors.remove = () => {
  chrome.webRequest.onHeadersReceived.removeListener(cors.onHeadersReceived);
};

cors.onCommand = () => {
  if (prefs.enabled) {
    cors.install();
  }
  else {
    cors.remove();
  }
  chrome.browserAction.setIcon({
    path: {
      '16': 'data/icons/' + (prefs.enabled ? '' : 'disabled/') + '16.png',
      '19': 'data/icons/' + (prefs.enabled ? '' : 'disabled/') + '19.png',
      '32': 'data/icons/' + (prefs.enabled ? '' : 'disabled/') + '32.png',
      '38': 'data/icons/' + (prefs.enabled ? '' : 'disabled/') + '38.png',
      '48': 'data/icons/' + (prefs.enabled ? '' : 'disabled/') + '48.png',
      '64': 'data/icons/' + (prefs.enabled ? '' : 'disabled/') + '64.png'
    }
  });
  chrome.browserAction.setTitle({
    title: prefs.enabled ? 'Access-Control-Allow-Origin is unblocked' : 'Disabled: Default server behavior'
  });
};

chrome.storage.onChanged.addListener(ps => {
  Object.keys(ps).forEach(name => prefs[name] = ps[name].newValue);
  cors.onCommand();
});

chrome.browserAction.onClicked.addListener(() => {
  chrome.storage.local.set({enabled: prefs.enabled === false})
});

chrome.contextMenus.onClicked.addListener(info => {
  const properties = {};

  if (info.menuItemId === 'open-chart-page') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('chart.html')
    });
  }
  else if (info.menuItemId === 'overwrite-origin' || info.menuItemId === 'overwrite-methods') {
    properties[info.menuItemId] = info.checked;
  }
  else {
    properties.methods = prefs.methods;
    if (info.checked) {
      properties.methods.push(info.menuItemId);
    }
    else {
      const index = prefs.methods.indexOf(info.menuItemId);
      if (index !== -1) {
        properties.methods.splice(index, 1);
      }
    }
  }
  // store key-value properties into Chrome's local storage.
  chrome.storage.local.set(properties);
});

/* init */
chrome.storage.local.get(prefs, propertiesStored => {
  // merges the fetched preferences (propertiesStored) with the default preferences (prefs)
  Object.assign(prefs, propertiesStored);
  /* context menu */
  chrome.contextMenus.create({
    title: 'Overwrite access-control-allow-origin',
    type: 'checkbox',
    id: 'overwrite-origin',
    contexts: ['browser_action'],
    checked: prefs['overwrite-origin']
  });
  chrome.contextMenus.create({
    title: 'Overwrite access-control-allow-methods',
    type: 'checkbox',
    id: 'overwrite-methods',
    contexts: ['browser_action'],
    checked: prefs['overwrite-methods']
  });
  chrome.contextMenus.create({
    title: 'Open chart page',
    id: 'open-chart-page',
    contexts: ['browser_action']
  });

  const menu = chrome.contextMenus.create({
    title: 'Methods',
    contexts: ['browser_action']
  });

  chrome.contextMenus.create({
    title: 'PUT',
    type: 'checkbox',
    id: 'PUT',
    contexts: ['browser_action'],
    checked: prefs.methods.indexOf('PUT') !== -1,
    parentId: menu
  });
  chrome.contextMenus.create({
    title: 'DELETE',
    type: 'checkbox',
    id: 'DELETE',
    contexts: ['browser_action'],
    checked: prefs.methods.indexOf('DELETE') !== -1,
    parentId: menu
  });
  chrome.contextMenus.create({
    title: 'OPTIONS',
    type: 'checkbox',
    id: 'OPTIONS',
    contexts: ['browser_action'],
    checked: prefs.methods.indexOf('OPTIONS') !== -1,
    parentId: menu
  });
  chrome.contextMenus.create({
    title: 'PATCH',
    type: 'checkbox',
    id: 'PATCH',
    contexts: ['browser_action'],
    checked: prefs.methods.indexOf('PATCH') !== -1,
    parentId: menu
  });

  cors.onCommand();
});

