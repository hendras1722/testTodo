import { ofetch, type FetchOptions } from 'ofetch'
import Cookies from 'js-cookie'

export const useFetch = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000',
  onRequest({ options }: { options: FetchOptions }) {
    const token = Cookies.get('token')
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  },
  onResponse({ response }) {
    console.log('[API SUCCESS]', response.url)
    if (response.status === 401) {
      throw new Error('Unauthorized')
    }
    return response._data
  },
  onResponseError({ response }) {
    console.error('[API ERROR]', response.status, response._data)
  },
})
