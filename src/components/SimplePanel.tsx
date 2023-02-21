import React from 'react'
import { PanelProps } from '@grafana/data'
import { SimpleOptions } from 'types'
import { css, cx } from '@emotion/css'
import { useStyles2, Checkbox, Alert } from '@grafana/ui'
import { getTemplateSrv, locationService } from '@grafana/runtime'
import { uniq } from 'lodash'

interface Props extends PanelProps<SimpleOptions> {}

const getStyles = () => {
  return {
    wrapper: css`
      position: relative;
    `,
    list: css`
      list-style: none;
    `,
    item: css`
      line-height: 1.8;
    `,
  }
}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles)
  const { field, variableName, multiselect } = options
  let rows = data.series
    .map((d) => d.fields.find((f) => f.name === field))
    .map((f) => f?.values)
    .at(-1)
    ?.toArray()
  rows = uniq(rows)

  const hasVar = getTemplateSrv()
    .getVariables()
    .find((v) => v.name === variableName)
  let variableConfigError: React.ReactNode
  if (!hasVar || hasVar.type !== 'textbox') {
    variableConfigError = (
      <Alert title="Variable not configured properly" severity="error">
        Please create a &quot;Text box&quot; variable with name `{variableName}`.
        <br /> This plugin sets the variable when a checkbox is selected.
        <br /> If you have the variable already, make sure it has the same name with the &quot;Variable name&quot; in
        the panel config.
      </Alert>
    )
  }

  const selected =
    locationService
      .getSearch()
      .get(`var-${variableName}`)
      ?.split(',')
      .filter((s) => !!s) ?? []
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = String(e.target.dataset.value)
    if (multiselect) {
      if (e.target.checked) {
        selected?.push(value)
      } else {
        selected?.splice(selected.indexOf(value), 1)
      }
    } else {
      selected?.splice(0, selected.length)
      selected?.push(value)
    }
    locationService.partial({ [`var-${variableName}`]: selected?.join(',') })
  }
  console.log(selected)

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {variableConfigError}
      <ul className={styles.list}>
        {rows?.map((row) => (
          <li key={row} className={styles.item}>
            <Checkbox checked={selected?.includes(String(row))} data-value={row} onChange={handleChange} label={row} />
          </li>
        ))}
      </ul>
    </div>
  )
}
