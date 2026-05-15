import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import AdminTypes "../types/admin";
import UserTypes "../types/users";
import PostTypes "../types/posts";
import CommonTypes "../types/common";
import UsersLib "../lib/users";
import PostsLib "../lib/posts";
import NotificationsLib "../lib/notifications";
import MessagingLib "../lib/messaging";

mixin (
  accessControlState : AccessControl.AccessControlState,
  usersState : UsersLib.State,
  postsState : PostsLib.State,
  notificationsState : NotificationsLib.State,
  messagingState : MessagingLib.State,
) {
  public query ({ caller }) func getAdminStats() : async AdminTypes.AdminStats {
    Debug.todo();
  };

  public query ({ caller }) func getAdminUsers(limit : Nat, offset : Nat) : async [UserTypes.UserProfilePublic] {
    Debug.todo();
  };

  public shared ({ caller }) func banUser(userId : CommonTypes.UserId) : async () {
    Debug.todo();
  };

  public shared ({ caller }) func unbanUser(userId : CommonTypes.UserId) : async () {
    Debug.todo();
  };

  public query ({ caller }) func getAdminPosts(limit : Nat, offset : Nat) : async [PostTypes.PostPublic] {
    Debug.todo();
  };

  public shared ({ caller }) func deleteAdminPost(postId : CommonTypes.PostId) : async () {
    Debug.todo();
  };
};
