import type { User, Department, Product } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ram ',
    email: 'ram123@gmail.com',
    role: 'Frontend Developer',
    department: 'engineering',
    lastLogin: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sita',
    email: 'sss345@gmail.com',
    role: 'Product Manager',
    department: 'product',
    lastLogin: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    name: 'Anksss',
    email: 'ankss21@gmail.com',
    role: 'UI Designer',
    department: 'design',
    lastLogin: '2024-01-16T09:15:00Z',
  },
  {
    id: '4',
    name: 'Shyam',
    email: 'shyam3456@gmail.com',
    role: 'Backend Developer',
    department: 'engineering',
    lastLogin: '2023-12-20T16:45:00Z',
  },
  {
    id: '5',
    name: 'Tom',
    email: 'tom767@gmail.com',
    role: 'Marketing Specialist',
    department: 'marketing',
    lastLogin: '2024-01-15T11:20:00Z',
  },
];

export const mockDepartments: Department[] = [
  { id: 'engineering', name: 'Engineering' },
  { id: 'product', name: 'Product' },
  { id: 'design', name: 'Design' },
  { id: 'marketing', name: 'Marketing' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 199.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation',
  },
  {
    id: '2',
    name: 'Laptop Stand',
    price: 49.99,
    image: 'https://images.pexels.com/photos/5632373/pexels-photo-5632373.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Accessories',
    description: 'Ergonomic laptop stand for better posture',
  },
  {
    id: '3',
    name: 'Coffee Mug',
    price: 24.99,
    image: 'https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Drinkware',
    description: 'Premium ceramic coffee mug with company logo',
  },
  {
    id: '4',
    name: 'Desk Plant',
    price: 34.99,
    image: 'https://images.pexels.com/photos/4503821/pexels-photo-4503821.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Decor',
    description: 'Low-maintenance succulent plant for your desk',
  },
  {
    id: '5',
    name: 'Notebook Set',
    price: 19.99,
    image: 'https://images.pexels.com/photos/4226914/pexels-photo-4226914.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Stationery',
    description: 'Set of 3 premium notebooks for note-taking',
  },
  {
    id: '6',
    name: 'Bluetooth Speaker',
    price: 89.99,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Electronics',
    description: 'Portable Bluetooth speaker with excellent sound quality',
  },
];