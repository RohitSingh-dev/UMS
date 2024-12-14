class TextBox {
    constructor(
        text = "Text", cursorX = 0, cursorY = 0, padding = 5, maxLines = 50, isFocused = true,
        cursorVisible = true, fontSize = 20, fontColor = 'black', maxCharacters = 100, fill = "rgba(255, 255, 255, 1)",
        strokeColor = 'black', stokeWidth = 1) {
        this.text = text;
        this.isFocused = isFocused;
        this.cursorVisible = cursorVisible;
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.font = 'font Arial';
        this.padding = padding;
        this.maxLines = maxLines;
        this.fontSize = fontSize;
        this.fontColor = fontColor;
        this.maxCharacters = maxCharacters;
        this.fill = fill;
        this.strokeColor = strokeColor;
        this.strokeWidth = stokeWidth;
    }


}

export default TextBox;