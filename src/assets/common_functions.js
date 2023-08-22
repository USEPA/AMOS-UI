// Intended to check for valid inputs to spectrum fields, which would be a series of one or more lines where each line
// is two numbers separated by a space.

const SPECTRUM_REGEX = /^[0-9][0-9.]*\s[0-9][0-9.]*(\n[0-9][0-9.]*\s[0-9][0-9.]*)*$/

export function validateSpectrumInput(spectrum_text) {
    return SPECTRUM_REGEX.test(spectrum_text)
}

export function objectArrayToCSV(object_list) {
    const header = Object.keys(object_list[0]).join(",")
    const rows = object_list.map(obj => Object.values(obj).map(val => {
        if (typeof(val) === 'string' && val.includes(",")){
            return `"${val}"`
        }
        return val
    }).join(",")).join("\n")
    return header + "\n" + rows
}
