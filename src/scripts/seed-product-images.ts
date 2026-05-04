import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const productImages: Record<string, { url: string; filename: string; alt: string }> = {
  awnings: {
    url: 'https://images.pexels.com/photos/32033849/pexels-photo-32033849.jpeg?auto=compress&cs=tinysrgb&w=1200',
    filename: 'awnings.jpg',
    alt: 'Awnings on a building facade',
  },
  'roller-shutters': {
    url: 'https://images.pexels.com/photos/35566817/pexels-photo-35566817.jpeg?auto=compress&cs=tinysrgb&w=1200',
    filename: 'roller-shutters.jpg',
    alt: 'Roller shutters on a building',
  },
  'indoor-screens': {
    url: 'https://images.pexels.com/photos/19304054/pexels-photo-19304054.jpeg?auto=compress&cs=tinysrgb&w=1200',
    filename: 'indoor-screens.jpg',
    alt: 'Indoor roller blind on a window',
  },
  parasols: {
    url: 'https://images.pexels.com/photos/30065028/pexels-photo-30065028.jpeg?auto=compress&cs=tinysrgb&w=1200',
    filename: 'parasols.jpg',
    alt: 'Outdoor parasol in a cafe terrace',
  },
  pergola: {
    url: 'https://images.pexels.com/photos/11832850/pexels-photo-11832850.jpeg?auto=compress&cs=tinysrgb&w=1200',
    filename: 'pergola.jpg',
    alt: 'Modern pergola in a garden',
  },
  maintenance: {
    url: 'https://images.pexels.com/photos/17842832/pexels-photo-17842832.jpeg?auto=compress&cs=tinysrgb&w=1200',
    filename: 'maintenance.jpg',
    alt: 'Technician performing maintenance work',
  },
  repairs: {
    url: 'https://images.pexels.com/photos/9242258/pexels-photo-9242258.jpeg?auto=compress&cs=tinysrgb&w=1200',
    filename: 'repairs.jpg',
    alt: 'Repair work on shade system',
  },
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const mimeType = res.headers.get('content-type') || 'image/jpeg'
  return { buffer, mimeType }
}

async function run() {
  const payload = await getPayload({ config: configPromise })

  for (const [slug, imgData] of Object.entries(productImages)) {
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

    // Skip if already has image
    if (product.image) {
      console.log(`  ⚠️  Already has image: ${slug}`)
      continue
    }

    console.log(`  ↓ Downloading image for: ${slug}`)
    const { buffer, mimeType } = await downloadImage(imgData.url)

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

    console.log(`  ✓ Image attached to: ${product.name}`)
  }

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
