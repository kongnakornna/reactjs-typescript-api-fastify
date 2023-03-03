export default {
  properties: {
    'x-fastify-token': {
      type: 'string'
    },
    description: "allow token", 
  },
  headers: {
    type: "object",
    properties: {
        client_id: {
            type: 'string'
        },
        access_token_key: {
            type: 'string'
        },
    },
      required:['client_id', 
                'access_token_key'
                ]
  },body: {
    type: 'object',
    properties: {
      uid: {
        type: 'string',
        //minLength: 4,
        //maxLength: 500
      }
    },
      required: [],
    }
}