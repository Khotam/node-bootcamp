class AppError extends Error {
    constructor(code, message) {
        super(message);
        this.statusCode = code;
    }
}

// new AppError(400, "messsage")
// const error = new Error("message")
// error.statusCode = code
// error.statusCode
// error.message
module.exports = AppError;

// class Person {
//     walk() {}
//     speak() {}
// }

// class Zafar  extends Person{}

// const zafar = new Zafar()
// zafar.walk()
