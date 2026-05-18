import { defineComponent, h } from 'vue'

export function makeVTextareaStub<TRule>(
  onRules: (rules: TRule[]) => void
) {
  return defineComponent({
    name: 'VTextareaStub',
    props: {
      label: { type: String, required: false },
      modelValue: { type: String, default: '' },
      rows: { type: [Number, String], required: false },
      rules: { type: Array, default: () => [] },
      hint: { type: String, required: false },
      validateOn: { type: String, required: false },
      autofocus: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'blur'],
    setup(stubProps, { emit }) {
      return () => {
        onRules((stubProps.rules ?? []) as TRule[])

        return h('textarea', {
          'data-test': 'textarea',
          'aria-label': stubProps.label,
          value: stubProps.modelValue,
          autofocus: stubProps.autofocus,
          onInput: (event: Event) => {
            emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
          },
          onBlur: () => {
            emit('blur')
          },
        })
      }
    },
  })
}
