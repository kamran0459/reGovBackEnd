'use strict';
const userName = {
  required: true,
  type: 'string',
  minLength: 6,
  messages: {
    required: 'User Name is missing',
    type: 'User Name must be of string type',
    minLength: 'User Name must be of minimum 6 characters'
  }
};

const create = {
  properties: {
    data: {
      type: 'object',
      required: true,
      properties: {
        userName,
        email: {
          required: true,
          type: 'string',
          format: 'email',
          messages: {
            required: 'email is missing',
            type: 'email must be of string type',
            format: 'invalid email format'
          }
        },
        fullName: {
          required: true,
          type: 'string',
          messages: {
            required: 'fullName is missing',
            type: 'fullName must be of string type'
          }
        },
        // password: {
        //   required: true,
        //   type: 'string',
        //   messages: {
        //     required: 'password is missing',
        //     type: 'password must be of string type'
        //   }
        // },
        // password: {
        //   required: true,
        //   type: 'string',
        //   messages: {
        //     required: 'password is missing',
        //     type: 'password must be of string type'
        //   }
        // },
        // password: {
        //   required: true,
        //   type: 'string',
        //   messages: {
        //     required: 'password is missing',
        //     type: 'password must be of string type'
        //   }
        // },
        // password: {
        //   required: true,
        //   type: 'string',
        //   messages: {
        //     required: 'password is missing',
        //     type: 'password must be of string type'
        //   }
        // }
      },
      messages: {
        required: 'data is missing',
        type: 'data must be of object type'
      }
    }
  }
};

// const update = {
//   properties: {
//     action: common.action,
//     data: {
//       type: 'object',
//       required: true,
//       properties: {
//         userType: {
//           required: true,
//           type: 'string',
//           enum: commonConst.user.userType,
//           messages: {
//             required: 'userType is missing',
//             type: 'userType must be of string type',
//             enum: `only ${commonConst.user.userType} allowed`
//           }
//         },
//         userID: userID,
//         id: {
//           required: true,
//           type: 'string',
//           messages: {
//             required: 'id is missing',
//             type: 'id must be of string type'
//           }
//         },
//         entityID: {
//           required: false,
//           type: 'string',
//           messages: {
//             required: 'entityID is missing',
//             type: 'entityID must be of string type'
//           }
//         },
//         acquirerID: {
//           required: false,
//           type: 'string',
//           messages: {
//             required: 'acquirerID is missing',
//             type: 'acquirerID must be of string type'
//           }
//         },
//         isActive: {
//           required: true,
//           type: 'boolean',
//           messages: {
//             required: 'isActive is missing',
//             type: 'isActive must be of boolean type'
//           }
//         },
//         orgType: {
//           required: true,
//           type: 'string',
//           enum: commonConst.user.orgType,
//           messages: {
//             required: 'orgType is missing',
//             type: 'orgType must be of string type',
//             enum: `only ${commonConst.user.orgType} allowed`
//           }
//         },
//         orgCode: {
//           required: false,
//           type: 'string',
//           messages: {
//             required: 'orgCode is missing',
//             type: 'orgCode must be of string type'
//           }
//         },
//         groups: {
//           required: true,
//           type: 'array',
//           minItems: 1,
//           messages: {
//             required: 'groups is missing',
//             type: 'groups must be of array type',
//             minItems: 'groups must have minimum one item'
//           }
//         }
//       },
//       messages: {
//         required: 'data is missing',
//         type: 'data must be of object type'
//       }
//     }
//   }
// };

module.exports = {
  create,
  // update,
  userName
};
