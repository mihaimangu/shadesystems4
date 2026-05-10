import 'dotenv/config'
import { fal } from '@fal-ai/client'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Usage: tsx src/scripts/generate-product-image-fal.ts <product-slug> "<prompt>"
// Example: tsx src/scripts/generate-product-image-fal.ts maintenance "technician servicing an awning"

const [slug, prompt] = process.argv.slice(2)

if (!slug || !prompt) {
  console.error('Usage: tsx src/scripts/generate-product-image-fal.ts <product-slug> "<prompt>"')
  process.exit(1)
}

if (!process.env.FAL_KEY) {
  console.error('FAL_KEY env variable is required')
  process.exit(1)
}

fal.config({ credentials: process.env.FAL_KEY })

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function run() {
  const payload = await getPayload({ config: configPromise })

  // Find the product
  const productResult = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const product = productResult.docs[0]
  if (!product) {
    console.error(`Product not found: ${slug}`)
    process.exit(1)
  }

  console.log(`Generating image for "${product.name}" with prompt:\n  ${prompt}\n`)

  const result = (await fal.subscribe('fal-ai/nano-banana-2', {
    input: {
      prompt,
      num_images: 1,
      aspect_ratio: '4:3',
      resolution: '1K',
      output_format: 'jpeg',
      safety_tolerance: '2',
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === 'IN_PROGRESS') {
        update.logs?.forEach((log) => console.log(' ', log.message))
      }
    },
  })) as { data?: { images: { url: string }[] }; images?: { url: string }[] }

  console.log('FAL result keys:', Object.keys(result))
  const images = (result as any).data?.images ?? (result as any).images
  const imageUrl = images?.[0]?.url
  if (!imageUrl) throw new Error('No image returned from FAL')

  // Remove existing image
  if (product.image) {
    const mediaId = typeof product.image === 'object' ? product.image.id : product.image
    await payload
      .delete({ collection: 'media', id: mediaId, context: { disableRevalidate: true } })
      .catch(() => {})
    await payload.update({
      collection: 'products',
      id: product.id,
      data: { image: null },
      context: { disableRevalidate: true },
    })
  }

  console.log('↓ Downloading generated image...')
  const buffer = await downloadImage(imageUrl)

  const mediaDoc = await payload.create({
    collection: 'media',
    data: { alt: `${product.name} product image` },
    file: {
      data: buffer,
      mimetype: 'image/jpeg',
      name: `${slug}.jpg`,
      size: buffer.length,
    },
    context: { disableRevalidate: true },
  })

  await payload.update({
    collection: 'products',
    id: product.id,
    data: { image: mediaDoc.id },
    context: { disableRevalidate: true },
  })

  console.log(`✓ Done. Image attached to: ${product.name}`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
