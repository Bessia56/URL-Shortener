/**
 * Генерирует случайный короткий код заданной длины.
 *
 * Использует латинские буквы в верхнем и нижнем регистре,
 * а также цифры от 0 до 9.
 *
 * @param {number} [len=5] - Длина генерируемого кода.
 * @returns {string} Случайная строка заданной длины.
 */
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
