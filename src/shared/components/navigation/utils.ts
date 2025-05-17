export const modifyFiltersPag = (array: any[], newValue: number) => {
  return array.map((item) => {
    if (item[1] === 'pag') {
      return [item[0], item[1], newValue]
    }
    return item
  })
}
