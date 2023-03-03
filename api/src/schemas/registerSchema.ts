export default {
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        minLength: 1,
        maxLength: 100
      },
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
        'email',
        'username',
        'password', 
    ]
  }
}