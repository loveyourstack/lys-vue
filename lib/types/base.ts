
export const BooleanOptions = [
  {value: true, title: 'Yes'},
  {value: false, title: 'No'}
] as const

export const FilterOperators = ['<', '<=', '=', '>=', '>', '<=>', '!='] as const

// type derived from FilterOperators: used in interfaces below
export type FilterOperator = typeof FilterOperators[number]

export interface DateFilter {
  operator: FilterOperator | undefined
  value: string // YYYY-MM-DD
  value_upper: string // YYYY-MM-DD: treated as upper limit when operator is 'between'
}

export interface GetMetadata {
  count: number
  total_count: number
  total_count_is_estimated: boolean
}

export interface NumericFilter {
  operator: FilterOperator | undefined
  value: number
  value_upper: number // treated as upper limit when operator is 'between'
}

export type Result<T> = 
  | { ok: true; value: T }
  | { ok: false; error: string }

export interface SelectionItem {
  id: number
  name: string
}