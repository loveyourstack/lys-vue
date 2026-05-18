import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import LTextArrayEntry from '../lib/components/formElements/LTextArrayEntry.vue'
import { makeVTextareaStub } from './utils/vuetifyStubs'

function makeWrapper(
  props: Partial<{
    title: string
    maxItems: number
    subtitle?: string
    sampleSheetLink?: string
  }> = {}
) {
  let latestRules: Array<() => true | string> = []

  const PassThrough = defineComponent({
    name: 'PassThroughStub',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  })

  const VTextareaStub = makeVTextareaStub<() => true | string>((rules) => {
    latestRules = rules
  })

  const VFormStub = defineComponent({
    name: 'VFormStub',
    setup(_, { slots, expose }) {
      expose({
        validate: async () => {
          const failures = latestRules.map((rule) => rule()).filter((r) => r !== true)
          return { valid: failures.length === 0 }
        },
      })

      return () => h('form', slots.default?.())
    },
  })

  const VBtnStub = defineComponent({
    name: 'VBtnStub',
    props: {
      icon: { type: Boolean, default: false },
    },
    emits: ['click'],
    setup(stubProps, { slots, emit }) {
      return () =>
        h(
          'button',
          {
            type: 'button',
            'data-test': stubProps.icon ? 'cancel-btn' : 'enter-btn',
            onClick: () => emit('click'),
          },
          slots.default?.()
        )
    },
  })

  return mount(LTextArrayEntry, {
    props: {
      title: 'Test Title',
      maxItems: 3,
      ...props,
    },
    global: {
      stubs: {
        'v-btn': VBtnStub,
        'v-card-subtitle': PassThrough,
        'v-card-title': PassThrough,
        'v-col': PassThrough,
        'v-form': VFormStub,
        'v-icon': true,
        'v-row': PassThrough,
        'v-textarea': VTextareaStub,
      },
    },
  })
}

describe('LTextArrayEntry', () => {
  it('renders optional subtitle and sample sheet link', () => {
    const wrapper = makeWrapper({
      subtitle: 'Sub title here',
      sampleSheetLink: 'https://example.com/sheet',
    })

    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('Sub title here')

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com/sheet')
  })

  it('emits cancel when back button is clicked', async () => {
    const wrapper = makeWrapper()

    await wrapper.find('[data-test="cancel-btn"]').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('emits cleaned entries on valid submit', async () => {
    const wrapper = makeWrapper({ maxItems: 5 })

    await wrapper.find('[data-test="textarea"]').setValue('alpha,\nbeta  \n,,,\n')
    await nextTick()

    await wrapper.find('[data-test="enter-btn"]').trigger('click')

    expect(wrapper.emitted('enter')).toEqual([[['alpha', 'beta']]])
  })

  it('does not emit enter when duplicate lines are present', async () => {
    const wrapper = makeWrapper()

    await wrapper.find('[data-test="textarea"]').setValue('dup\ndup')
    await nextTick()

    await wrapper.find('[data-test="enter-btn"]').trigger('click')

    expect(wrapper.emitted('enter')).toBeUndefined()
  })

  it('does not emit enter when maxItems is exceeded', async () => {
    const wrapper = makeWrapper({ maxItems: 2 })

    await wrapper.find('[data-test="textarea"]').setValue('one\ntwo\nthree')
    await nextTick()

    await wrapper.find('[data-test="enter-btn"]').trigger('click')

    expect(wrapper.emitted('enter')).toBeUndefined()
  })

  it('shows cleaned line stats for valid and no-content lines', async () => {
    const wrapper = makeWrapper({ maxItems: 5 })

    await wrapper.find('[data-test="textarea"]').setValue('a\n   \n,,,\nb')
    await nextTick()

    expect(wrapper.text()).toContain('2 valid lines')
    expect(wrapper.text()).toContain('2 lines with no valid content')
  })
})
