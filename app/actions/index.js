import user from './user'
import tours from './tours'
import guide from './guide'

module.exports = {
    ...user,
    ...tours,
    ...guide,
}