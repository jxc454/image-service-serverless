export default {
  type: 'object',
  properties: {
    location: { type: 'string' },
    timestamp: { type: 'string' },
    mph: { type: 'string' },
    image: { type: 'file' },
  },
  required: ['location', 'timestamp', 'mph', 'image'],
} as const
