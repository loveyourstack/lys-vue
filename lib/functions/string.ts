import { type Result } from '../types/base'

export function properCase(s: string): string {
  return s
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
    .join(' ')
}

export function strToBool(str: string): Result<boolean> {
  switch (str.toLowerCase()) {
    case 'true':
    case 'yes':
    case '1':
      return { ok: true, value: true }
    case 'false':
    case 'no':
    case '0':
    case '':
      return { ok: true, value: false }
    default:
      return { ok: false, error: `invalid boolean value: '${str}'` }
  }
}

export function strToDate(str: string): Result<Date> {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str)
  if (!match) {
    return { ok: false, error: `invalid date format: '${str}'` }
  }

  const year = Number(match[1])
  const month = Number(match[2]) // 1-12
  const day = Number(match[3])   // 1-31

  // Create UTC date to avoid local-timezone rollover surprises.
  const date = new Date(Date.UTC(year, month - 1, day))

  const isSameDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day

  if (!isSameDate) {
    return { ok: false, error: `invalid date value: '${str}'` }
  }
  
  return { ok: true, value: date }
}

export function strToFloat(str: string): Result<number> {
  const n = parseFloat(str)
  if (isNaN(n)) {
    return { ok: false, error: `invalid float value: '${str}'` }
  }
  return { ok: true, value: n }
}

export function strToInt(str: string): Result<number> {
  const trimmed = str.trim()
  if (!/^[+-]?\d+$/.test(trimmed)) {
    return { ok: false, error: `invalid integer value: '${str}'` }
  }
  const n = parseInt(trimmed, 10)
  return { ok: true, value: n }
}

export function strToTime(str: string): Result<{ hours: number; minutes: number }> {
  const regex = /^([0-1]\d|2[0-3]):([0-5]\d)$/
  
  if (!regex.test(str)) {
    return { ok: false, error: `invalid time format: '${str}'` }
  }
  
  const [hours, minutes] = str.split(':').map(Number)
  return { ok: true, value: { hours: hours!, minutes: minutes! } }
}