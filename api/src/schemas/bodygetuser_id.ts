export default {
  body: {
    type: 'object',
    properties: {
        user_id: {
        type: 'integer',
        //minLength: 4,
        //maxLength: 500
      }, 
    },
    required: [
      'user_id', 
    ]
  }
}