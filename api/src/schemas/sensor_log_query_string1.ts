export default {
  querystring: {
    properties: {
      query: {
        type: 'string',
        minLength: 3
      },
      location_id2: {
        type: 'integer',minLength: 1
      },
      sensor_type_id: {
        type: 'integer',minLength: 1
      }
    },
    required: [
      'location_id2' 
    ]
  }
}