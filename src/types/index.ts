export type HouseVariant = 'cedar' | 'glass' | 'cabin'

export interface Property {
  id: string
  name: string
  location: string
  price: string
  beds: number
  baths: number
  area: number
  tags: string[]
  variant: HouseVariant
  image?: string
}
