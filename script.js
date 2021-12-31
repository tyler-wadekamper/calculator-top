class Calculator {
    constructor() {
        // this.screen = new Screen(this);
        this.engine = new Engine(this);
        this.keypad = new Keypad(this);
        // this.state = new State(this);
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

class Keypad {
    constructor(calculator) {
        this.calculator = calculator;
        this.buttonCreator = new ButtonCreator(this);
        this.buttonCreator.createButtons();
    }

    sendNumber(buttonNumber) {
        this.calculator.handleNumber(buttonNumber);
    }

    sendAdd() {
        this.calculator.handleAdd();
    }

    sendSubtract() {
        this.calculator.handleSubtract();
    }

    sendMultiply() {
        this.calculator.handleMultiply();
    }

    sendDivide() {
        this.calculator.handleDivide();
    }

    sendBack() {
        this.calculator.handleBack();
    }

    sendClear() {
        this.calculator.handleClear();
    }

    sendSubmit() {
        this.calculator.handleSubmit();
    }
}

class ButtonCreator {
    constructor(keypad) {
        this.keypad = keypad;
    }

    createButtons() {
        this.createNumberButtons();
        this.createAddButton();
        this.createSubtractButton();
        this.createMultiplyButton();
        this.createDivideButton();
        this.createBackButton();
        this.createClearButton();
        this.createSubmitButton();
    }

    getButtonElementByClass(buttonClass) {
        return document.querySelector(`.${buttonClass}.button`);
    }

    createNumberButtons() {
        let numberButtonElements = Array.from(document.querySelectorAll(`.number.button`));
        numberButtonElements.map(this.createNumberButton.bind(this));
    }

    createNumberButton(element) {
        new NumberButton(this.keypad, element);
    }

    createAddButton() {
        new AddButton(this.keypad, this.getButtonElementByClass('add'));
    }

    createSubtractButton() {
        new SubtractButton(this.keypad, this.getButtonElementByClass('subtract'));
    }

    createMultiplyButton() {
        new MultiplyButton(this.keypad, this.getButtonElementByClass('multiply'));
    }

    createDivideButton() {
        new DivideButton(this.keypad, this.getButtonElementByClass('divide'));
    }

    createBackButton() {
        new BackButton(this.keypad, this.getButtonElementByClass('back'));
    }

    createClearButton() {
        new ClearButton(this.keypad, this.getButtonElementByClass('clear'));
    }

    createSubmitButton() {
        new SubmitButton(this.keypad, this.getButtonElementByClass('submit'));
    }
}
class KeypadButton {
    constructor(keypad, element) {
        this.keypad = keypad;
        this.element = element;
        this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    }
}

class NumberButton extends KeypadButton {
    constructor(keypad, element) {
        super(keypad, element);
    }
    
    handleMouseDown() {
        let buttonNumber = this.element.dataset.value;
        this.keypad.sendNumber(buttonNumber);
    }
}

class AddButton extends KeypadButton {
    constructor(keypad, element) {
        super(keypad, element);
    }

    handleMouseDown() {
        this.keypad.sendAdd();
    }
}

class SubtractButton extends KeypadButton {
    constructor(keypad, element) {
        super(keypad, element);
    }

    handleMouseDown() {
        this.keypad.sendSubtract();
    }
}

class DivideButton extends KeypadButton {
    constructor(keypad, element) {
        super(keypad, element);
    }

    handleMouseDown() {
        this.keypad.sendDivide();
    }
}

class MultiplyButton extends KeypadButton {
    constructor(keypad, element) {
        super(keypad, element);
    }

    handleMouseDown() {
        this.keypad.sendMultiply();
    }
}

class BackButton extends KeypadButton {
    constructor(keypad, element) {
        super(keypad, element);
    }

    handleMouseDown() {
        this.keypad.sendBack();
    }
}

class ClearButton extends KeypadButton {
    constructor(keypad, element) {
        super(keypad, element);
    }

    handleMouseDown() {
        this.keypad.sendClear();
    }
}

class SubmitButton extends KeypadButton {
    constructor(keypad, element) {
        super(keypad, element);
    }

    handleMouseDown() {
        this.keypad.sendSubmit();
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

let calculator = new Calculator();