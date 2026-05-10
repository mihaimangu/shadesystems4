import 'dotenv/config'
import { fal } from '@fal-ai/client'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Usage: tsx src/scripts/generate-about-image-fal.ts "<prompt>"

const [prompt] = process.argv.slice(2)

if (!prompt) {
  console.error('Usage: tsx src/scripts/generate-about-image-fal.ts "<prompt>"')
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

  console.log(`Generating About Us image with prompt:\n  ${prompt}\n`)

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
  })) as { data?: { images: { url: string }[] } }

  const images = (result as any).data?.images ?? (result as any).images
  const imageUrl = images?.[0]?.url
  if (!imageUrl) throw new Error('No image returned from FAL')

  // Get current about image from global to delete it
  const current = await payload.findGlobal({ slug: 'homepage-settings' })
  const existingImage = (current as any).about?.image

  if (existingImage) {
    const mediaId = typeof existingImage === 'object' ? existingImage.id : existingImage
    await payload
      .delete({ collection: 'media', id: mediaId, context: { disableRevalidate: true } })
      .catch(() => {})
  }

  console.log('↓ Downloading generated image...')
  const buffer = await downloadImage(imageUrl)

  const mediaDoc = await payload.create({
    collection: 'media',
    data: { alt: 'Shade Systems team and showroom' },
    file: {
      data: buffer,
      mimetype: 'image/jpeg',
      name: 'about-us.jpg',
      size: buffer.length,
    },
    context: { disableRevalidate: true },
  })

  await payload.updateGlobal({
    slug: 'homepage-settings',
    data: {
      about: {
        ...(current as any).about,
        image: mediaDoc.id,
      },
    } as any,
    context: { disableRevalidate: true },
  })

  console.log('✓ Done. About Us image updated.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
