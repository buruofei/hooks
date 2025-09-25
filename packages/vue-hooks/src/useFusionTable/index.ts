import { computed, type Ref } from 'vue'
import useRequest from '../useRequest'
import useMemoizedFn from '../useMemoizedFn'

export interface Data {
  total: number
  list: any[]
}

export interface Params {
  current: number
  pageSize: number
  sorter?: any
  filters?: any
  [key: string]: any
}

export interface Options<TData, TParams> {
  defaultPageSize?: number
  defaultCurrent?: number
  field?: any // Fusion form field
  onSubmit?: (params: TParams) => void
  manual?: boolean
  ready?: boolean
  defaultParams?: TParams[]
  refreshDeps?: any[]
  [key: string]: any
}

export interface Result<TData, TParams> {
  // Table props for Fusion Table
  tableProps: {
    dataSource: any[]
    loading: boolean
  }
  
  // Pagination props for Fusion Pagination
  paginationProps: {
    current: number
    pageSize: number
    total: number
    onChange: (current: number) => void
    onPageSizeChange: (pageSize: number) => void
    showJump: boolean
    showSizeSelector: boolean
  }

  // Search form props
  search: {
    submit: () => void
    reset: () => void
  }

  // Base request result
  data: Ref<TData | undefined>
  error: Ref<Error | undefined>
  loading: Ref<boolean>
  params: Ref<TParams[]>
  run: (...params: TParams[]) => void
  refresh: () => void
  mutate: (data?: TData) => void
  cancel: () => void
}

const useFusionTable = <TData extends Data = Data, TParams extends Params = Params>(
  service: (...args: any[]) => Promise<TData>,
  options: Options<TData, TParams> = {}
): Result<TData, TParams> => {
  const {
    defaultPageSize = 10,
    defaultCurrent = 1,
    field,
    onSubmit,
    ...restOptions
  } = options

  // Use useRequest for data fetching
  const result = useRequest(service, {
    defaultParams: [
      {
        current: defaultCurrent,
        pageSize: defaultPageSize,
      } as TParams,
    ],
    ...restOptions,
  })

  // Get current pagination params
  const current = computed(() => result.params.value[0]?.current || defaultCurrent)
  const pageSize = computed(() => result.params.value[0]?.pageSize || defaultPageSize)
  const total = computed(() => result.data.value?.total || 0)

  // Pagination handlers
  const onPaginationChange = useMemoizedFn((page: number) => {
    const [oldParams = {}] = result.params.value || []
    
    result.run({
      ...oldParams,
      current: page,
    } as TParams)
  })

  const onPageSizeChange = useMemoizedFn((size: number) => {
    const [oldParams = {}] = result.params.value || []
    
    result.run({
      ...oldParams,
      current: 1, // Reset to first page when page size changes
      pageSize: size,
    } as TParams)
  })

  // Search form handlers
  const submit = useMemoizedFn(() => {
    const formData = field?.getValues?.() || {}
    const [oldParams = {}] = result.params.value || []
    
    const params = {
      ...oldParams,
      ...formData,
      current: 1, // Reset to first page when searching
    } as TParams

    onSubmit?.(params)
    result.run(params)
  })

  const reset = useMemoizedFn(() => {
    field?.reset?.()
    const [oldParams = {}] = result.params.value || []
    
    const params = {
      current: 1,
      pageSize: pageSize.value,
    } as TParams

    result.run(params)
  })

  // Table props for Fusion Table component
  const tableProps = computed(() => ({
    dataSource: result.data.value?.list || [],
    loading: result.loading.value,
  }))

  // Pagination props for Fusion Pagination component
  const paginationProps = computed(() => ({
    current: current.value,
    pageSize: pageSize.value,
    total: total.value,
    onChange: onPaginationChange,
    onPageSizeChange,
    showJump: true,
    showSizeSelector: true,
  }))

  return {
    tableProps: tableProps.value,
    paginationProps: paginationProps.value,
    search: {
      submit,
      reset,
    },
    ...result,
  }
}

export default useFusionTable
