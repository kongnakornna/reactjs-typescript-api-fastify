export default {
  body: {
    type: 'object',
    properties: {
      seminar_title_id: {
        type: 'number',
        minLength: 1
      },
      seminar_id: {
        type: 'number',
        minLength: 1
      }, 
       period_id: {
        type: 'number',
        minLength: 1
      }, 
    },
    required: [  
        'seminar_title_id',
        'seminar_id', 
        'period_id', 
    ]
  }
}
/*
seminar_title_id
datetime
period_id
seminar_id
active_datatime
status_active
*/