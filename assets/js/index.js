// This is for highlighting footnotes and references in the aspect’s text
const footnotes = document.getElementsByClassName('footnote');

for (let l = 0; l < footnotes.length; l++) {
	footnotes[l].addEventListener('mouseenter', function (e) {
		const reference = document.getElementById(e.target.getAttribute('aria-describedby'))
		if (reference) reference.setAttribute('role', 'mark');
	})
	footnotes[l].addEventListener('mouseleave', function (e) {
		const reference = document.getElementById(e.target.getAttribute('aria-describedby'))
		if (reference) reference.removeAttribute('role');
	})
}

const references = document.getElementsByClassName('reference');

for (let l = 0; l < references.length; l++) {
	references[l].addEventListener('mouseenter', function (e) {
		const footnote = document.getElementById('fn-' + e.target.getAttribute('id'))
		if (footnote) footnote.setAttribute('role', 'mark');
	})
	references[l].addEventListener('mouseleave', function (e) {
		const footnote = document.getElementById('fn-' + e.target.getAttribute('id'))
		if (footnote) footnote.removeAttribute('role');
	})
}