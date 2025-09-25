import { ref, computed, type Ref } from 'vue'
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
  defaultType?: 'simple' | 'advance'
  form?: any // Form instance (Ant Design form)
  onSubmit?: (params: TParams) => void
  manual?: boolean
  ready?: boolean
  defaultParams?: TParams[]
  refreshDeps?: any[]
  [key: string]: any
}

export interface Result<TData, TParams> {
  // Table props
  tableProps: {
    dataSource: any[]
    loading: boolean
    pagination: {
      current: number
      pageSize: number
      total: number
      showSizeChanger: boolean
      showQuickJumper: boolean
      showTotal: (total: number, range: [number, number]) => string
      onChange: (page: number, pageSize?: number) => void
      onShowSizeChange: (current: number, size: number) => void
    }
    onChange: (pagination: any, filters: any, sorter: any) => void
  }
  
  // Search form props
  search: {
    type: 'simple' | 'advance'
    changeType: () => void
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

const useAntdTable = <TData extends Data = Data, TParams extends Params = Params>(
  service: (...args: any[]) => Promise<TData>,
  options: Options<TData, TParams> = {}
): Result<TData, TParams> => {
  const {
    defaultPageSize = 10,
    defaultCurrent = 1,
    defaultType = 'simple',
    form,
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

  const searchType = ref(defaultType)

  // Get current pagination params
  const current = computed(() => result.params.value[0]?.current || defaultCurrent)
  const pageSize = computed(() => result.params.value[0]?.pageSize || defaultPageSize)
  const total = computed(() => result.data.value?.total || 0)

  // Table pagination handlers
  const onTableChange = useMemoizedFn((pagination: any, filters: any, sorter: any) => {
    const [oldParams = {}] = result.params.value || []
    
    result.run({
      ...oldParams,
      current: pagination.current,
      pageSize: pagination.pageSize,
      filters,
      sorter,
    } as TParams)
  })

  const onPaginationChange = useMemoizedFn((page: number, size?: number) => {
    const [oldParams = {}] = result.params.value || []
    
    result.run({
      ...oldParams,
      current: page,
      pageSize: size || pageSize.value,
    } as TParams)
  })

  const onShowSizeChange = useMemoizedFn((current: number, size: number) => {
    onPaginationChange(current, size)
  })

  // Search form handlers
  const changeType = useMemoizedFn(() => {
    searchType.value = searchType.value === 'simple' ? 'advance' : 'simple'
  })

  const submit = useMemoizedFn(() => {
    const formData = form?.getFieldsValue?.() || {}
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
    form?.resetFields?.()
    const [oldParams = {}] = result.params.value || []
    
    const params = {
      current: 1,
      pageSize: pageSize.value,
    } as TParams

    result.run(params)
  })

  // Table props for Ant Design Table component
  const tableProps = computed(() => ({
    dataSource: result.data.value?.list || [],
    loading: result.loading.value,
    pagination: {
      current: current.value,
      pageSize: pageSize.value,
      total: total.value,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number, range: [number, number]) => 
        `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
      onChange: onPaginationChange,
      onShowSizeChange,
    },
    onChange: onTableChange,
  }))

  return {
    tableProps: tableProps.value,
    search: {
      type: searchType.value,
      changeType,
      submit,
      reset,
    },
    ...result,
  }
}

export default useAntdTable
