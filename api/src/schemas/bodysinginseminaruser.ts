export default {
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        minLength: 1, 
      },
      password: {
        type: 'string',
        minLength: 1, 
      }, 
    },
    required: [ // important ,validate role ,input data
        'email',
        'password', 
    ]
  }
}