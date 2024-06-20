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

export function imageLinkForSubstance(dtxsid, image_in_comptox) {
    // Determines the link for a substance's image, based on the DTXSID and a database flag for the location -- the 
    // flag can be either true (use CompTox's API), false (use AMOS's stored image), or null (no image exists).
    // Note: I don't intend to store the links directly in the database, since BACKEND_LOCATION is an environment
    // variable that changes between the local and deployed versions (maybe more in the future)
    if (image_in_comptox === true) {
        return IMAGE_BY_DTXSID_API + dtxsid
      } else if (image_in_comptox === false) {
        return `${BACKEND_LOCATION}/get_image_for_dtxsid/${dtxsid}`
      } else {
        return null
      }
}

export function rescaleSpectrum(spectrum) {
    // Rescales a given spectrum so that the maximum intensity is 100.
    const max_intensity = Math.max(...spectrum.map(x => x[1]))
    for (let i=0; i<spectrum.length; i++) {
        spectrum[i][1] = 100 * spectrum[i][1]/max_intensity
    }
    return spectrum
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