export default {
  body: {
    type: 'object',
    properties: { 
      seminar_title_id: {
        type: 'number',
        minLength: 1,
        },
        startdate: {
            type: 'string',
            minLength: 1, 
        }, 
        enddate: {
            type: 'string', 
             minLength: 1, 
      }, 
    },
    required: [
        'seminar_title_id',  
    ]
  }
}