'use client'

import { usePathname, useParams } from 'next/navigation'
import { useMemo, useEffect, useState } from 'react'

export const useRoute = () => {
  const pathname = usePathname()
  const params = useParams()

  const [query, setQuery] = useState<Record<string, string>>({})
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const result: Record<string, string> = {}
      urlParams.forEach((value, key) => {
        result[key] = value
      })
      setQuery(result)
      setOrigin(window.location.origin)
    }
  }, [])

  const asPath = useMemo(() => {
    const qs = new URLSearchParams(query).toString()
    return qs ? `${pathname}?${qs}` : pathname
  }, [pathname, query])

  return {
    pathname,
    query,
    params,
    asPath,
    fullPath: `${origin}${asPath}`,
    origin,
  }
}
