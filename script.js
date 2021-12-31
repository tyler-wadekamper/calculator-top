class Container {
    constructor() {
        this.screen = new Screen(this);
        this.engine = new Engine(this);
        this.keypad = new Keypad(this);
        this.state = new State(this);
    }

    handleNumber(number) {
        this.state.handleNumber(number);
    }

    handleAdd() {
        this.state.handleAdd();
    }

    handleSubtract() {
        this.state.handleSubtract();
    }

    handleMultiply() {
        this.state.handleMultiply();
    }

    handleDivide() {
        this.state.handleDivide();
    }

    handleBack() {
        this.state.handleBack();
    }

    handleClear() {
        this.state.handleClear();
    }

    handleSubmit() {
        this.state.handleSubmit();
    }

    handleResult(result) {
        this.screen.handleResult(result);
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