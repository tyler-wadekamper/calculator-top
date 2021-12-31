class Calculator {
    constructor() {
        this.screen = new Screen(this);
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

class Screen {
    constructor() {
        this.contentLines = [];
        this.addEmptyLine();
        this.numberOfLines = 1;
    }

    get numberOfLines() {
        return this.contentLines.length;
    }

    get currentLine() {
        return this.contentLines[0];
    }

    get topLine() {
        return this.contentLines.slice(-1);
    }

    addEmptyLine() {
        this.contentLines.unshift(new ContentLine());
    }

    clear() {
        this.contentLines.forEach(removeContentLine);
        this.addEmptyLine();
    }

    removeContentLine(contentLine) {
        contentLine.removeFromContainer();
    }

    appendToCurrentLine(newText) {
        this.currentLine.appendText(newText);
    }

    removeCharacterFromCurrentLine() {
        this.currentLine.removeCharacter();
    }

    handleResult(result) {
        this.addEmptyLine();
        this.appendToCurrentLine(result);
    }

    hideTopLine() {
        this.topLine.hide();
    }

    refreshScreen() {
        if(this.contentLines.length > 8) {
            this.removeTopLine();
        }
    }
}

class ContentLine {
    constructor(containerDiv) {
        this.containerDiv = containerDiv;
        this.element = document.createElement('div');
        this.element.classList.add('screen-content');
        this.content = '';
        this.addToContainer();
    }

    set content(newContent) {
        this.element.innerText = newContent;
    }

    get content() {
        return this.element.innerText;
    }

    addToContainer() {
        this.containerDiv.appendChild(this.element);
    }

    appendText(newText) {
        this.content += newText;
    }

    removeFromContainer() {
        this.containerDiv.removeChild(this.element);
    }

    removeCharacter() {
        this.content = this.content.slice(0, -1);
    }

    hide() {
        this.element.classList.add('hidden');
    }
}

class Engine {
    constructor(calculator) {
        this.calculator = calculator;
        this.operator = null;
        this.firstNumberString = '';
        this.secondNumberString = '';
    }

    evaluate() {
        let result = this.operator.evaluate();
        this.calculator.handleResult(result);
    }

    appendToFirstNumber(newText) {
        this.firstNumberString += newText;
    }

    appendToSecondNumber(newText) {
        this.secondNumberString += newText;
    }

    removeCharacterFromFirstNumber() {
        this.firstNumberString = this.firstNumberString.slice(0, -1);
    }

    removeCharacterFromSecondNumber() {
        this.secondNumberString = this.secondNumberString.slice(0, -1);
    }
}

class Operator {
    constructor(engine) {
        this.engine = engine;
        this.firstNumber = null;
        this.secondNumber = null;
    }

    getEngineNumbers() {
        this.firstNumber = Number(this.engine.firstNumberString);
        this.secondNumber = Number(this.engine.secondNumberString);
    }
}

class Adder extends Operator {
    constructor(engine) {
        super(engine);
    }

    evaluate() {
        this.getEngineNumbers();
        return this.firstNumber + this.secondNumber;
    }

}

class Subtracter extends Operator {
    constructor(engine) {
        super(engine);
    }

    evaluate() {
        this.getEngineNumbers();
        return this.firstNumber - this.secondNumber;
    }
}

class Multiplier extends Operator {
    constructor(engine) {
        super(engine);
    }

    evaluate() {
        this.getEngineNumbers();
        return this.firstNumber * this.secondNumber;
    }
}

class Divider extends Operator {
    constructor(engine) {
        super(engine);
    }

    evaluate() {
        this.getEngineNumbers();
        return this.firstNumber / this.secondNumber;
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

let calculator = new Calculator();