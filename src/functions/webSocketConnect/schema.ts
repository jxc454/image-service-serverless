export default {
  type: 'object',
  properties: {
    name: { type: 'string' },
    location: { type: 'string' },
  },
  required: ['name'],
} as const
