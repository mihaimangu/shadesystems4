'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useEffect } from 'react'

export function HeaderThemeSetter() {
  const { setHeaderTheme } = useHeaderTheme()
  useEffect(() => {
    setHeaderTheme('dark')
  })
  return null
}
