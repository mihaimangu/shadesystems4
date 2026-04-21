import type { Metadata } from 'next'
import { HomePage } from '@/components/HomePage'

export default function Page() {
  return <HomePage />
}

export const metadata: Metadata = {
  title: 'Shade Systems — Crafted for Living Outdoors',
  description:
    'Premium shade solutions for outdoor living spaces. Pergolas, awnings, roller screens, zip blinds, louvre roofs and glass rooms — precision-crafted for every space.',
}
