/** *************
 * Font Face Observer
 * - Use the CSS Font Loading API with a polyfill to detect
 *   when a specific font has loaded and only apply that web
 *   font in your CSS after it has loaded successfully.
 * https://github.com/bramstein/fontfaceobserver
 ****************/


let fontA = new FontFaceObserver('Karma');
let fontB = new FontFaceObserver('Assistant');

// adds a class on <html> element
Promise.all([fontA.load(), fontB.load()]).then(() => {
    document.documentElement.className += 'fonts-loaded';
});

// adds a class on <html> element
// Promise.all([fontA.load()]).then(function () {
//   document.documentElement.className += " fonts-loaded";
// });

// fontA.load().then(function () {
//   console.log('Family A is available');
// });

// fontB.load().then(function () {
//   console.log('Family B is available');
// });