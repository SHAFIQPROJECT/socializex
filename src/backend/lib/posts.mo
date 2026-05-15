import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import CommonTypes "../types/common";
import PostTypes "../types/posts";

module {
  public type State = {
    posts : Map.Map<CommonTypes.PostId, PostTypes.Post>;
    likes : Set.Set<(CommonTypes.UserId, CommonTypes.PostId)>;
    savedPosts : List.List<PostTypes.SavedPost>;
    comments : Map.Map<CommonTypes.CommentId, PostTypes.Comment>;
    commentLikes : Set.Set<(CommonTypes.UserId, CommonTypes.CommentId)>;
    reports : List.List<PostTypes.Report>;
    nextPostId : { var value : Nat };
    nextCommentId : { var value : Nat };
    nextReportId : { var value : Nat };
  };

  public func getPost(
    state : State,
    caller : CommonTypes.UserId,
    postId : CommonTypes.PostId,
  ) : ?PostTypes.PostPublic {
    Debug.todo();
  };

  public func getPosts(
    state : State,
    caller : CommonTypes.UserId,
    authorId : CommonTypes.UserId,
    limit : Nat,
    offset : Nat,
  ) : [PostTypes.PostPublic] {
    Debug.todo();
  };

  public func createPost(
    state : State,
    caller : CommonTypes.UserId,
    input : PostTypes.CreatePostInput,
  ) : PostTypes.PostPublic {
    Debug.todo();
  };

  public func updatePost(
    state : State,
    caller : CommonTypes.UserId,
    postId : CommonTypes.PostId,
    input : PostTypes.UpdatePostInput,
  ) : PostTypes.PostPublic {
    Debug.todo();
  };

  public func deletePost(
    state : State,
    caller : CommonTypes.UserId,
    postId : CommonTypes.PostId,
  ) : () {
    Debug.todo();
  };

  public func likePost(
    state : State,
    caller : CommonTypes.UserId,
    postId : CommonTypes.PostId,
  ) : () {
    Debug.todo();
  };

  public func unlikePost(
    state : State,
    caller : CommonTypes.UserId,
    postId : CommonTypes.PostId,
  ) : () {
    Debug.todo();
  };

  public func savePost(
    state : State,
    caller : CommonTypes.UserId,
    postId : CommonTypes.PostId,
  ) : () {
    Debug.todo();
  };

  public func unsavePost(
    state : State,
    caller : CommonTypes.UserId,
    postId : CommonTypes.PostId,
  ) : () {
    Debug.todo();
  };

  public func getSavedPosts(
    state : State,
    caller : CommonTypes.UserId,
    limit : Nat,
    offset : Nat,
  ) : [PostTypes.PostPublic] {
    Debug.todo();
  };

  public func addComment(
    state : State,
    caller : CommonTypes.UserId,
    postId : CommonTypes.PostId,
    content : Text,
    parentCommentId : ?CommonTypes.CommentId,
  ) : PostTypes.CommentPublic {
    Debug.todo();
  };

  public func getComments(
    state : State,
    caller : CommonTypes.UserId,
    postId : CommonTypes.PostId,
    limit : Nat,
    offset : Nat,
  ) : [PostTypes.CommentPublic] {
    Debug.todo();
  };

  public func deleteComment(
    state : State,
    caller : CommonTypes.UserId,
    commentId : CommonTypes.CommentId,
  ) : () {
    Debug.todo();
  };

  public func likeComment(
    state : State,
    caller : CommonTypes.UserId,
    commentId : CommonTypes.CommentId,
  ) : () {
    Debug.todo();
  };

  public func getFeedPosts(
    state : State,
    caller : CommonTypes.UserId,
    followingIds : [CommonTypes.UserId],
    limit : Nat,
    offset : Nat,
  ) : [PostTypes.PostPublic] {
    Debug.todo();
  };

  public func getExplorePosts(
    state : State,
    caller : CommonTypes.UserId,
    limit : Nat,
    offset : Nat,
  ) : [PostTypes.PostPublic] {
    Debug.todo();
  };

  public func getReels(
    state : State,
    caller : CommonTypes.UserId,
    limit : Nat,
    offset : Nat,
  ) : [PostTypes.PostPublic] {
    Debug.todo();
  };

  public func getTrendingHashtags(
    state : State,
    limit : Nat,
  ) : [(Text, Nat)] {
    Debug.todo();
  };

  public func reportContent(
    state : State,
    caller : CommonTypes.UserId,
    input : PostTypes.ReportInput,
  ) : () {
    Debug.todo();
  };

  public func getReports(
    state : State,
    limit : Nat,
    offset : Nat,
  ) : [PostTypes.Report] {
    Debug.todo();
  };

  public func adminDeletePost(
    state : State,
    postId : CommonTypes.PostId,
  ) : () {
    Debug.todo();
  };

  public func toPublic(
    post : PostTypes.Post,
    caller : CommonTypes.UserId,
    likes : Set.Set<(CommonTypes.UserId, CommonTypes.PostId)>,
    savedPosts : List.List<PostTypes.SavedPost>,
  ) : PostTypes.PostPublic {
    Debug.todo();
  };
};
