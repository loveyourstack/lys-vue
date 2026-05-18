import { describe, expect, it } from 'vitest'
import {
  getDateFilterUrlParams,
  getNumericFilterUrlParams,
  getOperatorParam,
  getTextFilterUrlParam,
  processURIOptions,
} from '../lib/functions/datatable'

describe('getDateFilterUrlParams', () => {
  it('returns empty string when filter is undefined', () => {
    expect(getDateFilterUrlParams('created_at', undefined)).toBe('')
  })

  it('returns empty string when operator or value is missing', () => {
    expect(
      getDateFilterUrlParams('created_at', {
        operator: undefined,
        value: '2024-01-01',
        value_upper: '',
      })
    ).toBe('')

    expect(
      getDateFilterUrlParams('created_at', {
        operator: '=',
        value: '',
        value_upper: '',
      })
    ).toBe('')
  })

  it('returns empty string when value is not a valid date', () => {
    expect(
      getDateFilterUrlParams('created_at', {
        operator: '>=',
        value: 'not-a-date',
        value_upper: '',
      })
    ).toBe('')
  })

  it('returns expected URL params for between operator', () => {
    expect(
      getDateFilterUrlParams('created_at', {
        operator: '<=>',
        value: '2024-01-01',
        value_upper: '2024-01-31',
      })
    ).toBe('&created_at=>eq2024-01-01&created_at=<eq2024-01-31')
  })

  it('returns empty string for between when upper value is invalid or before lower', () => {
    expect(
      getDateFilterUrlParams('created_at', {
        operator: '<=>',
        value: '2024-01-01',
        value_upper: 'not-a-date',
      })
    ).toBe('')

    expect(
      getDateFilterUrlParams('created_at', {
        operator: '<=>',
        value: '2024-02-01',
        value_upper: '2024-01-01',
      })
    ).toBe('')
  })

  it('returns expected URL param for non-between operators', () => {
    expect(
      getDateFilterUrlParams('created_at', {
        operator: '=',
        value: '2024-01-01',
        value_upper: '',
      })
    ).toBe('&created_at=2024-01-01')

    expect(
      getDateFilterUrlParams('created_at', {
        operator: '>=',
        value: '2024-01-01',
        value_upper: '',
      })
    ).toBe('&created_at=>eq2024-01-01')
  })
})

describe('getNumericFilterUrlParams', () => {
  it('returns empty string when filter is undefined or operator missing', () => {
    expect(getNumericFilterUrlParams('score', undefined)).toBe('')

    expect(
      getNumericFilterUrlParams('score', {
        operator: undefined,
        value: 10,
        value_upper: 20,
      })
    ).toBe('')
  })

  it('returns expected URL params for non-between operators', () => {
    expect(
      getNumericFilterUrlParams('score', {
        operator: '=',
        value: 10,
        value_upper: 0,
      })
    ).toBe('&score=10')

    expect(
      getNumericFilterUrlParams('score', {
        operator: '!=',
        value: 10,
        value_upper: 0,
      })
    ).toBe('&score=!10')
  })

  it('coerces missing numeric value to zero', () => {
    expect(
      getNumericFilterUrlParams('score', {
        operator: '>=',
        value: '' as unknown as number,
        value_upper: 0,
      })
    ).toBe('&score=>eq0')
  })

  it('returns expected URL params for between operator', () => {
    expect(
      getNumericFilterUrlParams('score', {
        operator: '<=>',
        value: 10,
        value_upper: 20,
      })
    ).toBe('&score=>eq10&score=<eq20')
  })

  it('returns empty string for between when upper is lower than value', () => {
    expect(
      getNumericFilterUrlParams('score', {
        operator: '<=>',
        value: 20,
        value_upper: 10,
      })
    ).toBe('')
  })

  it('applies percent conversion when isPercent is true', () => {
    expect(
      getNumericFilterUrlParams(
        'pct',
        {
          operator: '=',
          value: 65,
          value_upper: 0,
        },
        true
      )
    ).toBe('&pct=0.65')

    expect(
      getNumericFilterUrlParams(
        'pct',
        {
          operator: '<=>',
          value: 40,
          value_upper: 60,
        },
        true
      )
    ).toBe('&pct=>eq0.4&pct=<eq0.6')
  })
})

describe('getOperatorParam', () => {
  it('maps known operators to API operators', () => {
    expect(getOperatorParam(undefined)).toBe('')
    expect(getOperatorParam('<')).toBe('<')
    expect(getOperatorParam('<=')).toBe('<eq')
    expect(getOperatorParam('=')).toBe('')
    expect(getOperatorParam('>=')).toBe('>eq')
    expect(getOperatorParam('>')).toBe('>')
    expect(getOperatorParam('!=')).toBe('!')
  })

  it('throws for between and unknown operators', () => {
    expect(() => getOperatorParam('<=>')).toThrow(
      'The between operator is not supported: <=>'
    )

    expect(() => getOperatorParam('??' as never)).toThrow(
      'Unrecognised operator: ??'
    )
  })
})

describe('getTextFilterUrlParam', () => {
  it('returns empty string for empty input', () => {
    expect(getTextFilterUrlParam('name', undefined)).toBe('')
    expect(getTextFilterUrlParam('name', '')).toBe('')
  })

  it('builds contains-any filter for a single value', () => {
    expect(getTextFilterUrlParam('name', 'alice')).toBe('&name=~[alice]~')
  })

  it('splits by &&, trims values, and skips empty parts', () => {
    expect(getTextFilterUrlParam('name', ' alpha &&  && beta  ')).toBe(
      '&name=~[alpha]~&name=~[beta]~'
    )
  })

  it('supports special {empty} and not-contains syntax', () => {
    expect(getTextFilterUrlParam('name', '{empty}')).toBe('&name={empty}')
    expect(getTextFilterUrlParam('name', '!alice')).toBe('&name=!~alice~')
  })

  it('escapes ampersand and underscore', () => {
    expect(getTextFilterUrlParam('name', 'a&b_with_c')).toBe(
      '&name=~[a%26b\\_with\\_c]~'
    )
  })

  it('handles mixed clauses in one filter', () => {
    expect(getTextFilterUrlParam('name', '!x && {empty} && y|z')).toBe(
      '&name=!~x~&name={empty}&name=~[y|z]~'
    )
  })
})

describe('processURIOptions', () => {
  it('applies page and itemsPerPage defaults when non-positive', () => {
    expect(
      processURIOptions('/api/items', {
        page: 0,
        itemsPerPage: 0,
        sortBy: [],
      })
    ).toBe('/api/items?xpage=1&xper_page=10')

    expect(
      processURIOptions('/api/items', {
        page: -1,
        itemsPerPage: -10,
        sortBy: [],
      })
    ).toBe('/api/items?xpage=1&xper_page=10')
  })

  it('uses provided page and itemsPerPage when positive', () => {
    expect(
      processURIOptions('/api/items', {
        page: 2,
        itemsPerPage: 25,
        sortBy: [],
      })
    ).toBe('/api/items?xpage=2&xper_page=25')
  })

  it('serializes sortBy with desc prefix and comma join', () => {
    expect(
      processURIOptions('/api/items', {
        page: 1,
        itemsPerPage: 10,
        sortBy: [
          { key: 'created_at', order: 'desc' },
          { key: 'name', order: 'asc' },
        ],
      })
    ).toBe('/api/items?xpage=1&xper_page=10&xsort=-created_at,name')
  })
})
