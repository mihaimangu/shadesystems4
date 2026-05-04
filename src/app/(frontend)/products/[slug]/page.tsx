import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import RichText from '@/components/RichText'
import type { Media, Product } from '@/payload-types'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs[0] ?? null
})

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return {
    title: `${product.name} — Shade Systems`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  const image =
    product.image && typeof product.image === 'object' ? (product.image as Media) : null
  const imgUrl = image?.url ? getMediaUrl(image.url, image.updatedAt) : null

  return (
    <div className={`product-page ${plusJakarta.variable}`} style={{ fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif' }}>

      {/* Hero */}
      <div className="product-page-hero">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={image?.alt || product.name}
            fill
            priority
            className="product-page-hero-img"
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
        ) : (
          <div className="product-page-hero-placeholder" />
        )}
        <div className="product-page-hero-overlay" />
        <div className="product-page-hero-content">
          <Link href="/" className="product-page-breadcrumb">
            Home
          </Link>
          <span className="product-page-breadcrumb-sep"> / </span>
          <span className="product-page-breadcrumb-cur">Products</span>
          <h1 className="product-page-title">{product.name}</h1>
          <p className="product-page-sub">{product.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="product-page-body">
        <div className="product-page-body-inner">
          {product.content ? (
            <RichText data={product.content} enableGutter={false} />
          ) : (
            <p style={{ color: '#4a5568', lineHeight: 1.8 }}>
              Detailed information about this product will be available soon.
            </p>
          )}

          <div className="product-page-cta">
            <Link href="/contact" className="product-page-btn-primary">
              Request a Quote
            </Link>
            <Link href="/products" className="product-page-btn-back">
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
