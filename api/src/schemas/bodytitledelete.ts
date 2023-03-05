export default {
  body: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        minLength: 1,
        }, 
    },
    required: [
        'id',  
    ]
  }
}