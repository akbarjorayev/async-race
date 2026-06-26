import { getRandomFromArray } from './random'

const cars = [
  {
    brand: 'Tesla',
    models: [
      'Model S',
      'Model 3',
      'Model X',
      'Model Y',
      'Cybertruck',
      'Roadster',
    ],
  },
  {
    brand: 'Toyota',
    models: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Land Cruiser', 'Prius'],
  },
  {
    brand: 'Ford',
    models: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Bronco', 'Focus'],
  },
  {
    brand: 'BMW',
    models: ['3 Series', '5 Series', 'X3', 'X5', 'M3', 'M5'],
  },
  {
    brand: 'Mercedes-Benz',
    models: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'AMG GT'],
  },
  {
    brand: 'Audi',
    models: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'RS7'],
  },
  {
    brand: 'Honda',
    models: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'HR-V'],
  },
  {
    brand: 'Nissan',
    models: ['Altima', 'Sentra', 'Maxima', 'Rogue', 'Pathfinder', 'GT-R'],
  },
  {
    brand: 'Hyundai',
    models: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Palisade'],
  },
  {
    brand: 'Kia',
    models: ['Rio', 'Cerato', 'Sportage', 'Sorento', 'Seltos', 'Stinger'],
  },
]

export function generateRandomCars(number: number = 100) {
  const generated = []

  for (let i = 0; i < number; i++) {
    const brand = getRandomFromArray(cars)
    const model = getRandomFromArray(brand.models)
    generated.push({
      name: `${brand.brand} ${model}`,
      color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 30%)`,
    })
  }

  return generated
}
