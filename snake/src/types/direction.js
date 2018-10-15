class Direction {
    constructor(value) {
        this.value = value
    }

    negated() {
        return new Direction(-this.value)
    }

    toOffset() {
        if (this.value === -1 || this.value === 1) {
            return {
                x: this.value,
                y: 0
            }

        }
        return {
            x: 0,
            y: this.value/2
        }
    }

    rotateTo(other) {
        if (this.value === other.value) {
            return 0
        }
        if (this.value === -other.value) {
            return 180
        }
        if (this.value === 2 || this.value === -2) {
            return -90 * (this.value / 2) * other.value
        }
        if (this.value === 1 || this.value === -1) {
            return -90 * this.value * (other.value / 2)
        }
    }

    static from_arrow(keyCode) {
        switch(keyCode) {
            case "ArrowUp": // UP
                return new Direction(-2)
            case "ArrowLeft": // LEFT
                return new Direction(-1)
            case "ArrowRight": // RIGHT
                return new Direction(1)
            case "ArrowDown": // DOWN
                return new Direction(2)
            default:
                console.error("WRONG KEYCODE")
                return null
        }
    }

    static get up() {
        return new Direction(-2)
    }

    static get left() {
        return new Direction(-1)
    }

    static get right() {
        return new Direction(1)
    }

    static get down() {
        return new Direction(2)
    }

    static equals(a, b) {
        return a.value === b.value
    }
}

export default Direction
