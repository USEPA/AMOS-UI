import axios from 'axios'

import { BACKEND_LOCATION, IMAGE_BY_DTXSID_API, SOURCE_ABBREVIATION_MAPPING } from '@/assets/store'


// Intended to check for valid inputs to spectrum fields, which would be a series of one or more lines where each line
// is two numbers separated by non-line-breaking space.
const SPECTRUM_REGEX = /^[0-9][0-9.]*\s+[0-9][0-9.]*(\n[0-9][0-9.]*\s+[0-9][0-9.]*)*$/


export function calculateMassRange(mass_target, error_range, error_type) {
    // Calculates a mass range given a central value `mass_target`, a range `eror_range`, and
    // whether the range is by Daltons ("da") or parts per million ("ppm").
    if (error_type == "da"){
        return [mass_target - error_range, mass_target + error_range]
    } else if (error_type == "ppm") {
        const mass_change = mass_target * error_range / 1000000.0
        return [mass_target - mass_change, mass_target + mass_change]
    } else {
        return [null, null]
    }
}


export function constrainNumber(value, minimum, maximum) {
    // Constrains a numeric value to be between the specified minimum and maximum.
    return Math.min(Math.max(value, minimum), maximum)
}


export function filtersToURL(base_url, filter_list) {
    // Converts the information in the list of filters to a "standardized" query parameter string attached to a given
    // URL.  This function is specifically intended to work with the output of the this.gridApi.getFilterModle()
    // function, and is currently assuming that only one filter per field is in use.
    if (filter_list.length == 0) { return "" }
    var param_string = ""
    const active_filter_keys = Object.keys(filter_list)
    for (let k of active_filter_keys) {
        var current_filter = filter_list[k]
        if (current_filter.filterType == "text") {
            if (current_filter.type == "blank" || current_filter.type == "notBlank") {
                param_string = param_string + `${k}=${current_filter.type}&`
            } else {
                param_string = param_string + `${k}=${current_filter.type}_${current_filter.filter}&`
            }
        } else if (current_filter.filterType == "number") {
            if (current_filter.type == "blank" || current_filter.type == "notBlank") {
                param_string = param_string + `${k}=${current_filter.type}&`
            } else if (current_filter.type == "inRange") {
                param_string = param_string + `${k}=${current_filter.type}_${current_filter.filter}_${current_filter.filterTo}&`
            } else {
                param_string = param_string + `${k}=${current_filter.type}_${current_filter.filter}&`
            }
        } else if (current_filter.filterType == "set") {
            // TODO: cases for different numeric filters; the one for a range needs special handling in particular
            param_string = param_string + `${k}=${current_filter.values.join("_")}&`
        } else {
          continue
        }
    }
    return base_url + "?" + param_string
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

export function queryParamsToFilters(params, numeric_filters, set_filters, text_filters) {
    // Translates a list of URL query parameters into an object that can be loaded into the filters.  Filters are
    // currently hardcoded to stick to the default filtering method (e.g., substring searches for text fields), but
    // that should change once I figure out a good way to handle all the possible cases.
    const param_names = Object.keys(params)
    var filter_info = {}
    for (const k of param_names) {
        if (numeric_filters.includes(k)) {
            var field = params[k]
            if (field == "blank" || field == "notBlank") {
                filter_info[k] = {filterType: 'number', type: field}
            } else if (field.startsWith("inRange_")) {
                var values = field.split("_")
                filter_info[k] = {filterType: 'number', type: 'inRange', filter: Number(values[1]), filterTo: Number(values[2])}
            } else {
                var values = field.split("_")
                filter_info[k] = {filterType: 'number', type: values[0], filter: Number(values[1])}
            }
        }
        else if (set_filters.includes(k)) {
            if (params[k] !== "") {
                var values = params[k].split("_")
                filter_info[k] = {filterType: "set", values: values}
            }
        } else if (text_filters.includes(k)) {
            var text = params[k]
            if (text == "blank" || text == "notBlank") {
                filter_info[k] = {filterType: 'text', type: text}
            } else {
                var idx = text.indexOf("_")
                filter_info[k] = {filter: text.slice(idx+1), filterType: 'text', type: text.slice(0,idx)}
            }
        } else {
            // maybe code up a warning for this case
            continue
        }
    }
    return filter_info
}

export function rescaleSpectrum(spectrum) {
    // Rescales a given spectrum so that the maximum intensity is 100.
    const max_intensity = Math.max(...spectrum.map(x => x[1]))
    for (let i=0; i<spectrum.length; i++) {
        spectrum[i][1] = 100 * spectrum[i][1]/max_intensity
    }
    return spectrum
}

export function sortSubstancesByRecordCount(substance_list, record_counts) {
    // Given a list of substances and a list of record counts per substance (with DTXSIDs as keys), sort the substances
    // on total record count in descending order, breaking ties by substance name in normal lexicographical order.
    substance_list.sort((a,b) => {
        const a_counts = record_counts[a.dtxsid]
        const a_total = a_counts ? Object.values(a_counts).reduce((a, b) => a+b, 0) : 0
        const b_counts = record_counts[b.dtxsid]
        const b_total = b_counts ? Object.values(b_counts).reduce((a, b) => a+b, 0) : 0
        if (a_total > b_total) {
            return -1
        } else if (a_total < b_total) {
          return 1
        } else if (a.preferred_name < b.preferred_name) {
          return -1
        } else {
          return 1
        }
    })
    return substance_list
}

export function sourceAbbreviationTooltip(source_name) {
    // Standardized function for getting full names of sources in tooltips for source fields in tables.
    if (SOURCE_ABBREVIATION_MAPPING[source_name]) {
        return SOURCE_ABBREVIATION_MAPPING[source_name].full_name
    }
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