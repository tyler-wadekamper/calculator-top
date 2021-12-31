class Calculator {
    constructor() {
        this.screen = new Screen(this);
        this.engine = new Engine(this);
        this.keypad = new Keypad(this);
        this.state = new EmptyState(this);
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

class State {
    constructor(calculator) {
        this.calculator = calculator;
        this.screen = calculator.screen;
        this.engine = calculator.engine;
    }

    setEmptyState() {
        this.calculator.state = new EmptyState(this.calculator);
    }

    setNumberOnlyState() {
        this.calculator.state = new NumberOnlyState(this.calculator);
    }

    setNumberOperatorState() {
        this.calculator.state = new NumberOperatorState(this.calculator);
    }

    setNumberOperatorNumberState() {
        this.calculator.state = new NumberOperatorNumberState(this.calculator);
    }

    handleClear() {
        this.screen.clear();
    }

    // Each method exists and does nothing unless overridden
    handleNumber(number) {return;}
    handleAdd() {return;}
    handleSubtract() {return;}
    handleMultiply() {return;}
    handleDivide() {return;}
    handleBack() {return;}
    handleSubmit() {return;}
}

class EmptyState extends State {
    constructor(calculator) {
        super(calculator);
    }

    handleNumber(number) {
        this.screen.appendToCurrentLine(number);
        this.engine.appendToFirstNumber(number);
        this.setNumberOnlyState();
    }
}

class NumberOnlyState extends State {
    constructor(calculator) {
        super(calculator);
    }

    handleNumber(number) {
        this.screen.appendToCurrentLine(number);
        this.engine.appendToFirstNumber(number);
    }

    handleAdd() {
        this.screen.appendToCurrentLine('+');
        this.engine.operator = new Adder(this.engine);
        this.setNumberOperatorState();
    }

    handleSubtract() {
        this.screen.appendToCurrentLine('-');
        this.engine.operator = new Subtracter(this.engine);
        this.setNumberOperatorState();
    }

    handleMultiply() {
        this.screen.appendToCurrentLine('*');
        this.engine.operator = new Multiplier(this.engine);
        this.setNumberOperatorState();
    }

    handleDivide() {
        this.screen.appendToCurrentLine('/');
        this.engine.operator = new Divider(this.engine);
        this.setNumberOperatorState();
    }

    handleBack() {
        this.screen.removeCharacterFromCurrentLine();
        this.engine.removeCharacterFromFirstNumber();
        if(this.screen.isEmpty()) {
            this.setEmptyState();
        }
    }
}

class NumberOperatorState extends State {
    constructor(calculator) {
        super(calculator);
    }

    handleNumber(number) {
        this.screen.appendToCurrentLine(number);
        this.engine.appendToSecondNumber(number);
        this.setNumberOperatorNumberState();
    }

    handleBack() {
        this.screen.removeCharacterFromCurrentLine();
        this.engine.operator = null;
        this.setNumberOnlyState;
    }
}

class NumberOperatorNumberState extends State {
    constructor(calculator) {
        super(calculator);
    }

    handleNumber(number) {
        this.screen.appendToCurrentLine(number);
        this.engine.appendToSecondNumber(number);
    }

    handleBack() {
        this.screen.removeCharacterFromCurrentLine();
        this.engine.removeCharacterFromSecondNumber();
        if(this.screen.endsWithOperator()) {
            this.setNumberOperatorState();
        }
    }

    handleSubmit() {
        this.engine.evaluate();
        this.setEmptyState();
    }
}

class Screen {
    constructor() {
        this.contentLines = [];
        this.containerDiv = document.querySelector('.screen');
        this.addEmptyLine();
        this.numberOfLines = 1;
        this.addRefreshObservers();
        this.addContentLinesToContainer();
        this.OPERATORS_LIST = ['+', '-', '/', '*'];
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

    endsWithOperator() {
        let lastCharacter = this.currentLine.content.slice(-1);
        if(this.OPERATORS_LIST.includes(lastCharacter)) {
            return true;
        }
        else {
            return false;
        }
    }

    isEmpty() {
        let length = this.contentLines.length;
        let content = this.currentLine.content;
        if(length == 1 && content == '') {
            return true;
        } 
        else {
            return false;
        }
    }
    
    addEmptyLine() {
        this.contentLines.unshift(new ContentLine(this));
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

    refresh() {
        addContentLinesToContainer();
        if(this.contentLines.length > 8) {
            this.removeTopLine();
        }
    }

    addContentLinesToContainer() {
        this.contentLines.forEach(addLineToContainer);
    }

    addLineToContainer(contentLine) {
        contentLine.addToContainer();
    }

    addContainerObserver() {
        let observer = new MutationObserver(this.refresh);
        let observeConfig = {attributes: false, childList: true};

        observer.observe(this.containerDiv, observeConfig);
    }

    addLineObserver(contentLine) {
        contentLine.addRefreshObserver();
    }

    addRefreshObservers() {
        this.addContainerObserver();
        this.contentLines.forEach(addLineObserver);
    }
}

class ContentLine {
    constructor(screen) {
        this.screen = screen;
        this.containerDiv = this.screen.containerDiv;
        this.element = document.createElement('div');
        this.element.classList.add('screen-content');
        this.content = '';
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

    addRefreshObserver() {
        let observer = new MutationObserver(this.screen.refresh);
        let observeConfig = {attributes: true, childList: false};

        observer.observe(this.element, observeConfig);
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