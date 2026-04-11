const pool = require('./index')

const brands = [
  { name: 'Toyota',     slug: 'toyota',      logo: '' },
  { name: 'BMW',        slug: 'bmw',         logo: '' },
  { name: 'Mercedes',   slug: 'mercedes',    logo: '' },
  { name: 'Audi',       slug: 'audi',        logo: '' },
  { name: 'Volkswagen', slug: 'volkswagen',  logo: '' },
  { name: 'Skoda',      slug: 'skoda',       logo: '' },
  { name: 'Kia',        slug: 'kia',         logo: '' },
  { name: 'Hyundai',    slug: 'hyundai',     logo: '' },
  { name: 'Nissan',     slug: 'nissan',      logo: '' },
  { name: 'Mazda',      slug: 'mazda',       logo: '' },
  { name: 'Mitsubishi', slug: 'mitsubishi',  logo: '' },
  { name: 'Honda',      slug: 'honda',       logo: '' },
  { name: 'Lexus',      slug: 'lexus',       logo: '' },
  { name: 'Infiniti',   slug: 'infiniti',    logo: '' },
  { name: 'Subaru',     slug: 'subaru',      logo: '' },
  { name: 'Suzuki',     slug: 'suzuki',      logo: '' },
  { name: 'Renault',    slug: 'renault',     logo: '' },
  { name: 'Peugeot',    slug: 'peugeot',     logo: '' },
  { name: 'Citroen',    slug: 'citroen',     logo: '' },
  { name: 'Opel',       slug: 'opel',        logo: '' },
  { name: 'Ford',       slug: 'ford',        logo: '' },
  { name: 'Chevrolet',  slug: 'chevrolet',   logo: '' },
  { name: 'Cadillac',   slug: 'cadillac',    logo: '' },
  { name: 'Chrysler',   slug: 'chrysler',    logo: '' },
  { name: 'Jeep',       slug: 'jeep',        logo: '' },
  { name: 'Dodge',      slug: 'dodge',       logo: '' },
  { name: 'Tesla',      slug: 'tesla',       logo: '' },
  { name: 'Geely',      slug: 'geely',       logo: '' },
  { name: 'Haval',      slug: 'haval',       logo: '' },
  { name: 'Chery',      slug: 'chery',       logo: '' },
  { name: 'Lifan',      slug: 'lifan',       logo: '' },
  { name: 'Great Wall', slug: 'great-wall',  logo: '' },
  { name: 'BYD',        slug: 'byd',         logo: '' },
  { name: 'FAW',        slug: 'faw',         logo: '' },
  { name: 'UAZ',        slug: 'uaz',         logo: '' },
  { name: 'Lada',       slug: 'lada',        logo: '' },
]

async function seed() {
  try {
    for (const b of brands) {
      await pool.query(
        `INSERT INTO brands (name, slug, logo) VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO NOTHING`,
        [b.name, b.slug, b.logo]
      )
    }
    console.log('✅ Seed completed: 36 brands added')
  } catch (err) {
    console.error('Seed error:', err)
  } finally {
    await pool.end()
  }
}

seed()
