export const ROLES = {
  ADMIN: 'admin',
  PARTNER: 'partner',
}

export const USERS = [
  {
    username: 'alex.mp@realestate',
    password: 'Sample',
    role: ROLES.ADMIN,
    name: 'Alex MP',
  },
  {
    username: 'partner@realestate',
    password: 'Sample',
    role: ROLES.PARTNER,
    name: 'Michael Thompson',
  },
]

export function findUser(username, password) {
  return USERS.find(
    (u) => u.username === username.trim() && u.password === password,
  )
}
