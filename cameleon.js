function middle(x1, y1, x2, y2) {
	return [(x1 + x2) / 2, (y1 + y2) / 2]
}

class Cameleon {
	constructor(contener, x, y, toX, toY, color, child = null, canMove = false, negation = false) {
		this.x = x
		this.y = y
		this.color = color
		this.toX = toX
		this.toY = toY
		this.lparent = null
		this.rparent = null
		this.child = child
		this.canMove = canMove
		this.element = document.createElement('img')
		this.element.src = 'camaleonRouge.png'
		this.element.classList.add('cameleon')
		this.element.style.setProperty('--x', `${this.x}%`)
		this.element.style.setProperty('--y', `${this.y}%`)
		this.element.style.setProperty('--color', `${this.color}deg`)
		this.negation = negation
		if (negation) {
			this.bird = document.createElement('img')
			this.bird.src = 'bird.png'
			this.bird.classList.add('bird')
			let mid = middle(this.x, this.y, this.toX, this.toY)
			this.bird.style.setProperty('--x', `${mid[0] + 40}%`)
			this.bird.style.setProperty('--y', `${mid[1]}%`)
			contener.appendChild(this.bird)
		}

		this.element.addEventListener("click", () => {
			this.negate(() => {
				this.move()
			})
		})
		contener.appendChild(this.element)
	}

	cantBeMoved() {
		return !this.canMove && (this.lparent == null || this.rparent == null)
	}

	invertColor() {
		if (this.color == 0) {
			this.color = 140
		} else if (this.color == 140) {
			this.color  = 0
		}
		this.element.style.setProperty('--color', `${this.color}deg`)
	}

	negate(callback) {
		if (this.cantBeMoved()) {
			return
		}
		if (!this.negation) {
			callback()
			return
		}
		let mid = middle(this.x, this.y, this.toX, this.toY)
		this.x = mid[0]
		this.y = mid[1]
		this.element.style.setProperty('--x', `${this.x}%`)
		this.element.style.setProperty('--y', `${this.y}%`)
		setTimeout(() => {
			this.invertColor()
			setTimeout(callback, 800)
		}, 1500)
	}

	move() {
		if (this.cantBeMoved()) {
			return
		}

		this.x = this.toX
		this.y = this.toY
		this.element.style.setProperty('--x', `${this.x}%`)
		this.element.style.setProperty('--y', `${this.y}%`)
		if (this.child) {
			setTimeout(() => {
				this.child.cameleon.setParent(this, this.child.left)
			}, 1500)
		}
	}

	setColor(color) {
		console.log("Set color", color)
		this.color = color
		this.element.style.setProperty('--color', `${this.color}deg`)
	}

	setParent(parent, left) {
		if (left) {
			this.lparent = parent
		} else {
			this.rparent = parent
		}
		if (this.rparent != null && this.lparent != null) {
			this.calcNewColor(this.lparent.color, this.rparent.color)
		}
	}

	calcNewColor(c1, c2, propagation = true) {
		console.log("Calc new color", c1, c2)
		if (c1 == c2) {
			this.setColor(c1)
		} else if (propagation){
			this.lparent.calcNewColor(this.color, c2, false)
			this.rparent.calcNewColor(c1, this.color, false)
		}
	}
}