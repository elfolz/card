if (location.protocol.startsWith('https')) {
	navigator.serviceWorker.register('service-worker.js')
	navigator.serviceWorker.onmessage = m => {
		console.info('Update found!')
		if (m?.data == 'update') location.reload(true)
	}
}

const reader = new FileReader()
const cardW = 421
const cardH = 614
var inputError = false
var textareaError = false

function refreshPageSize() {
	const rw = window.innerWidth / cardW
	const rh = window.innerHeight / cardH
	var ratio = Math.min(rw, rh)
	if (ratio > 1) ratio = 1
	const cardWidth = document.querySelector('#bg').clientWidth
	document.querySelector('input[type=text]').style.left = `${22 * ratio}px`
	document.querySelector('input[type=text]').style.top = `${28 * ratio}px`
	document.querySelector('input[type=text]').style.width = `${cardWidth - (50 * ratio)}px`
	document.querySelector('input[type=text]').style.height = `${42 * ratio}px`
	document.querySelector('input[type=text]').style.fontSize = `${2 * ratio}em`
	document.querySelector('textarea').style.left = `${28 * ratio}px`
	document.querySelector('textarea').style.top = `${463 * ratio}px`
	document.querySelector('textarea').style.width = `${cardWidth - (56 * ratio)}px`
	document.querySelector('textarea').style.height = `${96 * ratio}px`
	document.querySelector('textarea').style.fontSize = `${1.5 * ratio}em`
	document.querySelector('header').style.left = `${42 * ratio}px`
	document.querySelector('header').style.top = `${73 * ratio}px`
	document.querySelector('header').style.width = `${cardWidth - (84 * ratio)}px`
	document.querySelector('header').style.height = `${28 * ratio}px`
	document.documentElement.style.setProperty('--vh', `${window.visualViewport.height}px`)
}

function download() {
	if (inputError || textareaError) return alert('Há textos inválidos!')
	const canvas = document.querySelector('#screenshot')
	canvas.width = cardW
	canvas.height = cardH
	const ctx = canvas.getContext('2d')
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	/** foto */
	const photo = document.querySelector('#photo')
	const photoL = parseInt(getComputedStyle(photo).left.replace(/[^0-9]/g, ''))
	const photoW = photo.clientWidth
	const rw = 325 / photo.naturalWidth
	const rh = 325 / photo.naturalHeight
	var ratio = Math.max(rw, rh)
	if (ratio > 1) ratio = 1
	let x = 0
	let y = 0
	let w = photo.naturalWidth
	let h = photo.naturalHeight
	if (photo.naturalHeight > photo.naturalWidth) {
		y = (photo.naturalHeight - photo.naturalWidth) / 2
		h = photo.naturalHeight*ratio
	} else if (photo.naturalWidth > photo.naturalHeight) {
		x = (photo.naturalWidth - photo.naturalHeight) / 2
		w = photo.naturalWidth*ratio
	}
	ctx.drawImage(photo, x, y, w, h, 48, 108, 325, 325)
	/** fundo */
	ctx.drawImage(document.querySelector('#bg'), 0, 0, cardW, cardH)
	/** leveis */
	const levels = document.querySelector('header').children
	for (let i=0; i<levels.length; i++) {
		let x = (photoL+photoW)-(28*(i+1))
		ctx.drawImage(document.querySelector(`header :nth-child(${i+1})`), x, 73, 28, 28)
	}
	/** titulo */
	const text = document.querySelector('input[type=text]').value.split(/\s/g)
	.map(el => `${el.substr(0,1).toUpperCase()}${el.slice(1)}`)
	.join(' ')
	ctx.font = 'bold 32px serif'
  ctx.fillText(text, 25, 56)
	/** texto */
	document.querySelector('textarea').value.split(/\n/g)
	.forEach((el, i) => {
		ctx.font = '24px serif'
		ctx.fillText(el.trim(), 30, 485+(24*i))
	})
	/** download */
	const link = document.createElement('a')
	link.download = 'Card.jpeg'
	link.href = canvas.toDataURL('image/jpeg')
	document.documentElement.appendChild(link)
	link.click()
	setTimeout(() => {document.documentElement.removeChild(link), 100})
	canvas.toBlob(blob => {
		navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
		.then(() => {
			alert('Carta copiada para o clipboard!')
		})
	})
}

function init() {
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
	document.querySelector('select').onchange = e => {
		document.querySelector('#bg').src = `./img/${e.target.value}.webp`
		if (['trap', 'spell'].includes(e.target.value)) document.querySelector('header').style.display = 'none'
		else  document.querySelector('header').style.removeProperty('display')
	}
	document.querySelector('input[type=file]').onchange = e => {
		if (!e.target.files?.length) return document.querySelector('#photo').src = './img/empty.webp'
		reader.onload = e => document.querySelector('#photo').src = e.target.result
		reader.readAsDataURL(e.target.files[0])
	}
	document.querySelector('button').onclick = () => download()
}

document.onreadystatechange = () => {if (document.readyState == 'complete') init()}
window.onresize = () => refreshPageSize()
refreshPageSize()