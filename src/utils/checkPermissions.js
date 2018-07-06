/*
  权限比对函数 params 指定权限的tag
*/
import store from '@/store/index'

export default function (tag) {
  let authList = store.getters.roles
  
  let roles = []
  if (!authList || authList.length === 0) {
    return false
  }
  authList.map((x) => {
    if (x.tag) {
      roles.push(x.tag)
    }
  })
  roles = Array.from(new Set(roles))
  // console.log(roles)
  return roles.includes(tag)
}

// export default function (tag) {
//   if(localStorage._MyDaDao_user_data){
//     let authList = JSON.stringify(localStorage._MyDaDao_user_data);
//   }
  
//   console.log(authList)
//   let roles = []
//   if (!authList || authList.length === 0) {
//     return false
//   }
//   authList.map((x) => {
//     if (x.tag) {
//       roles.push(x.tag)
//     }
//   })
//   roles = Array.from(new Set(roles))
//   console.log(roles)
//   return roles.includes(tag)
// }
