function generateCode(len = 5) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < len; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}

module.exports = generateCode;
