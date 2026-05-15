import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";
import PostTypes "../types/posts";
import UserTypes "../types/users";
import PostsLib "../lib/posts";
import UsersLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  postsState : PostsLib.State,
  usersState : UsersLib.State,
) {
  public query ({ caller }) func getPost(postId : CommonTypes.PostId) : async ?PostTypes.PostPublic {
    Debug.todo();
  };

  public query ({ caller }) func getPosts(authorId : CommonTypes.UserId, limit : Nat, offset : Nat) : async [PostTypes.PostPublic] {
    Debug.todo();
  };

  public shared ({ caller }) func createPost(input : PostTypes.CreatePostInput) : async PostTypes.PostPublic {
    Debug.todo();
  };

  public shared ({ caller }) func updatePost(postId : CommonTypes.PostId, input : PostTypes.UpdatePostInput) : async PostTypes.PostPublic {
    Debug.todo();
  };

  public shared ({ caller }) func deletePost(postId : CommonTypes.PostId) : async () {
    Debug.todo();
  };

  public shared ({ caller }) func likePost(postId : CommonTypes.PostId) : async () {
    Debug.todo();
  };

  public shared ({ caller }) func unlikePost(postId : CommonTypes.PostId) : async () {
    Debug.todo();
  };

  public shared ({ caller }) func savePost(postId : CommonTypes.PostId) : async () {
    Debug.todo();
  };

  public shared ({ caller }) func unsavePost(postId : CommonTypes.PostId) : async () {
    Debug.todo();
  };

  public query ({ caller }) func getSavedPosts(limit : Nat, offset : Nat) : async [PostTypes.PostPublic] {
    Debug.todo();
  };

  public shared ({ caller }) func addComment(postId : CommonTypes.PostId, content : Text, parentCommentId : ?CommonTypes.CommentId) : async PostTypes.CommentPublic {
    Debug.todo();
  };

  public query ({ caller }) func getComments(postId : CommonTypes.PostId, limit : Nat, offset : Nat) : async [PostTypes.CommentPublic] {
    Debug.todo();
  };

  public shared ({ caller }) func deleteComment(commentId : CommonTypes.CommentId) : async () {
    Debug.todo();
  };

  public shared ({ caller }) func likeComment(commentId : CommonTypes.CommentId) : async () {
    Debug.todo();
  };

  public query ({ caller }) func getFeedPosts(limit : Nat, offset : Nat) : async [PostTypes.PostPublic] {
    Debug.todo();
  };

  public query ({ caller }) func getExplorePosts(limit : Nat, offset : Nat) : async [PostTypes.PostPublic] {
    Debug.todo();
  };

  public query ({ caller }) func getReels(limit : Nat, offset : Nat) : async [PostTypes.PostPublic] {
    Debug.todo();
  };

  public query ({ caller }) func getTrendingHashtags(limit : Nat) : async [(Text, Nat)] {
    Debug.todo();
  };

  public shared ({ caller }) func reportContent(input : PostTypes.ReportInput) : async () {
    Debug.todo();
  };
};
