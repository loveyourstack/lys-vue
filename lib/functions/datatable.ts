import { type SortItem } from 'vuetify/lib/components/VDataTable/composables/sort.mjs'
import { type DateFilter, type FilterOperator, type NumericFilter } from '../types/base'

// getDateFilterUrlParams translates a DateFilter object into URL params for the API
export function getDateFilterUrlParams(param: string, df: DateFilter | undefined): string {

  if (!df || !df.operator || !df.value) { 
    return ''
  }

  // ensure df.value is a valid date
  const valD: Date = new Date(df.value)
  if (isNaN(valD.getTime())) {
    return ''
  }

  // if between operator, ensure df.value_upper is a valid date and is after df.value
  if (df.operator === '<=>') {

    const valUpperD: Date = new Date(df.value_upper)
    if (isNaN(valUpperD.getTime())) {
      return ''
    }

    if (valUpperD < valD) {
      return ''
    }

    return `&${param}=>eq${df.value}&${param}=<eq${df.value_upper}`
  }
  
  return `&${param}=${getOperatorParam(df.operator)}${df.value}`
}

/* getNumericFilterUrlParams translates a NumericFilter object into URL params for the API.
  If isPercent is true, values are divided by 100 (API expects 0.65 not 65%) */
export function getNumericFilterUrlParams(param: string, nf: NumericFilter | undefined, isPercent?: boolean): string {

  if (!nf || !nf.operator) { 
    return ''
  }

  let val = typeof nf.value === 'number' ? nf.value : 0 // ensure that 0 rather than '' is passed to API when user deletes value in textbox
  let val_upper: number = nf.value_upper ? nf.value_upper : 0

  if (isPercent) {
    val /= 100
    val_upper /= 100
  }

  // if between operator, ensure value_upper is greater than value
  if (nf.operator === '<=>') {

    if (val_upper < val) {
      return ''
    }

    return `&${param}=>eq${val}&${param}=<eq${val_upper}`
  }
  
  return `&${param}=${getOperatorParam(nf.operator)}${val}`
}

// getOperatorParam translates filter operator into URL param operator for the API (e.g. <= becomes <eq)
export function getOperatorParam(operator: FilterOperator | undefined): string {
  if (!operator) {
    return ''
  }
  switch (operator) {
    case '<':
      return operator
    case '<=':
      return '<eq'
    case '=':
      return '' // empty so that param becomes x=val
    case '>=':
      return '>eq'
    case '>':
      return operator
    case '!=':
      return '!'
    case '<=>':
      throw new Error(`The between operator is not supported: ${operator}`)
    default:
      throw new Error(`Unrecognised operator: ${operator}`)
  }
}

// getTextFilterUrlParam translates a text filter string into URL params for the API
export function getTextFilterUrlParam(param: string, filterStr: string | undefined): string {

  if (!filterStr) { 
    return ''
  }

  let retA: string[] = []

  // split by && to get an AND condition by creating a separate URL param for each element
  for (let filterEle of filterStr.split('&&')) {

    filterEle = filterEle.trim()
    if (!filterEle) { 
      continue
    }

    // escape & to prevent it being treated as a URL param separator
    filterEle = filterEle.replace(/&/g, '%26')

    // escape underscore since it is the db wildcard
    filterEle = filterEle.replace(/_/g, '\\_')

    // searching for empty string (''): use param as passed
    if (filterEle === '{empty}') { 
      retA.push(`${param}=${filterEle}`)
      continue
    }

    // if filterEle starts with !
    if (filterEle.startsWith('!')) {

      // return a "not contains" filter
      retA.push(`${param}=!~${filterEle.substring(1)}~`)
      continue
    }

    // return a "contains any" filter, which allows use of "|" for OR conditions
    retA.push(`${param}=~[${filterEle}]~`)
    continue
  }

  if (!retA.length) return ''
  return '&' + retA.join('&')
}

// processURIOptions translates the datatable pagination and sorting options into URL params for the API
// uri = the API uri before pagination and sorting are added
// options = the options object from v-data-table-server
// NB: default sorting is handled by API and not needed here
export function processURIOptions (uri: string, options: { page: number, itemsPerPage: number, sortBy: SortItem[]}) {

  const DEFAULT_PAGE = 1
  const DEFAULT_PER_PAGE = 10

  if (options.page > 0) {
    uri += '?xpage=' + options.page
  } else {
    uri += '?xpage=' + DEFAULT_PAGE
  }

  if (options.itemsPerPage > 0) {
    uri += '&xper_page=' + options.itemsPerPage
  } else {
    uri += '&xper_page=' + DEFAULT_PER_PAGE
  }

  if (options.sortBy.length > 0) {
    const sort = options.sortBy
      .map(s => `${s.order === 'desc' ? '-' : ''}${s.key}`)
      .join(',')
    uri += `&xsort=${sort}`
  }

  return uri
}
