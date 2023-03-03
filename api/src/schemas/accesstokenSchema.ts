export default {
  body: {
    type: 'object',
    properties: {
        client_id: {
        type: 'string',
       // minLength: 4,
       // maxLength: 500
      },
      secret_key: {
        type: 'string',
       // minLength: 15,
       // maxLength: 100
      }, 
      access_token_key: {
        type: 'string',
       // minLength: 15,
       // maxLength: 100
      }, 
    },
    required: [ // important ,validate role ,input data
        'client_id', 
        'secret_key', 
        'access_token_key',  
    ]
  }
}