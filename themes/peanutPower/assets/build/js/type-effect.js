'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

document.addEventListener('DOMContentLoaded', function () {

	var typeContent = document.getElementById('typewriter');
	typeContent.classList.add('dcf-invisible'); // make the element invisible on pageload
	var typeChildren = typeContent.children; // get all elements inside typewriter

	var baseSpeed = 250;
	var aggregateSpeed = 0;

	function type(args) {
		var _args = _slicedToArray(args, 2),
		    letter = _args[0],
		    el = _args[1]; // destructure args


		el.textContent += letter;
	}

	function typewriter(typeChildren) {
		var _loop = function _loop(child) {
			var innerText = child.innerHTML; // copy text inside element
			child.innerHTML = null; // clear existing text

			var _innerText = _toArray(innerText),
			    char = _innerText.slice(0); // make existing text into array

			char.forEach(function (letter) {
				var delay = Math.min(baseSpeed * Math.random() + 100, 300); // delay should not be longer than 300ms
				aggregateSpeed += delay;
				setTimeout(type.bind(null, [letter, child]), aggregateSpeed);
			});
		};

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = typeChildren[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var child = _step.value;

				_loop(child);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	}

	setTimeout(function () {
		typeContent.classList.remove('dcf-invisible');
		typewriter(typeChildren);
	}, 350); // kickoff typewriter after 350ms to account for fontloading and page drawing
});