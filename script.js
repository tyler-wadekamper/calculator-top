class Stack {
    constructor() {
        this.contents = [];
    }

    push(newItem) {
        this.contents.unshift(newItem);
    }

    pop() {
        return this.contents.shift();
    }

    peek() {
        return this.contents[0];
    }

    length() {
        return this.contents.length;
    }

    map(callBack) {
        return this.contents.map(callBack);
    }

}