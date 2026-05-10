import 'dotenv/config'
import { fal } from '@fal-ai/client'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

fal.config({ credentials: process.env.FAL_KEY })

const productPrompts: Record<string, { prompt: string; filename: string; alt: string }> = {
  awnings: {
    prompt:
      'modern retractable fabric awning extended over a sunny Mediterranean residential terrace, warm golden light, architectural exterior photography, high quality',
    filename: 'awnings.jpg',
    alt: 'Modern retractable awning over a residential terrace',
  },
  'roller-shutters': {
    prompt:
      'elegant aluminum roller shutters on a modern residential building facade, clean lines, exterior architecture photography, high quality',
    filename: 'roller-shutters.jpg',
    alt: 'Elegant aluminum roller shutters on a modern building',
  },
  'indoor-screens': {
    prompt:
      'stylish interior roller blinds on large floor-to-ceiling windows, modern minimalist living room, soft diffused natural light, interior design photography',
    filename: 'indoor-screens.jpg',
    alt: 'Stylish interior roller blinds on large windows',
  },
  parasols: {
    prompt:
      'premium large outdoor parasol umbrella shading a Mediterranean cafe terrace, elegant furniture, summer ambiance, warm sunlight, high quality photography',
    filename: 'parasols.jpg',
    alt: 'Premium outdoor parasol on a Mediterranean terrace',
  },
  pergola: {
    prompt:
      'modern aluminum pergola with adjustable louvre roof over a beautiful garden patio, contemporary outdoor living space, architectural photography',
    filename: 'pergola.jpg',
    alt: 'Modern aluminum pergola with louvre roof in a garden',
  },
  maintenance: {
    prompt:
      'professional technician performing maintenance on a retractable awning shade system mounted on a building, wearing work uniform, outdoor service work',
    filename: 'maintenance.jpg',
    alt: 'Professional technician maintaining a shade awning system',
  },
  repairs: {
    prompt:
      'skilled technician repairing a roller shutter or awning shade system on a building exterior, professional tools, close-up technical repair work',
    filename: 'repairs.jpg',
    alt: 'Skilled technician repairing a shade system',
  },
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  return { buffer: Buffer.from(arrayBuffer), mimeType: 'image/jpeg' }
}

async function run() {
  const payload = await getPayload({ config: configPromise })

  for (const [slug, imgData] of Object.entries(productPrompts)) {
    console.log(`\n⟳ Generating image for: ${slug}`)

    // Generate image via FAL nano-banana-2
    const result = await fal.subscribe('fal-ai/nano-banana-2', {
      input: {
        prompt: imgData.prompt,
        num_images: 1,
        aspect_ratio: '4:3',
        resolution: '1K',
        output_format: 'jpeg',
        safety_tolerance: '2',
      },
    }) as { images: { url: string }[] }

    const imageUrl = result.images[0]?.url
    if (!imageUrl) {
      console.log(`  ⚠️  No image returned for: ${slug}`)
      continue
    }

    // Find the product
    const productResult = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const product = productResult.docs[0]
    if (!product) {
      console.log(`  ⚠️  Product not found: ${slug}`)
      continue
    }

    // Remove existing image if present
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

    console.log(`  ↓ Downloading generated image...`)
    const { buffer, mimeType } = await downloadImage(imageUrl)

    // Upload to media collection
    const mediaDoc = await payload.create({
      collection: 'media',
      data: { alt: imgData.alt },
      file: {
        data: buffer,
        mimetype: mimeType,
        name: imgData.filename,
        size: buffer.length,
      },
      context: { disableRevalidate: true },
    })

    // Update product with media ID
    await payload.update({
      collection: 'products',
      id: product.id,
      data: { image: mediaDoc.id },
      context: { disableRevalidate: true },
    })

    console.log(`  ✓ AI image attached to: ${product.name}`)
  }

  console.log('\nDone.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
