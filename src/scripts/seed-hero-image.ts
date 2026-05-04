import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function run() {
  const payload = await getPayload({ config: configPromise })

  const url =
    'https://images.pexels.com/photos/36388699/pexels-photo-36388699.jpeg?auto=compress&cs=tinysrgb&w=1920'

  console.log('Downloading hero image...')
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())

  console.log('Uploading to media...')
  const media = await payload.create({
    collection: 'media',
    data: { alt: 'Modern pergola overlooking a scenic landscape' },
    file: {
      data: buffer,
      mimetype: 'image/jpeg',
      name: 'hero-pergola.jpg',
      size: buffer.length,
    },
    context: { disableRevalidate: true },
  })

  console.log(`Media created with ID: ${media.id}`)

  console.log('Attaching to HomepageSettings hero...')
  await payload.updateGlobal({
    slug: 'homepage-settings',
    data: {
      hero: { image: media.id },
    },
    context: { disableRevalidate: true },
  })

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
