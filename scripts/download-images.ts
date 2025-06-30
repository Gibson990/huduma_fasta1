import fs from 'fs'
import path from 'path'
import https from 'https'

const categories = [
  { name: 'cleaning', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80' },
  { name: 'gardening', url: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80' },
  { name: 'plumbing', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80' },
  { name: 'electrical', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80' },
  { name: 'painting', url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80' }
]

const services = [
  { name: 'cleaning-basic', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80' },
  { name: 'cleaning-deep', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80' },
  { name: 'garden-maintenance', url: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80' },
  { name: 'plant-installation', url: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80' },
  { name: 'pipe-repair', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80' },
  { name: 'drainage-cleaning', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80' },
  { name: 'electrical-installation', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80' },
  { name: 'circuit-repair', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80' },
  { name: 'interior-painting', url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80' },
  { name: 'exterior-painting', url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80' }
]

async function downloadImage(url: string, filepath: string) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath)
        response.pipe(writeStream)
        writeStream.on('finish', () => {
          writeStream.close()
          resolve(true)
        })
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`))
      }
    }).on('error', reject)
  })
}

async function downloadAllImages() {
  // Create directories if they don't exist
  const categoriesDir = path.join(process.cwd(), 'public', 'images', 'categories')
  const servicesDir = path.join(process.cwd(), 'public', 'images', 'services')
  
  if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true })
  }
  if (!fs.existsSync(servicesDir)) {
    fs.mkdirSync(servicesDir, { recursive: true })
  }

  // Download category images
  for (const category of categories) {
    const filepath = path.join(categoriesDir, `${category.name}.jpg`)
    try {
      await downloadImage(category.url, filepath)
      console.log(`Downloaded ${category.name} image`)
    } catch (error) {
      console.error(`Error downloading ${category.name} image:`, error)
    }
  }

  // Download service images
  for (const service of services) {
    const filepath = path.join(servicesDir, `${service.name}.jpg`)
    try {
      await downloadImage(service.url, filepath)
      console.log(`Downloaded ${service.name} image`)
    } catch (error) {
      console.error(`Error downloading ${service.name} image:`, error)
    }
  }
}

downloadAllImages().catch(console.error) 