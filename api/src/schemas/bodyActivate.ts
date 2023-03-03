export default {
  body: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        minLength: 10,
      }, 
    },
    required: [
      'code', 
    ]
  }
}