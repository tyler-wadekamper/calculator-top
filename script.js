class Container {
    constructor() {
        this.screen = new Screen();
        this.engine = new Engine();
        this.keypad = new Keypad();

        this.screen.container = this;
        this.engine.container = this;
        this.keypad.container = this;
    }
}

class ContainerItem {
    constructor() {
        this.container = null;
    }
}

class Screen extends ContainerItem {
    constructor() {
        super();
        this.content = "";
        this.containerDiv = document.querySelector('.screen');
        this.contentDiv = this.createContentDiv();
        this.containerDiv.appendChild(this.contentDiv);
        this.numberOfLines = 0;
    }

    createContentDiv() {
        let contentDiv = document.createElement('div');
        contentDiv.classList.add('screen-content');
        return contentDiv;
    }

    display(textToDisplay) {
        this.contentDiv.innerText += textToDisplay;
        this.containerDiv.appendChild(this.contentDiv);
    }

    displayNewLine(newText) {
        let newLineDiv = this.createContentDiv();
        newLineDiv.innerText = newText;
        this.containerDiv.appendChild(newLineDiv);
        this.numberOfLines++;
        this.checkNumberOfLines();
    }

    checkNumberOfLines() {
        if(this.numberOfLines >= 9) {
            this.removeTopLine();
        }
    }

    removeTopLine() {
        this.containerDiv.removeChild(this.containerDiv.childNodes[1]);
    }

    clear() {
        let nodeLength = this.containerDiv.childNodes.length;
        for(let i = nodeLength - 1; i >= 0; i--) {
            this.containerDiv.removeChild(this.containerDiv.childNodes[i]);
        }
        this.numberOfLines = 0;
    }

    removeCharacter() {
        let stringContent = this.contentDiv.innerText;
        this.contentDiv.innerText = stringContent.slice(0, stringContent.length-1);
        this.containerDiv.appendChild(this.contentDiv);
    }
}

class Engine extends ContainerItem {
    constructor() {
        super();
        this.firstNumber = '';
        this.secondNumber = '';
        this.operator = '';
        this.state = 'preOperator';
    }

    reset(result) {
        this.firstNumber = result;
        this.secondNumber = '';
        this.operator = '';
        this.state = 'preOperator';
    }

    calculate() {
        let firstNumber = Number(this.firstNumber);
        let secondNumber = Number(this.secondNumber);
        let result = 0;
        switch(this.operator) {
            case 'add':
                result = firstNumber + secondNumber;
                break;
            case 'subtract':
                result = firstNumber - secondNumber;
                break;
            case 'multiply':
                result = firstNumber * secondNumber;
                break;
            case 'divide':
                result = firstNumber / secondNumber;
                break;
        }
        this.reset(result);
        return result;
    }

    takeNumber(numberString) {
        this.container.screen.display(numberString);
        if(this.state == 'preOperator') {
            this.firstNumber += numberString;
            return;
        }

        if(this.state == 'postOperator') {
            this.secondNumber += numberString;
            return;
        }
    }

    takeOperator(operatorElement) {
        if(this.state == 'preOperator') {
            this.operator = operatorElement.dataset.value;
            this.container.screen.display(operatorElement.dataset.symbol);
            this.state = 'postOperator';
        }

        if(this.state == 'postOperator') {
            return;
        }
    }

    takeSubmit() {
        if(this.state == 'preOperator') {
            return;
        }

        if(this.state == 'postOperator') {
            this.container.screen.displayNewLine(this.calculate());
            return;
        }
    }
}

class Keypad extends ContainerItem { 
    constructor() {
        super();
        this.buttonObjects = this.createButtonObjects();
        this.addKeypadToButtons();
    }
    
    addKeypadToButtons() {
        this.buttonObjects.forEach(this.addContainer.bind(this));
    }

    addContainer(buttonObject) {
        buttonObject.keypad = this;
    }

    createButtonObjects() {
        let returnArray = [];
        returnArray = returnArray.concat(this.createNumberButtons());
        returnArray = returnArray.concat(this.createOperatorButtons());
        returnArray = returnArray.concat(this.createControlButtons());
        returnArray.push(this.createSubmitButton());
        return returnArray;
    }

    createNumberButtons() {
        const numberButtonArray = Array.from(document.querySelectorAll('.button.number'));
        return numberButtonArray.map(this.createNumberButton);
    }

    createOperatorButtons() {
        const operatorButtonArray = Array.from(document.querySelectorAll('.button.operator'));
        return operatorButtonArray.map(this.createOperatorButton);
    }

    createControlButtons() {
        const controlButtonArray = Array.from(document.querySelectorAll('.button.control'));
        return controlButtonArray.map(this.createControlButton);
    }

    createNumberButton(buttonElement) {
        return new NumberButton(buttonElement);
    }

    createOperatorButton(buttonElement) {
        return new OperatorButton(buttonElement);
    }

    createControlButton(buttonElement) {
        return new ControlButton(buttonElement);
    }

    createSubmitButton(buttonElement) {
        return new SubmitButton(document.querySelector('.button.submit'));
    }
}

class KeypadItem {
    constructor() {
        this.container = null;
    }
}

class Button extends KeypadItem {
    constructor(buttonElement) {
        super();
        this.buttonElement = buttonElement;
        this.buttonElement.addEventListener('click', this.handleMouseDown.bind(this));
    }
}

class NumberButton extends Button {
    constructor(buttonElement) {
        super(buttonElement);
    }

    handleMouseDown(event) {
        this.keypad.container.engine.takeNumber(this.buttonElement.dataset.value);
    }
}

class OperatorButton extends Button {
    constructor(buttonElement) {
        super(buttonElement);
    }

    handleMouseDown(event) {
        this.keypad.container.engine.takeOperator(this.buttonElement);
    }
}

class ControlButton extends Button {
    constructor(buttonElement) {
        super(buttonElement);
    }

    handleMouseDown(event) {
        if(this.buttonElement.dataset.value == "clear") {
            this.keypad.container.screen.clear();
            return;
        }
        if(this.buttonElement.dataset.value == "back") {
            this.keypad.container.screen.removeCharacter();
            return;
        }
    }
}

class SubmitButton extends Button {
    constructor(buttonElement) {
        super(buttonElement);
    }

    handleMouseDown(event) {
        this.keypad.container.engine.takeSubmit();
    }
}

let calculatorContainer = new Container();