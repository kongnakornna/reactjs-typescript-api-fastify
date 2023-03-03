export default {
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        minLength: 4,
        maxLength: 1000
      }, 
    },
    required: [ // important ,validate role ,input data
        'email', 
    ]
  }
}