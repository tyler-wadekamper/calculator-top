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
}

class State {
    constructor(calculator) {
        this.calculator = calculator;
        this.screen = calculator.screen;
        this.engine = calculator.engine;
        this.keypad = calculator.keypad;
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

    setResultState() {
        this.calculator.state = new ResultState(this.calculator);
    }

    setPeriodOnlyState() {
        this.calculator.state = new PeriodOnlyState(this.calculator);
    }

    disablePeriod() {
        this.keypad.periodButton.disable();
    }

    enablePeriod() {
        this.keypad.periodButton.enable();
    }

    handleClear() {
        this.screen.clear();
        this.engine.reset();
        this.setEmptyState();
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
        this.enablePeriod();
    }

    handleNumber(number) {
        this.screen.appendToCurrentLine(number);
        this.engine.appendToFirstNumber(number);
        this.setNumberOnlyState();
        if(number == ".") {
            this.setPeriodOnlyState();
        }
    }
} 

class PeriodOnlyState extends State {
    constructor(calculator) {
        super(calculator);
        this.disablePeriod();
    }

    handleNumber(number) {
        this.screen.appendToCurrentLine(number);
        this.engine.appendToFirstNumber(number);
        this.setNumberOnlyState();
    }

    handleBack() {
        if(this.screen.currentLine.content.slice(-1) == ".") {
            this.enablePeriod()
        }
        this.screen.removeCharacterFromCurrentLine();
        this.engine.removeCharacterFromFirstNumber();
        if(this.screen.isEmpty()) {
            this.setEmptyState();
        }
    }
}

class NumberOnlyState extends State {
    constructor(calculator) {
        super(calculator);
    }

    handleNumber(number) {
        this.screen.appendToCurrentLine(number);
        this.engine.appendToFirstNumber(number);
        if(number == ".") {
            this.disablePeriod();
        }
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
        if(this.screen.currentLine.content.slice(-1) == ".") {
            this.enablePeriod()
        }
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
        this.enablePeriod();
    }

    handleNumber(number) {
        this.screen.appendToCurrentLine(number);
        this.engine.appendToSecondNumber(number);
        this.setNumberOperatorNumberState();
        if(number == ".") {
            this.disablePeriod();
        }
    }

    handleBack() {
        if(this.screen.currentLine.content.slice(-1) == ".") {
            this.enablePeriod()
        }
        this.screen.removeCharacterFromCurrentLine();
        this.engine.operator = null;
        this.setNumberOnlyState();
    }
}

class NumberOperatorNumberState extends State {
    constructor(calculator) {
        super(calculator);
        this.enablePeriod();
    }

    handleNumber(number) {
        this.screen.appendToCurrentLine(number);
        this.engine.appendToSecondNumber(number);
        if(number == ".") {
            this.disablePeriod();
        }
    }

    handleBack() {
        if(this.screen.currentLine.content.slice(-1) == ".") {
            this.enablePeriod()
        }
        this.screen.removeCharacterFromCurrentLine();
        this.engine.removeCharacterFromSecondNumber();
        if(this.screen.endsWithOperator()) {
            this.setNumberOperatorState();
        }
    }

    handleSubmit() {
        let result = this.engine.evaluate();
        this.screen.addEmptyLine();
        this.screen.appendToCurrentLine(result);
        this.setResultState();
    }
}

class ResultState extends State {
    constructor(calculator) {
        super(calculator);
        this.enablePeriod();
    }

    handleNumber(number) {
        let lastResult = this.engine.lastResult;
        this.screen.removeContentLine(this.screen.currentLine);
        this.screen.appendToCurrentLine(`=${lastResult}`);
        this.screen.addEmptyLine();
        this.screen.appendToCurrentLine(number);
        this.engine.firstNumberString = number.toString();
        this.setNumberOnlyState();
        if(number == ".") {
            this.disablePeriod();
        }
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
        if(this.screen.currentLine.content.slice(-1) == ".") {
            this.enablePeriod()
        }
        this.screen.removeCharacterFromCurrentLine();
        this.engine.removeCharacterFromFirstNumber();
        if(this.screen.isEmpty()) {
            this.setEmptyState();
        }
    }

    handleSubmit() {
        this.screen.removeContentLine(this.screen.currentLine);
        let lastResult = this.engine.lastResult;
        this.screen.appendToCurrentLine(`=${lastResult}`);
        this.screen.addEmptyLine();
        this.engine.firstNumberString = '';
        this.setEmptyState();
    }
}

class Screen {
    constructor() {
        this.contentLines = [];
        this.containerDiv = document.querySelector('.screen');
        this.addEmptyLine();
        this.addContainerObserver();
        this.OPERATORS_LIST = ['+', '-', '/', '*'];
    }

