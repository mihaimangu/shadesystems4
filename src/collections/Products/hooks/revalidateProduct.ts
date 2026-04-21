import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Product } from '../../../payload-types'

export const revalidateProduct: CollectionAfterChangeHook<Product> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/products/${doc.slug}`
    payload.logger.info(`Revalidating product at path: ${path}`)
    revalidatePath(path)
    revalidatePath('/')
    revalidateTag('products')

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      revalidatePath(`/products/${previousDoc.slug}`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Product> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/products/${doc?.slug}`)
    revalidatePath('/')
    revalidateTag('products')
  }
  return doc
}
