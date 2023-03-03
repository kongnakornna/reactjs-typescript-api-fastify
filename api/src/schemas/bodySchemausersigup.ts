export default {
  body: {
    type: 'object',
    properties: {
        firstname: {
            type: 'string',
            minLength: 4, 
        },
        lastname: {
                    type: 'string',
                    minLength: 4, 
                },
        email: {
                    type: 'string',
                    minLength: 4, 
        },
        username: {
              type: 'string',
              minLength: 4
        },
        password: {
              type: 'string',
              minLength: 8
        }, 
    },
    required: [
      'firstname',
      'lastname',
      'email',
      'username',
      'password', 
    ]
  }
}
/**
user_id
firstname
lastname
fullname
nickname
idcard
date
username
password
email
level
status
network_id
avatar
remark
infomation_agree_status
gender
birthday
last_sign_in
online_status
mesage
password_temp
profile_id
network_type_id
public
isActive

 * 
 */