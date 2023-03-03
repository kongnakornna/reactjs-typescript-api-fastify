export default {
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        minLength: 2,
        maxLength: 500
      }, 
    },
    required: [ 
      'email', 
    ]
  }
}