import user from "./user";
import tours from "./tours";
import guide from "./guide";
import chats from "./chats";
import payment from "./payment";
import googleplace from "./googleplace";

module.exports = {
  ...user,
  ...tours,
  ...guide,
  ...chats,
  ...payment,
  ...googleplace
};
