chrome.contextMenus.create({
  id: "askOllama",
  title: "Ask Ollama",
  contexts: ["all"],
});

// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "askOllama") {
    // Send a message to the content script
    chrome.tabs.sendMessage(tab.id, { type: "askOllama" });
  }
});
