import axios from 'axios'

import { BACKEND_LOCATION, IMAGE_BY_DTXSID_API } from '@/assets/store'


// Intended to check for valid inputs to spectrum fields, which would be a series of one or more lines where each line
// is two numbers separated by a space.
const SPECTRUM_REGEX = /^[0-9][0-9.]*\s[0-9][0-9.]*(\n[0-9][0-9.]*\s[0-9][0-9.]*)*$/


export async function doesImageExist(dtxsid) {
    // Quick check for whether an image at a given URL exists.  Intended for use with 
    const response = await axios.get(IMAGE_BY_DTXSID_API + dtxsid)
    return response.data.length > 0
}

export async function getSubstanceImageLink(dtxsid) {
    // Checks the CCTE API for a substance image; if it doesn't find one, check the Flask backend.  Return the API or
    // Flask link if an image was found on either of those, or null if no link was found.
    const first_response = await axios.get(IMAGE_BY_DTXSID_API + dtxsid)
    if (first_response.data.length > 0) {
        return IMAGE_BY_DTXSID_API + dtxsid
    }
    const second_response = await axios.get(BACKEND_LOCATION + "/get_image_for_dtxsid/" + dtxsid)
    if (second_response.data.length > 0) {
        return BACKEND_LOCATION + "/get_image_for_dtxsid/" + dtxsid
    }
    return null
}

export function timestampForFile() {
    // Generates a timestamp for a file, in the format YYYY-MM-DD_HHMMSS.
    const now = new Date()
    const day = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,"0")}-${now.getDate().toString().padStart(2,"0")}`
    const time = `${now.getHours().toString().padStart(2,"0")}${now.getMinutes().toString().padStart(2,"0")}${now.getSeconds().toString().padStart(2,"0")}`
    return day + "_" + time
}

export function validateSpectrumInput(spectrum_text) {
    // Intended to test the format of an input spectrum to see if it's valid.
    return SPECTRUM_REGEX.test(spectrum_text)
}