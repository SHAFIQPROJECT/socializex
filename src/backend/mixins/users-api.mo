import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";
import UserTypes "../types/users";
import UsersLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  usersState : UsersLib.State,
) {
  public query ({ caller }) func getProfile(userId : CommonTypes.UserId) : async ?UserTypes.UserProfilePublic {
    Debug.todo();
  };

  public shared ({ caller }) func updateProfile(input : UserTypes.UpdateProfileInput) : async () {
    Debug.todo();
  };

  public query ({ caller }) func searchUsers(query_ : Text, limit : Nat) : async [UserTypes.UserProfilePublic] {
    Debug.todo();
  };

  public shared ({ caller }) func followUser(targetId : CommonTypes.UserId) : async () {
    Debug.todo();
  };

  public shared ({ caller }) func unfollowUser(targetId : CommonTypes.UserId) : async () {
    Debug.todo();
  };

  public query ({ caller }) func getFollowers(userId : CommonTypes.UserId, limit : Nat, offset : Nat) : async [UserTypes.UserProfilePublic] {
    Debug.todo();
  };

  public query ({ caller }) func getFollowing(userId : CommonTypes.UserId, limit : Nat, offset : Nat) : async [UserTypes.UserProfilePublic] {
    Debug.todo();
  };

  public query ({ caller }) func getSuggestedUsers(limit : Nat) : async [UserTypes.UserProfilePublic] {
    Debug.todo();
  };

  public shared ({ caller }) func registerUser(username : Text, email : Text) : async () {
    Debug.todo();
  };

  public query ({ caller }) func getCallerProfile() : async ?UserTypes.UserProfilePublic {
    Debug.todo();
  };
};
