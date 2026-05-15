import Storage "mo:caffeineai-object-storage/Storage";
import CommonTypes "common";

module {
  public type Post = {
    id : CommonTypes.PostId;
    authorId : CommonTypes.UserId;
    var content : Text;
    var imageBlobs : [Storage.ExternalBlob];
    var videoBlob : ?Storage.ExternalBlob;
    var likesCount : Nat;
    var commentsCount : Nat;
    var sharesCount : Nat;
    var savedCount : Nat;
    var hashtags : [Text];
    createdAt : CommonTypes.Timestamp;
    var updatedAt : CommonTypes.Timestamp;
    var isEdited : Bool;
    var scheduledAt : ?CommonTypes.Timestamp;
    var visibility : CommonTypes.Visibility;
    var isDeleted : Bool;
  };

  public type PostPublic = {
    id : CommonTypes.PostId;
    authorId : CommonTypes.UserId;
    content : Text;
    imageUrls : [Text];
    videoUrl : ?Text;
    likesCount : Nat;
    commentsCount : Nat;
    sharesCount : Nat;
    savedCount : Nat;
    hashtags : [Text];
    createdAt : CommonTypes.Timestamp;
    updatedAt : CommonTypes.Timestamp;
    isEdited : Bool;
    scheduledAt : ?CommonTypes.Timestamp;
    visibility : CommonTypes.Visibility;
    isLikedByMe : Bool;
    isSavedByMe : Bool;
  };

  public type CreatePostInput = {
    content : Text;
    imageBlobs : [Storage.ExternalBlob];
    videoBlob : ?Storage.ExternalBlob;
    hashtags : [Text];
    scheduledAt : ?CommonTypes.Timestamp;
    visibility : CommonTypes.Visibility;
  };

  public type UpdatePostInput = {
    content : ?Text;
    hashtags : ?[Text];
    visibility : ?CommonTypes.Visibility;
  };

  public type SavedPost = {
    userId : CommonTypes.UserId;
    postId : CommonTypes.PostId;
    savedAt : CommonTypes.Timestamp;
  };

  public type Comment = {
    id : CommonTypes.CommentId;
    postId : CommonTypes.PostId;
    authorId : CommonTypes.UserId;
    var content : Text;
    var likesCount : Nat;
    createdAt : CommonTypes.Timestamp;
    parentCommentId : ?CommonTypes.CommentId;
    var isDeleted : Bool;
  };

  public type CommentPublic = {
    id : CommonTypes.CommentId;
    postId : CommonTypes.PostId;
    authorId : CommonTypes.UserId;
    content : Text;
    likesCount : Nat;
    createdAt : CommonTypes.Timestamp;
    parentCommentId : ?CommonTypes.CommentId;
    isLikedByMe : Bool;
  };

  public type ReportInput = {
    reason : Text;
    entityId : Nat;
    entityType : CommonTypes.ContentType;
  };

  public type Report = {
    id : Nat;
    reporterId : CommonTypes.UserId;
    reason : Text;
    entityId : Nat;
    entityType : CommonTypes.ContentType;
    createdAt : CommonTypes.Timestamp;
    var isResolved : Bool;
  };
};
