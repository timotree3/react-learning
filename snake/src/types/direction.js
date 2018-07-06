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
            y: this.value<<1
        }
    }

    static from_arrow(keyCode) {
        switch(keyCode) {
            case 38: // UP
                return new Direction(-2)
            case 37: // LEFT
                return new Direction(-1)
            case 39: // RIGHT
                return new Direction(1)
            case 40: // DOWN
                return new Direction(2)
            default:
                console.error("WRONG KEYCODE")
        }
    }

    static get up() {
        return new Direction(-2)
    }

    static get left() {
        return new Direction(-1)
    }

    static get right() {
        return new Direction(0)
    }

    static get down() {
        return new Direction(1)
    }
}

export default Direction