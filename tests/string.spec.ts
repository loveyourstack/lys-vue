import { describe, expect, it } from 'vitest'
import {
  properCase,
  strToBool,
  strToDate,
  strToFloat,
  strToInt,
  strToTime,
} from '../lib/functions/string'

describe('properCase', () => {
  it('capitalizes words and lowercases remaining characters', () => {
    expect(properCase('hello world')).toBe('Hello World')
    expect(properCase('mIXed cASe')).toBe('Mixed Case')
  })

  it('handles empty segments without throwing', () => {
    expect(properCase('hello  world')).toBe('Hello  World')
    expect(properCase('')).toBe('')
  })
})

describe('strToBool', () => {
  it('returns true for truthy string values', () => {
    expect(strToBool('true')).toEqual({ ok: true, value: true })
    expect(strToBool('YES')).toEqual({ ok: true, value: true })
    expect(strToBool('1')).toEqual({ ok: true, value: true })
  })

  it('returns false for falsy string values', () => {
    expect(strToBool('false')).toEqual({ ok: true, value: false })
    expect(strToBool('No')).toEqual({ ok: true, value: false })
    expect(strToBool('0')).toEqual({ ok: true, value: false })
    expect(strToBool('')).toEqual({ ok: true, value: false })
  })

  it('returns error for unsupported values', () => {
    expect(strToBool('maybe')).toEqual({
      ok: false,
      error: "invalid boolean value: 'maybe'",
    })
  })
})

describe('strToDate', () => {
  it('returns parsed date for valid YYYY-MM-DD format', () => {
    const res = strToDate('2024-01-31')
    expect(res.ok).toBe(true)
    if (!res.ok) {
      return
    }
    expect(res.value.toISOString()).toBe('2024-01-31T00:00:00.000Z')
  })

  it('returns format error for non YYYY-MM-DD input', () => {
    expect(strToDate('01/31/2024')).toEqual({
      ok: false,
      error: "invalid date format: '01/31/2024'",
    })
  })

  it('accepts leap-day dates when valid', () => {
    const res = strToDate('2024-02-29')
    expect(res.ok).toBe(true)
    if (!res.ok) {
      return
    }
    expect(res.value.toISOString()).toBe('2024-02-29T00:00:00.000Z')
  })

  it('returns value error for overflow dates', () => {
    expect(strToDate('2023-02-29')).toEqual({
      ok: false,
      error: "invalid date value: '2023-02-29'",
    })

    expect(strToDate('2024-04-31')).toEqual({
      ok: false,
      error: "invalid date value: '2024-04-31'",
    })
  })
})

describe('strToFloat', () => {
  it('parses valid floating-point values', () => {
    expect(strToFloat('3.14')).toEqual({ ok: true, value: 3.14 })
    expect(strToFloat('-2.5')).toEqual({ ok: true, value: -2.5 })
    expect(strToFloat('  7.5  ')).toEqual({ ok: true, value: 7.5 })
  })

  it('locks parseFloat behavior for scientific notation and Infinity', () => {
    expect(strToFloat('1e5')).toEqual({ ok: true, value: 100000 })
    expect(strToFloat('Infinity')).toEqual({ ok: true, value: Infinity })
  })

  it('returns error for invalid float values', () => {
    expect(strToFloat('abc')).toEqual({
      ok: false,
      error: "invalid float value: 'abc'",
    })
  })
})

describe('strToInt', () => {
  it('parses integer strings', () => {
    expect(strToInt('42')).toEqual({ ok: true, value: 42 })
    expect(strToInt('-100')).toEqual({ ok: true, value: -100 })
    expect(strToInt('  7  ')).toEqual({ ok: true, value: 7 })
  })

  it('rejects decimal and scientific notation strings', () => {
    expect(strToInt('3.14')).toEqual({
      ok: false,
      error: "invalid integer value: '3.14'",
    })
    expect(strToInt('1e5')).toEqual({
      ok: false,
      error: "invalid integer value: '1e5'",
    })
  })

  it('returns error for invalid integer values', () => {
    expect(strToInt('abc')).toEqual({
      ok: false,
      error: "invalid integer value: 'abc'",
    })
  })
})

describe('strToTime', () => {
  it('parses valid HH:MM values', () => {
    expect(strToTime('00:00')).toEqual({
      ok: true,
      value: { hours: 0, minutes: 0 },
    })

    expect(strToTime('23:59')).toEqual({
      ok: true,
      value: { hours: 23, minutes: 59 },
    })
  })

  it('returns error for invalid time formats', () => {
    expect(strToTime('1:05')).toEqual({
      ok: false,
      error: "invalid time format: '1:05'",
    })

    expect(strToTime('24:00')).toEqual({
      ok: false,
      error: "invalid time format: '24:00'",
    })
  })
})
