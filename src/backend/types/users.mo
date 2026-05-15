import Storage "mo:caffeineai-object-storage/Storage";
import CommonTypes "common";

module {
  public type SocialLinks = {
    website : ?Text;
    twitter : ?Text;
    instagram : ?Text;
    linkedin : ?Text;
    github : ?Text;
  };

  public type UserProfile = {
    id : CommonTypes.UserId;
    var username : Text;
    var displayName : Text;
    var bio : Text;
    var avatarBlob : ?Storage.ExternalBlob;
    var coverBlob : ?Storage.ExternalBlob;
    email : Text;
    createdAt : CommonTypes.Timestamp;
    var followersCount : Nat;
    var followingCount : Nat;
    var postsCount : Nat;
    var isAdmin : Bool;
    var skills : [Text];
    var socialLinks : SocialLinks;
    var isVerified : Bool;
    var isBanned : Bool;
  };

  public type UserProfilePublic = {
    id : CommonTypes.UserId;
    username : Text;
    displayName : Text;
    bio : Text;
    avatarUrl : ?Text;
    coverUrl : ?Text;
    email : Text;
    createdAt : CommonTypes.Timestamp;
    followersCount : Nat;
    followingCount : Nat;
    postsCount : Nat;
    isAdmin : Bool;
    skills : [Text];
    socialLinks : SocialLinks;
    isVerified : Bool;
    isBanned : Bool;
  };

  public type UpdateProfileInput = {
    username : ?Text;
    displayName : ?Text;
    bio : ?Text;
    avatarBlob : ?Storage.ExternalBlob;
    coverBlob : ?Storage.ExternalBlob;
    skills : ?[Text];
    socialLinks : ?SocialLinks;
  };

  public type FollowRelation = {
    followerId : CommonTypes.UserId;
    followingId : CommonTypes.UserId;
    createdAt : CommonTypes.Timestamp;
  };
};
