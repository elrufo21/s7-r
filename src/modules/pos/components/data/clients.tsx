export type Client = {
  id: string
  name: string
  location?: string
  email?: string
  total?: string
  selected?: boolean
  details?: string[]
}

export const clients: Client[] = [
  {
    id: '1',
    name: 'Consumidor Final',
    location: 'Huancan Hua ncayo\nJunin Perú',
    selected: true,
  },
  {
    id: '2',
    name: '7 de mayo',
  },
  {
    id: '3',
    name: '9 de mayo',
  },
  {
    id: '4',
    name: 'edu',
    location: 'Abancay Abancay\nApurimac Perú',
  },
  {
    id: '5',
    name: 'Empresa DEMOSTRACION',
    location: 'Avenida Real 754 San\nBorja Lima Perú',
    email: 'alastony@proton.me',
  },
  {
    id: '6',
    name: 'Fernando Villarruel',
    email: 'alastony@proton.me',
  },
  {
    id: '7',
    name: 'jUAN pEREZ',
  },
  {
    id: '8',
    name: 'Juan Velasco',
    email: 'gibajaeddy@gmail.com',
    total: 'S/ 1,427.80',
  },
  {
    id: '9',
    name: 'Manuel',
  },
]
