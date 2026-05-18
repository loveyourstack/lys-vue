import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import LArrayDate from '../lib/components/arrayControls/LArrayDate.vue'
import { makeVTextareaStub } from './utils/vuetifyStubs'

function makeWrapper(modelValue: string[] = []) {
  let latestRules: Array<(val: string) => true | string> = []

  const VTextareaStub = makeVTextareaStub<(val: string) => true | string>((rules) => {
    latestRules = rules
  })

  const wrapper = mount(LArrayDate, {
    props: {
      label: 'Dates',
      rows: 4,
      modelValue,
      'onUpdate:modelValue': (value: string[]) => wrapper.setProps({ modelValue: value }),
    },
    global: {
      stubs: {
        'v-textarea': VTextareaStub,
      },
    },
  })

  return {
    wrapper,
    getRules: () => latestRules,
  }
}

describe('LArrayDate', () => {
  it('renders model values as newline-delimited text', () => {
    const { wrapper } = makeWrapper(['2024-01-01', '2024-12-31'])

    const textarea = wrapper.get('[data-test="textarea"]')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('2024-01-01\n2024-12-31')
  })

  it('updates model on blur with trimmed valid dates', async () => {
    const { wrapper } = makeWrapper([])

    const textarea = wrapper.get('[data-test="textarea"]')
    await textarea.setValue(' 2024-01-01 \n\n2024-01-03  ')
    await textarea.trigger('blur')
    await nextTick()

    const updates = wrapper.emitted('update:modelValue')
    expect(updates).toEqual([[['2024-01-01', '2024-01-03']]])
  })

  it('does not update model on blur when a date is invalid', async () => {
    const { wrapper } = makeWrapper(['2024-01-01'])

    const textarea = wrapper.get('[data-test="textarea"]')
    await textarea.setValue('not-a-date')
    await textarea.trigger('blur')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('returns validation error from rules for invalid dates', async () => {
    const { wrapper, getRules } = makeWrapper([])

    const textarea = wrapper.get('[data-test="textarea"]')
    await textarea.setValue('invalid-date')
    await nextTick()

    const [rule] = getRules()
    expect(rule('invalid-date')).toBe("invalid date format: 'invalid-date'")
  })

  it('returns lower-bound validation error for dates before 1900-01-01', async () => {
    const { getRules } = makeWrapper([])

    const [rule] = getRules()
    expect(rule('1899-12-31')).toBe('Date must be >= 1 Jan 1900')
  })

  it('passes validation for valid input', async () => {
    const { wrapper, getRules } = makeWrapper([])

    const textarea = wrapper.get('[data-test="textarea"]')
    await textarea.setValue('2024-06-01\n2024-06-02')
    await nextTick()

    const [rule] = getRules()
    expect(rule('2024-06-01\n2024-06-02')).toBe(true)
  })
})
