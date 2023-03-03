export default {
  properties: {
    'x-fastify-token': {
      type: 'string'
    },
    description: "request token", 
  },
  headers: {
    type: "object",
    properties: {
        client_id: {
            type: 'string'
        },
        secret_key: {
            type: 'string',
        }, 
        access_token_key: {
            type: 'string'
        },
    },
      required:[ 
                'access_token_key'
                ]
  },body: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        minLength: 4,
        maxLength: 500
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 500
      },
    },
      required: [],
    }
}