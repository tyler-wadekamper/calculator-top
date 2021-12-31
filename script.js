class Container {
    constructor() {
        this.screen = new Screen(this);
        this.engine = new Engine(this);
        this.keypad = new Keypad(this);
        this.state = new State(this);
    }

    handleNumber(number) {

    }

    handleAdd() {

    }

    handleSubtract() {

    }

    handleMultiply() {

    }

    handleDivide() {

    }
}

class Stack {
    constructor() {
        this._contents = [];
    }

    push(newItem) {
        this._contents.unshift(newItem);
    }

    pop() {
        return this._contents.shift();
    }

    peek() {
        return this._contents[0];
    }

    length() {
        return this._contents.length;
    }

    map(callBack) {
        this._contents = this._contents.map(callBack);
        return this;
    }
}