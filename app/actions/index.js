import user from './user'
import tours from './tours'
import guide from './guide'
import chats from './chats'

module.exports = {
    ...user,
    ...tours,
    ...guide,
    ...chats,
}