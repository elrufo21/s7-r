type FormatGroupItemsType = {
  list: any[]
  itemsPerPage: number
  level?: number
  parents?: { key: string; value: number | string }[]
  listGroupBy: { [key: string]: string }[]
}

export const formatGroupItems = ({
  list,
  itemsPerPage,
  listGroupBy,
  level = 0,
  parents = [],
}: FormatGroupItemsType) => {
  return list.map((elem) => ({
    groupName: elem[listGroupBy[level].key] ?? 'Ninguno',
    groupKey: elem[listGroupBy[level].key_gby],
    groupItems: [{}],
    pages: Math.ceil(elem.count / itemsPerPage),
    currentPage: 1,
    totalItems: elem.count,
    level,
    parents: [
      ...parents,
      { key: listGroupBy[level].key_gby, value: elem[listGroupBy[level].key_gby] },
    ],
    first: 1,
    last: itemsPerPage,
  }))
}
