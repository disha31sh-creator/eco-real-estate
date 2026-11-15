import type { Property } from '../types'

// Placeholder listings. Replace with real data later.
export const properties: Property[] = [
  {
    id: 'cedar-ridge',
    name: 'Cedar Ridge Residence',
    location: 'Cascade Foothills',
    price: '$1,450,000',
    beds: 4,
    baths: 3,
    area: 285,
    tags: ['Net-zero', 'Solar roof', 'Rainwater'],
    variant: 'cedar',
    image: '/images/properties/cedar-ridge.jpg',
  },
  {
    id: 'willow-glass',
    name: 'Willow Glass House',
    location: 'Alder Valley',
    price: '$1,120,000',
    beds: 3,
    baths: 2,
    area: 210,
    tags: ['Passive house', 'Geothermal'],
    variant: 'glass',
    image: '/images/properties/willow-glass.jpg',
  },
  {
    id: 'moss-hollow',
    name: 'Moss Hollow Cabin',
    location: 'Pinecrest Hollow',
    price: '$695,000',
    beds: 2,
    baths: 2,
    area: 140,
    tags: ['Green roof', 'FSC timber'],
    variant: 'cabin',
    image: '/images/properties/moss-hollow.jpg',
  },
]
