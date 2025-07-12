import { useFetch as api } from './useFetch'
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type ApiOptions<TResponse, TBody = unknown> = {
  url: string
  method?: HttpMethod
  body?: TBody
  queryKey?: readonly unknown[]
  enabled?: boolean
  autoRefetchOnWindowFocus?: boolean
  staleTime?: number
  onSuccess?: (data: TResponse) => void
  onError?: (error: Error) => void
}

function urlToQueryKey(url: string): string[] {
  const [pathname, search] = url.split('?')
  return search ? [pathname, search] : [pathname]
}

export function useApi<TResponse, TBody = undefined>(
  options: ApiOptions<TResponse, TBody>
): TBody extends undefined
  ? UseQueryResult<TResponse, Error>
  : UseMutationResult<TResponse, Error, TBody> {
  const {
    url,
    method = 'GET',
    body,
    queryKey,
    enabled = true,
    autoRefetchOnWindowFocus = false,
    staleTime = 0,
    onSuccess,
    onError,
  } = options

  const queryClient = useQueryClient()
  const key = queryKey || urlToQueryKey(url)

  const queryResult = useQuery<TResponse, Error>({
    queryKey: key,
    queryFn: async () => {
      return await api(url, {
        method: 'GET',
      })
    },
    enabled: enabled && method === 'GET',
    staleTime,
    refetchOnWindowFocus: autoRefetchOnWindowFocus,
  })

  const mutationResult = useMutation<TResponse, Error, TBody>({
    mutationFn: async (data) => {
      const payload = data ?? body

      switch (method) {
        case 'POST':
        case 'PUT':
        case 'PATCH':
          return await api(url, {
            method,
            body: payload as BodyInit | Record<string, any> | null | undefined,
          })
        case 'DELETE':
          return await api(url, {
            method: 'DELETE',
          })
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
    },
    onSuccess: (data) => {
      onSuccess?.(data)
      queryClient.invalidateQueries({ queryKey: key })
    },
    onError: (error) => {
      onError?.(error)
    },
  })

  return (method === 'GET' ? queryResult : mutationResult) as any
}
