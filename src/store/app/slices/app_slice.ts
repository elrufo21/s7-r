import { AppSliceState, AppStoreProps, SetState } from '@/store/store.types'
import { FormConfig, ModulesEnum, ViewTypeEnum } from '@/shared/shared.types'
import { GroupedItemsType } from '@/shared/components/view-types/viewTypes.types'
import { Row } from '@tanstack/react-table'

export const createAppSlice = (
  set: SetState<AppSliceState>,
  get: () => AppStoreProps
): AppSliceState => ({
  dinamicModule: ModulesEnum.SETTINGS,
  setDinamicModule: (dinamicModule) => set({ dinamicModule }),
  previousDataBeforeMenu: {
    formItem: null,
    breadcrumb: null,
    url: null,
  },
  setPreviousDataBeforeMenu: (data) => set({ previousDataBeforeMenu: data }),
  changeFavoriteId: null,
  setChangeFavoriteId: (changeFavoriteId) => set({ changeFavoriteId }),
  canChangeGroupBy: false,
  defaultCompany: null,
  setDefaultCompany: (defaultCompany) => set({ defaultCompany }),
  usersEmpSelected: [],
  setUsersEmpSelected: (usersEmpSelected) => set({ usersEmpSelected }),
  hiddenTabs: [],
  setHiddenTabs: (hiddenTabs) => set({ hiddenTabs }),
  setCanChangeGroupBy: (canChangeGroupBy) => set({ canChangeGroupBy }),
  groupedParentRow: {} as Row<GroupedItemsType>,
  setGroupedParentRow: (groupedParentRow) => set({ groupedParentRow }),
  selectAllRows: false,
  setSelectAllRows: (selectAllRows) => set({ selectAllRows }),
  listViewData: [],
  settingsBreadcrumb: false,
  setSettingsBreadcrumb: (settingsBreadcrumb) => set({ settingsBreadcrumb }),
  setListViewData: (listViewData) => set({ listViewData }),
  totalItems: 0,
  appDialog: { open: false, actions: false, content: '', title: '' },
  setAppDialog: (dialog) => set({ appDialog: { ...dialog } }),
  appDialogsContent: [],
  setAppDialogsContent: (appDialogsContent) => set({ appDialogsContent }),
  appShowPrevView: false,
  actualCurrentPage: 1,
  setActualCurrentPage: (actualCurrentPage) => set({ actualCurrentPage }),
  setAppShowPrevView: (value) => {
    set({ appShowPrevView: value })
  },
  //nav
  viewType: ViewTypeEnum.KANBAN,
  setViewType: (viewType) => set({ viewType }),
  config: {} as FormConfig,
  setConfig: (config) => set({ config }),
  //breadcrumb reemplazo de appRoutes
  listBreadcrumb: [],
  setListBreadcrumb: (listBreadcrumb) => set({ listBreadcrumb }),
  breadcrumb: [],
  setBreadcrumb: (breadcrumb) => set({ breadcrumb }),
  //dataShow
  dataListShow: {
    dataShow: [],
    totalPages: 1,
    dataLength: 0,
    counterPage: { lowerLimit: 1, upperLimit: 1, totalElements: 1 },
  },
  dataKanbanShow: {
    dataShow: [],
    totalPages: 1,
    dataLength: 0,
    counterPage: { lowerLimit: 1, upperLimit: 1, totalElements: 1 },
  },
  setDataListShow: (dataListShow) => set({ dataListShow }),
  setDataKanbanShow: (dataKanbanShow) => set({ dataKanbanShow }),

  dataFormShow: [],
  setDataFormShow: (dataFormShow) => set({ dataFormShow }),

  setInitialData: ({ data = [], total = 0 }) => {
    const {
      itemsPerPage,
      kanbanCurrentPage: page,
      listCurrentPage: pageList,
      viewType,
      listGroupBy,
      groupByData,
    } = get()

    const indexPage =
      viewType === ViewTypeEnum.KANBAN ? (page - 1) * itemsPerPage : (pageList - 1) * itemsPerPage

    const groupItems = listGroupBy.length
      ? new Set(groupByData.map((item: any) => item[listGroupBy[0].key_gby])).size
      : total

    const lowerLimit = indexPage + 1
    const upperLimit = Math.min(
      indexPage + itemsPerPage,
      viewType === ViewTypeEnum.LIST ? groupItems : total
    )

    const counterPage = {
      lowerLimit,
      upperLimit,
      totalElements: viewType === ViewTypeEnum.LIST ? groupItems : total,
    }
    const totalPages = Math.ceil((listGroupBy.length ? groupItems : total) / itemsPerPage)

    const stateUpdate =
      viewType === ViewTypeEnum.KANBAN
        ? { dataKanbanShow: { dataShow: data, totalPages, dataLength: total, counterPage } }
        : { dataListShow: { dataShow: data, totalPages, dataLength: groupItems, counterPage } }

    set(stateUpdate)
    set({ totalItems: total })
  },

  groupByData: [],
  setGroupByData: (groupByData) => set({ groupByData }),

  // alamacena los rows expandidos
  expandedData: {},
  setExpandedData: (expandedData) => set({ expandedData }),

  // filtersLocal

  filtersLocal: [],
  setFiltersLocal: (filters) => set({ filtersLocal: filters }),

  //prev filters
  prevFilters: [],
  setPrevFilters: (prevFilters) => set({ prevFilters }),

  //filters to render select filters
  searchFiltersLabel: [],
  setSearchFiltersLabel: (searchFiltersLabel) => set({ searchFiltersLabel }),
  //tab page
  tabForm: 0,
  setTabForm: (tabForm) => set({ tabForm }),
  //
  openModal: false,
  setOpenModal: (openModal) => set({ openModal }),
  //
  viewTypeFromConfig: false,
  setViewTypeFromConfig: (viewTypeFromConfig) => set({ viewTypeFromConfig }),
  //
  columnsVisibility: {},
  setColumnsVisibility: (columnsVisibility) => set({ columnsVisibility }),

  // sync loading state
  syncLoading: false,
  setSyncLoading: (syncLoading) => set({ syncLoading }),
})
export default createAppSlice
