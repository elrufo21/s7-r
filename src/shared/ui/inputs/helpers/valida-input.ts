export const validaInput = (name: string, config: any, state: any) => {
  if (!config || state === 'v') return false

  const obj = config[name]
  if (!obj) return true

  return obj[`hb_${state}`] !== undefined ? obj[`hb_${state}`] : true
}
