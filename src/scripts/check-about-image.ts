import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function run() {
  const payload = await getPayload({ config: configPromise })
  const g = await payload.findGlobal({ slug: 'homepage-settings' })
  console.log('about.image:', JSON.stringify((g as any).about?.image, null, 2))
  process.exit(0)
}
run().catch(console.error)
