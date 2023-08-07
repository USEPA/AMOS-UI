// Intended to check for valid inputs to spectrum fields, which would be a series of one or more lines where each line
// is two numbers separated by a space.
const SPECTRUM_REGEX = /^[0-9][0-9.]*\s[0-9][0-9.]*(\n[0-9][0-9.]*\s[0-9][0-9.]*)*$/

export function validateSpectrumInput(spectrum_text) {
    return SPECTRUM_REGEX.test(spectrum_text)
}