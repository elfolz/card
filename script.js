const reader = new FileReader()
var inputError = false
var textareaError = false

function refreshPageSize() {
	const ratioW = window.visualViewport.width / 421
	const ratioH = window.visualViewport.height / 614
	var ratio = Math.min(ratioW, ratioH)
	if (ratio > 1) ratio = 1
	const cardW = document.querySelector('#bg').clientWidth
	document.querySelector('input[type=text]').style.left = `${25 * ratio}px`
	document.querySelector('input[type=text]').style.top = `${28 * ratio}px`
	document.querySelector('input[type=text]').style.width = `${cardW - (50 * ratio)}px`
	document.querySelector('input[type=text]').style.height = `${37 * ratio}px`
	document.querySelector('input[type=text]').style.fontSize = `${2 * ratio}em`
	document.querySelector('textarea').style.left = `${28 * ratio}px`
	document.querySelector('textarea').style.top = `${463 * ratio}px`
	document.querySelector('textarea').style.width = `${cardW - (56 * ratio)}px`
	document.querySelector('textarea').style.height = `${96 * ratio}px`
	document.querySelector('textarea').style.fontSize = `${1.5 * ratio}em`
	document.querySelector('header').style.left = `${42 * ratio}px`
	document.querySelector('header').style.top = `${73 * ratio}px`
	document.querySelector('header').style.width = `${cardW - (84 * ratio)}px`
	document.querySelector('header').style.height = `${28 * ratio}px`
	document.documentElement.style.setProperty('--vh', `${window.visualViewport.height}px`)
}

document.onreadystatechange = () => {
	if (document.readyState != 'complete') return
	document.querySelector('input[type=file]').onchange = e => {
		if (!e.target.files?.length) return document.querySelector('#photo').src = './img/empty.webp'
		reader.onload = e => document.querySelector('#photo').src = e.target.result
		reader.readAsDataURL(e.target.files[0])
	}
	document.querySelector('select').onchange = e => {
		document.querySelector('#bg').src = `./img/${e.target.value}.webp`
		if (['trap', 'spell'].includes(e.target.value)) document.querySelector('header').style.display = 'none'
		else  document.querySelector('header').style.removeProperty('display')
	}
	document.querySelector('input[type=text]').oninput = e => {
		if (e.target.scrollWidth > e.target.clientWidth) {
			e.target.classList.add('error')
			inputError = true
		} else {
			e.target.classList.remove('error')
			inputError = false
		}
	}
	document.querySelector('textarea').oninput = e => {
		if (e.target.scrollWidth > e.target.clientWidth || e.target.scrollHeight > e.target.clientHeight) {
			e.target.classList.add('error')
			textareaError = true
		} else {
			e.target.classList.remove('error')
			textareaError = false
		}
	}
}

window.onresize = () => refreshPageSize()
window.visualViewport.onresize = () => refreshPageSize()
window.visualViewport.onscroll = () => refreshPageSize()

refreshPageSize()