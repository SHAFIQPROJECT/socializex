import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import UserTypes "../types/users";

module {
  public type State = {
    profiles : Map.Map<CommonTypes.UserId, UserTypes.UserProfile>;
    follows : List.List<UserTypes.FollowRelation>;
    nextUserId : { var value : Nat };
  };

  public func getProfile(
    state : State,
    userId : CommonTypes.UserId,
  ) : ?UserTypes.UserProfilePublic {
    Debug.todo();
  };

  public func updateProfile(
    state : State,
    caller : CommonTypes.UserId,
    input : UserTypes.UpdateProfileInput,
  ) : () {
    Debug.todo();
  };

  public func searchUsers(
    state : State,
    query_ : Text,
    limit : Nat,
  ) : [UserTypes.UserProfilePublic] {
    Debug.todo();
  };

  public func followUser(
    state : State,
    followerId : CommonTypes.UserId,
    followingId : CommonTypes.UserId,
  ) : () {
    Debug.todo();
  };

  public func unfollowUser(
    state : State,
    followerId : CommonTypes.UserId,
    followingId : CommonTypes.UserId,
  ) : () {
    Debug.todo();
  };

  public func getFollowers(
    state : State,
    userId : CommonTypes.UserId,
    limit : Nat,
    offset : Nat,
  ) : [UserTypes.UserProfilePublic] {
    Debug.todo();
  };

  public func getFollowing(
    state : State,
    userId : CommonTypes.UserId,
    limit : Nat,
    offset : Nat,
  ) : [UserTypes.UserProfilePublic] {
    Debug.todo();
  };

  public func getSuggestedUsers(
    state : State,
    caller : CommonTypes.UserId,
    limit : Nat,
  ) : [UserTypes.UserProfilePublic] {
    Debug.todo();
  };

  public func ensureProfile(
    state : State,
    caller : CommonTypes.UserId,
    username : Text,
    email : Text,
  ) : () {
    Debug.todo();
  };

  public func banUser(
    state : State,
    userId : CommonTypes.UserId,
  ) : () {
    Debug.todo();
  };

  public func unbanUser(
    state : State,
    userId : CommonTypes.UserId,
  ) : () {
    Debug.todo();
  };

  public func getAllUsers(
    state : State,
    limit : Nat,
    offset : Nat,
  ) : [UserTypes.UserProfilePublic] {
    Debug.todo();
  };

  public func toPublic(
    profile : UserTypes.UserProfile,
  ) : UserTypes.UserProfilePublic {
    Debug.todo();
  };
};
