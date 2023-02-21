import { PanelPlugin } from '@grafana/data'
import { SimpleOptions } from './types'
import { SimplePanel } from './components/SimplePanel'

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addSelect({
      path: 'field',
      name: 'Field',
      description: 'Choose field for display checkboxes',
      settings: {
        options: [],
        getOptions: async (ctx) => {
          const fields = ctx.data[0]?.fields || []
          return fields.map((field) => ({ label: field.name, value: field.name }))
        },
      },
    })
    .addTextInput({
      path: 'variableName',
      name: 'Variable name',
      description: 'Name of the variable to set',
      defaultValue: 'myVariable',
    })
    .addTextInput({
      path: 'defaultValue',
      name: 'Default value for variable',
      description: 'The default value if no checkbox is checked',
      defaultValue: '',
    })
    .addBooleanSwitch({
      path: 'multiselect',
      name: 'Allow multiple selection',
      defaultValue: true,
    })
})
