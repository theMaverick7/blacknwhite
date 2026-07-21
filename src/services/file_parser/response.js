export class response {
    constructor(text, mimetype, length, success, err) {
        this.text = text;
        this.mimetype = mimetype;
        this.length = length;
        this.success = success;
        this.err = err;
    }
}