    get currentLine() {
        return this.contentLines[0];
    }

    get topVisibleLine() {
        return this.visibleLines.slice(-1)[0];
    }

    get visibleLines() {
        return this.contentLines.filter(this.isVisible);
    }

    get previousLine() {
        return this.contentLines[1];
    }

    isVisible(contentLine) {
        return contentLine.isVisible();
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
        let newLine = new ContentLine(this)
        this.contentLines.unshift(newLine);        
    }

    clear() {
        this.contentLines.forEach(this.removeContentLine.bind(this));
        this.addEmptyLine();
    }
    
    clearCurrentLine() {
        this.currentLine.content = '';
    }

    removeContentLine(contentLine) {
        contentLine.removeFromContainer();
        this.contentLines = this.contentLines.filter(line => line !== contentLine);
    }

    appendToCurrentLine(newText) {
        this.currentLine.appendText(newText);
        this.checkLineLength(this.currentLine);
    }

    removeCharacterFromCurrentLine() {
        this.currentLine.removeCharacter();
    }

    hideTopVisibleLine() {
        this.topVisibleLine.hide();
    }

    refresh() {
        let length = this.visibleLines.length;
        if(length > 8) {
            this.hideTopVisibleLine();
        }
    }

    checkLineLength(contentLine) {
        let overflow = '';
        if(contentLine.content.length > 12) {
            overflow = contentLine.content.slice(12);
            contentLine.content = contentLine.content.slice(0, 12);
            this.addEmptyLine();
            this.appendToCurrentLine(overflow);
        }
    }

    addContainerObserver() {
        let observer = new MutationObserver(this.refresh.bind(this));
        let observeConfig = {attributes: false, childList: true};

        observer.observe(this.containerDiv, observeConfig);
    }
}

class ContentLine {
    constructor(screen) {
        this.screen = screen;
        this.containerDiv = this.screen.containerDiv;
        this.element = document.createElement('div');
        this.element.classList.add('screen-content');
        this.element.classList.add('visible');
        this.addToContainer();
        this.observer = new MutationObserver(this.screen.refresh.bind(this.screen));
        this.observeConfig = {attributes: true, childList: false};
        this.content = '';
    }

    set content(newContent) {
        this.element.innerText = newContent;
    }

    get content() {
        return this.element.innerText;
    }

    isVisible() {
        return this.element.classList.contains('visible');
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
        this.element.classList.remove('visible');
        this.element.classList.add('hidden');
    }

    enableRefreshObserver() {
        observer.observe(this.element, observeConfig);
    }

    disableRefreshObserver() {
        observer.disconnect();
    }
}

class Engine {
    constructor(calculator) {
        this.calculator = calculator;
        this.operator = null;
        this.firstNumberString = '';
        this.secondNumberString = '';
        this.lastResult = null;
    }

    reset() {
        this.operator = null;
        this.firstNumberString = '';
        this.secondNumberString = '';
    }

    evaluate() {
        this.lastResult = this.operator.evaluate();
        this.firstNumberString = this.lastResult.toString();;
        this.secondNumberString = '';
        this.operator = null;
        return this.lastResult;
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
        if(this.secondNumber == 0) {
            return "ERROR: DIV 0";
        }
        return this.firstNumber / this.secondNumber;
    }
}

class Keypad {
    constructor(calculator) {
        this.calculator = calculator;
        this.buttonCreator = new ButtonCreator(this);
        this.periodButton = null;
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
        if(element.innerText == '.') {
            this.keypad.periodButton = new NumberButton(this.keypad, element);
            return;
        }
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
        this.element.addEventListener('mousedown', this.setPressed);
        this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.setUnpressed.bind(this));
        this.element.classList.add('enabled');
    }

    setPressed() {
        this.classList.add('pressed');
    }

    setUnpressed() {
        this.element.classList.remove('pressed');
    }

    disable() {
        this.element.classList.add('disabled');
        this.element.classList.remove('enabled');
    }

    enable() {
        this.element.classList.add('enabled');
        this.element.classList.remove('disabled');
    }
}

class NumberButton extends KeypadButton {
    constructor(keypad, element) {
        super(keypad, element);
    }
    
    handleMouseDown() {
        let buttonNumber = this.element.dataset.value;
        if(this.element.classList.contains('enabled'))  {
            this.keypad.sendNumber(buttonNumber);
        }
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