import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const products = [
  {
    name: 'Awnings',
    slug: 'awnings',
    description:
      'Retractable and fixed fabric awnings for patios, windows and façades — motorised or manual operation.',
    order: 1,
  },
  {
    name: 'Roller Shutters',
    slug: 'roller-shutters',
    description:
      'Durable aluminium roller shutters for security, insulation and light control on windows and doors.',
    order: 2,
  },
  {
    name: 'Indoor Screens',
    slug: 'indoor-screens',
    description:
      'Interior roller screens and blinds that filter light and improve privacy in any room.',
    order: 3,
  },
  {
    name: 'Parasols',
    slug: 'parasols',
    description:
      'Commercial and residential parasols in a wide range of sizes and fabrics for outdoor comfort.',
    order: 4,
  },
  {
    name: 'Pergola',
    slug: 'pergola',
    description:
      'Freestanding and wall-mounted aluminium pergolas with optional louvre roofs and side screens.',
    order: 5,
  },
  {
    name: 'Maintenance',
    slug: 'maintenance',
    description:
      'Regular servicing and preventive maintenance plans to keep your shade systems in perfect condition.',
    order: 6,
  },
  {
    name: 'Repairs',
    slug: 'repairs',
    description:
      'Fast and reliable repair service for all types of awnings, shutters, screens and pergola systems.',
    order: 7,
  },
]

async function run() {
  const payload = await getPayload({ config: configPromise })

  console.log('Seeding products...')

  for (const product of products) {
    // Check if already exists
    const existing = await payload.find({
      collection: 'products',
      where: { name: { equals: product.name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ⚠️  Already exists: ${product.name}`)
      continue
    }

    await payload.create({
      collection: 'products',
      data: product,
      context: { disableRevalidate: true },
    })
    console.log(`  ✓ Created: ${product.name}`)
  }

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
