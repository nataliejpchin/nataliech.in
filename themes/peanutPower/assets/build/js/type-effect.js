"use strict";

// function textSplit([...sets]) {
// 	sets.forEach(set => {
// 		const el = document.querySelector(set[0]);
// 		el.setAttribute('aria-label', el.textContent);
//
// 		el.innerHTML = [...el.textContent]
// 				.map((letter, i) => `<span class="child-${i}"aria-hidden="true">${letter}</span>`)
// 				.join('');
// 	})
// };

//credit: https://codepen.io/stevn/pen/jEZvXa
function setupTypewriter(t) {
	var HTML = t.innerHTML;

	t.innerHTML = "";

	var cursorPosition = 0,
	    tag = "",
	    writingTag = false,
	    tagOpen = false,
	    typeSpeed = 50,
	    tempTypeSpeed = 0;

	var type = function type() {

		if (writingTag === true) {
			tag += HTML[cursorPosition];
		}

		if (HTML[cursorPosition] === "<") {
			tempTypeSpeed = 0;
			if (tagOpen) {
				tagOpen = false;
				writingTag = true;
			} else {
				tag = "";
				tagOpen = true;
				writingTag = true;
				tag += HTML[cursorPosition];
			}
		}
		if (!writingTag && tagOpen) {
			tag.innerHTML += HTML[cursorPosition];
		}
		if (!writingTag && !tagOpen) {
			if (HTML[cursorPosition] === " ") {
				tempTypeSpeed = 0;
			} else {
				tempTypeSpeed = Math.random() * typeSpeed + 50;
			}
			t.innerHTML += HTML[cursorPosition];
		}
		if (writingTag === true && HTML[cursorPosition] === ">") {
			tempTypeSpeed = Math.random() * typeSpeed + 50;
			writingTag = false;
			if (tagOpen) {
				var newSpan = document.createElement("span");
				t.appendChild(newSpan);
				newSpan.innerHTML = tag;
				tag = newSpan.firstChild;
			}
		}

		cursorPosition += 1;
		if (cursorPosition < HTML.length - 1) {
			setTimeout(type, tempTypeSpeed);
		}
	};

	return {
		type: type
	};
}

var typewriter = document.getElementById('typewriter');

if (typewriter) {
	typewriter = setupTypewriter(typewriter);
	typewriter.type();
}