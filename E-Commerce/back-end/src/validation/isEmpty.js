/**
 * Checks if a value is empty (undefined, null, empty string, or empty object)
 * @param {*} value - The value to check
 * @returns {boolean} - Returns true if the value is empty, false otherwise
 */
const isEmpty = (value) => 
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);

export default isEmpty;
