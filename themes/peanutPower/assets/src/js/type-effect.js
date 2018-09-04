document.addEventListener('DOMContentLoaded', () => {

	var typeContent = document.getElementById('typewriter');
	typeContent.classList.add('dcf-invisible'); // make the element invisible on pageload
	const typeChildren = typeContent.children; // get all elements inside typewriter

	const baseSpeed = 250;
	let aggregateSpeed = 0;

	function type(args) {
		const [letter, el] = args; // destructure args
		el.textContent += letter;
	}

	function typewriter(typeChildren) {
		for (const child of typeChildren) {
			child.setAttribute('aria-live', 'polite');
			const innerText = child.innerHTML;	// copy text inside element
			child.innerHTML = null; // clear existing text
			const [...char] = innerText; // make existing text into array

			char.forEach(letter => {
				const delay = Math.min(((baseSpeed * Math.random()) + 100), 300); // delay should not be longer than 300ms
				aggregateSpeed += delay;
				setTimeout(type.bind(null,[letter, child]), aggregateSpeed);
			})
		}
	}

	setTimeout(() => {
		typeContent.classList.remove('dcf-invisible');
		typewriter(typeChildren);
	}, 350); // kickoff typewriter after 350ms to account for fontloading and page drawing

});


