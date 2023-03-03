export default {
  body: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        minLength: 1,
        maxLength: 100
      },
      password: {
        type: 'string',
        minLength: 1,
        maxLength: 100
      }, 
    },
    required: [ // important ,validate role ,input data
        'username',
        'password', 
    ]
  }
}