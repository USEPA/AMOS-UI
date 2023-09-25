
import axios from 'axios'

import { IMAGE_BY_DTXSID_API } from '@/assets/store'


// Intended to check for valid inputs to spectrum fields, which would be a series of one or more lines where each line
// is two numbers separated by a space.
const SPECTRUM_REGEX = /^[0-9][0-9.]*\s[0-9][0-9.]*(\n[0-9][0-9.]*\s[0-9][0-9.]*)*$/

export async function doesImageExist(dtxsid) {
    // Quick check for whether an image at a given URL exists.  Intended for use with 
    const response = await axios.get(IMAGE_BY_DTXSID_API + dtxsid)
    return response.data.length > 0
}

export function objectArrayToCSV(object_list) {
    // Supposed to convert an array of objects to a CSV string for download.  Edge cases involving quotes aren't handled
    // properly, though.
    const header = Object.keys(object_list[0]).join(",")
    const rows = object_list.map(obj => Object.values(obj).map(val => {
        if (typeof(val) === 'string' && val.includes(",")){
            return `"${val}"`
        }
        return val
    }).join(",")).join("\n")
    return header + "\n" + rows
}

export function validateSpectrumInput(spectrum_text) {
    return SPECTRUM_REGEX.test(spectrum_text)
}