export default {
  body: {
    type: 'object',
    properties: {
      type_id: {
        type: 'number',
        minLength: 1,
      },
      ipaddress: {
        type: 'string',
        minLength: 2, 
      },
      port: {
        type: 'string',
        minLength: 8,
      }, 
      status: {
        type: 'number'
      }, 
    },
    required: [
      'type_id',
      'ipaddress',
      'port', 
      'status', 
    ]
  }
}
/*
id
type_id
ipaddress
url
port
name
oid
status
alarm
warning
normal
create
update
unit
statuschk
user
password

*/