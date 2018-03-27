// ==UserScript==
// @name         Stock Comments
// @namespace    https://github.com/geisterfurz007
// @version      0.2.3
// @description  Easily send stock messages with the click of a button
// @author       geisterfurz007
// @match        https://chat.stackoverflow.com/rooms/139/*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const room = 139;


(function() {
    'use strict';
	
	window.addEventListener("click", showOrHideDialog);
	
	if (typeof GM !== 'object') {
		GM = {};
	}

	if (typeof GM_xmlhttpRequest === 'function' && !GM.xmlHttpRequest) {
		GM.xmlHttpRequest = GM_xmlhttpRequest;
	}
	
    var buttonsContainer = document.getElementById("chat-buttons");
	var scButton = document.createElement("a");

	scButton.setAttribute("id", "stock-comment-button");
	scButton.classList.add("button");
    scButton.style.position = "relative";

	scButton.innerText = "Stock Comments";
    
    var wrapper = document.createElement("dl");
	wrapper.setAttribute("id", "sCommentSelection");
    wrapper.setAttribute("style", "margin: 0px; z-index: 1; position: absolute; white-space: nowrap; background: rgb(255, 255, 255) none repeat scroll 0% 0%; padding: 5px; border: 1px solid rgb(159, 166, 173); box-shadow: rgba(36, 39, 41, 0.3) 0px 2px 4px; cursor: default; bottom: 2em;");
    wrapper.classList.add("hidden");
	
    var comments = getComments();
    for (var i=0; i<Object.keys(comments).length; i++) {
        var current = Object.keys(comments)[i];
		var link = getLinkObject(current, comments[current].desc, comments[current].message);
		
		wrapper.appendChild(link);
		
		if (comments[current].endOfSection) {
			var hr = document.createElement("hr");
			hr.classList.add("my-10");
			wrapper.appendChild(hr);
		}
   }
    
	scButton.appendChild(wrapper);
    buttonsContainer.appendChild(scButton);

    GM_addStyle("#stock-comment-button > dl > dt {padding-left: 5px; padding-right: 5px;}" +
				".my-10 {margin-top: 10px; margin-bottom: 10px;}" +
				".hidden {display:none}" +
				".d-block {display:block}");
})();

function showOrHideDialog(event) {
	var target = event.target;
	if (target.getAttribute("id") === "stock-comment-button") {
		$("#sCommentSelection").toggle();
	} else {
		$("#sCommentSelection").hide();
	}
}

function getLinkObject(key, description, message) {
	var listItem = document.createElement("dt");
	listItem.setAttribute("data-reason", key);
	
	var link = document.createElement("a");
	link.setAttribute("style", "display: inline-block; margin-top: 5px; width:auto; cursor: pointer");
	link.setAttribute("title", message);
	
	link.innerText = description;
	
	link.onclick = function (ev) {sendOrAppend(ev, message);};
	
	listItem.appendChild(link);
	
	return listItem;
}

function sendOrAppend(event, message) {
	var input = document.getElementById("input");
	if (input.value !== "") {
		input.value = input.value + message;
	} else {
		sendMessage(message);
	}
	event.preventDefault();
}

function sendMessage(msg) {
	var fkey = document.getElementById("fkey").getAttribute("value");
	
	GM.xmlHttpRequest({
		method: 'POST',
		url: 'https://chat.stackoverflow.com/chats/' + room + '/messages/new',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		data: 'text=' + encodeURIComponent(msg) + '&fkey=' + fkey
	});
}

function getComments() {
    return (
        {
			"aij": {
				desc: "Android is Java",
				message: "Android uses Java syntax; But it is in no way Java. Android and Java have different SDK's, and even shared classes have differences. Java developers aren't necessarily familiar with Android just because they know the language syntax. For Android questions, use the [Android room](https://chat.stackoverflow.com/rooms/info/15/android), or one of the other rooms dedicated to Android."
			},
			"androidAccess": {
				desc: "No access to the Android room",
				message: "Even though you can't talk in the Android room, that's not a reason to ask Android questions here. Android runs a completely different system, lifecycle and SDK compared to Java, even though they share language syntax. There are other Android chat rooms, so please ask there instead."
			},
			"javaStillHelp": {
				desc: "I thought Java devs could help me too",
				message: "Android is not Java, and Android questions are off-topic in this room. Android Java and Java syntax is the same, but the SDKs differ. In addition, Android uses different systems (like Activities) which do not exist in Java. Please take your question to an Android room instead."
			},
			"generalAndroid": {
				desc: "General Android questions",
				message: "This is not an Android room. Please take your question to a room dedicated to Android. If you came here because you don't have access to the Android room (room 15), remember that there are other rooms too with Android as the topic.",
				endOfSection: "true"
			},
			"jsij": {
				desc: "Javascript is Java",
				message: "Java and JavaScript have nothing in common. The language SDKs are different, Java is a compiled language (where as JavaScript is not), and just knowing Java doesn't mean you know JavaScript or the other way around. For JS questions, use the [JavaScript room](https://chat.stackoverflow.com/rooms/info/17/javascript), or a different room with JavaScript as the topic."
			},
			"generalJS": {
				desc: "General Javascript questions",
				message: "This is not a JavaScript room; and no, just because JavaScript has Java in its name, doesn't mean it is in any way similar to Java. Please take your question to a room dedicated to JavaScript. I.e. the [JavaScript room](https://chat.stackoverflow.com/rooms/info/17/javascript) is one you can use.",
				endOfSection: "true"
			},
			"bigCode": {
				desc: "Big code snippet",
				message: "Please use a [paste site](https://paste.ofcode.org/) for long code snippets."
			},
			"shortcut": {
				desc: "Using chat as a question shortcut",
				message: "Please don't use chat as fastlane for your questions. Instead, wait a few days before asking here to give the people on the main site some time. If we want to answer questions there, we will look for them on our own."
			}
		}
    );
}
























