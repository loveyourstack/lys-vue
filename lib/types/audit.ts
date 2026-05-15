import { type SelectionItem } from './base'

export interface AuditChange {
  column: string
  old_value: any
  new_value: any
}

export interface AuditUpdate {
  affected_at: Date
  affected_by: string
  affected_new_values: Record<string, any>
  affected_old_values: Record<string, any>
  changes: AuditChange[]
}

export interface FkReplacement {
  fk_column: string
  new_column_name: string
  selectionItems: SelectionItem[]
}