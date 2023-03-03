export default {
  body: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        minLength: 4,
        maxLength: 10
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 15
      },
      firstname: {
        type: 'string',
        minLength: 8,
        maxLength: 15
      },
      lastname: {
        type: 'string',
        minLength: 8,
        maxLength: 15
      },
      sex: {
        type: 'string',
        enum: ['M', 'W']
      },
      age: {
        type: 'integer'
      }
    },
    required: [
      'username',
      'password',
      'firstname',
      'lastname'
    ]
  }
}