export const sumCountsByFilters = (data: any, filters: any) => {
  const filteredData = data.filter((item: any) => {
    return filters.every((filter: any) => {
      return item[filter.key] === filter.value
    })
  })
  // Sumar los counts de todos los elementos filtrados
  const totalCount = filteredData.reduce((sum: any, item: any) => sum + item.count, 0)

  return totalCount
}

export const findInFilters = (data: any, filters: any) => {
  const filteredData = data.filter((item: any) => {
    return filters.every((filter: any) => {
      return item[filter.key] === filter.value
    })
  })

  return filteredData
}
