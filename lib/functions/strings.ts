import { type Result } from '../types/base'

export function properCase(s: string): string {
  const sA = s.split(' ')
  if (sA.length === 0) { return s }
  return sA
  .map(w => w[0]!.toUpperCase() + w.substring(1).toLowerCase())
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
  const regex = /^\d{4}-\d{2}-\d{2}$/
  
  if (!regex.test(str)) {
    return { ok: false, error: `invalid date format: '${str}'` }
  }
  
  const date = new Date(str);
  
  if (isNaN(date.getTime())) {
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
  const n = parseInt(str, 10)
  if (isNaN(n)) {
    return { ok: false, error: `invalid integer value: '${str}'` }
  }
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