// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var localS = 0;
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.count>0){
		localS=request.count;
		sendResponse({msg: "thanks"});
	}
    else
		sendResponse({});
});


var items = new Array();
// Create one test item for each context type.
  var context = "selection";
  var parent = chrome.contextMenus.create({"title": "Search '%s' With", "contexts":[context]});
  chrome.contextMenus.create({"title": "DuckDuckGo", "contexts":[context], "parentId": parent,
                                       "onclick": DuckDuckGoClick});
  var count = localStorage["engine_count"];
	if(!count || count==0){
		chrome.contextMenus.create({"title": "No Custom Engine Saved", "contexts":[context], "parentId": parent});
	}
	for (var i = 1; i<=count; i++) {
		items[i] = chrome.contextMenus.create({"title": localStorage["engine_name_" + i], "contexts":[context], "parentId": parent,
                                       "onclick": selectionOnClick});
		items[items[i] + "_pattern"] = localStorage["engine_pattern_" + i];
	}

function selectionOnClick(info){
	var pattern = items[info.menuItemId + "_pattern"];
	var query = encodeURIComponent(info.selectionText);
	query = trim(query);
	query = query.replace(/\s/g,"+");
	var searchURI = pattern.replace(/\%s/g, query);
	var serviceCall = searchURI;
	chrome.tabs.create({url: serviceCall});
}
function DuckDuckGoClick(info){
	var pattern = "http://duckduckgo.com/?q=%s";
	var query = encodeURIComponent(info.selectionText);
	var searchURI = pattern.replace(/\%s/g, query);
	var serviceCall = searchURI;
	//alert(localS);
	chrome.tabs.create({url: serviceCall});
}
function trim(s)
{
	var l=0; var r=s.length -1;
	while(l < s.length && s[l] == ' ')
	{	l++; }
	while(r > l && s[r] == ' ')
	{	r-=1;	}
	return s.substring(l, r+1);
}