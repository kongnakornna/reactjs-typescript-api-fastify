export default {
    body: {
      type: 'object',
      properties: {
        client_id: {
          type: 'string',
          minLength: 6,
          maxLength: 100
        },
        password: {
          type: 'string',
          minLength: 8,
          maxLength: 15
        },
        firstName: {
          type: 'string',
          minLength: 8,
          maxLength: 15
        }, 
      },
      required: [
        'client_id',
        'password',
        'firstName',
        'lastName'
      ]
    }
  }