browser.contextMenus.create({
	id: "multiview",
	title: "Multiview",
	contexts: ["link", "selection"],
	"icons": {
		"16": "multiview.svg",
		"32": "multiview.svg"
	},
});

browser.contextMenus.onClicked.addListener((info, tab) => {
	var link = escape(info.linkUrl);
	console.log(link);
	var creating = browser.tabs.create({
		url: "multiview.html?src=" + link
	});
	creating.then(onCreated, onError);
});

browser.pageAction.onClicked.addListener((tab) => {
	browser.tabs.update({ url: "multiview.html?src=" + tab.url })
});

browser.tabs.onUpdated.addListener(function (id, info, tab) {
	if(tab.url.startsWith('http') || tab.url.startsWith('file')){
		showPageAction(tab);
	}
});

function showPageAction(tab) {
		browser.pageAction.show(tab.id);
}

/*

browser.tabs.onActivated.addListener(function (id, info, tab) {
	tab = browser.tabs[id.tabId];
	console.log('tab:' + tab);
	chrome.tabs.query({ currentWindow: true, active: true },
		function (tabArray) {
			if (tabArray[0]) {
				tab = tabArray[0];
				if(tab.url.startsWith('http')){
					showPageAction(tab);
				}
			}
		});
});
*/