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

browser.webRequest.onHeadersReceived.addListener(
	function(info) {
		var ext = browser.extension.getURL("");
		//only override iframe security related headers if within this extension
		if(info.originUrl.startsWith(ext)){
			var headers = info.responseHeaders;
			var hadXframe = false;
			var hadCSP = false;
			for (var i=headers.length-1; i>=0; --i) {
					var header = headers[i].name.toLowerCase();
					if (header == 'x-frame-options' || header == 'frame-options') {
						hadXframe = true;
					}
					if (header === "content-security-policy") {
						// modifying frame-ancestors
						var hv = headers[i].value.toLowerCase();
						if(hv.indexOf('frame-ancestors') > -1){
							headers[i].value = hv.replace("frame-ancestors", "frame-ancestors " + ext + " ");
						} else {
							headers[i].value = hv + "; frame-ancestors " + ext 
						}
						hadCSP = true;
        	}
			}
			if(hadXframe && !hadCSP){
				//found x-frame-options; will override with CSP header
				headers.push({name:'Content-Security-Policy', value: 'frame-ancestors ' + ext})
			}

		}
		return {responseHeaders: headers};
	},
	{
			urls: [ '*://*/*' ], // Pattern to match all http(s) pages
			types: [ 'sub_frame' ]
	},
	['blocking', 'responseHeaders']
);