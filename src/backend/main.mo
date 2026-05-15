import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor SocializeX {

  // ─── Types ───────────────────────────────────────────────────────────

  type UserProfile = {
    id : Principal;
    username : Text;
    displayName : Text;
    bio : Text;
    avatarUrl : Text;
    coverUrl : Text;
    followersCount : Nat;
    followingCount : Nat;
    postsCount : Nat;
    isAdmin : Bool;
    isBanned : Bool;
    socialLinks : [Text];
    skills : [Text];
    createdAt : Int;
  };

  type Post = {
    id : Nat;
    authorId : Principal;
    content : Text;
    imageUrls : [Text];
    videoUrl : Text;
    likesCount : Nat;
    commentsCount : Nat;
    hashtags : [Text];
    isDeleted : Bool;
    isReel : Bool;
    scheduledAt : ?Int;
    createdAt : Int;
  };

  type Comment = {
    id : Nat;
    postId : Nat;
    authorId : Principal;
    content : Text;
    likesCount : Nat;
    isDeleted : Bool;
    createdAt : Int;
  };

  type Message = {
    id : Nat;
    conversationId : Nat;
    senderId : Principal;
    content : Text;
    isRead : Bool;
    createdAt : Int;
  };

  type Conversation = {
    id : Nat;
    participants : [Principal];
    lastMessage : Text;
    lastMessageAt : Int;
    isGroup : Bool;
    groupName : Text;
    createdAt : Int;
  };

  type Notification = {
    id : Nat;
    recipientId : Principal;
    actorId : Principal;
    notifType : Text;
    entityId : Text;
    isRead : Bool;
    createdAt : Int;
  };

  type Report = {
    id : Nat;
    reporterId : Principal;
    contentType : Text;
    contentId : Text;
    reason : Text;
    createdAt : Int;
  };

  type AdminStats = {
    totalUsers : Nat;
    totalPosts : Nat;
    totalComments : Nat;
    totalReports : Nat;
    bannedUsers : Nat;
    activeConversations : Nat;
  };

  // ─── State ────────────────────────────────────────────────────────────

  let profiles : List.List<UserProfile> = List.empty();
  let posts : List.List<Post> = List.empty();
  let comments : List.List<Comment> = List.empty();
  let messages : List.List<Message> = List.empty();
  let conversations : List.List<Conversation> = List.empty();
  let notifications : List.List<Notification> = List.empty();
  let reports : List.List<Report> = List.empty();

  // Relationship sets: (followerId, followeeId)
  let follows : Set.Set<(Principal, Principal)> = Set.empty();
  // Post likes: (userId, postId)
  let postLikes : Set.Set<(Principal, Nat)> = Set.empty();
  // Comment likes: (userId, commentId)
  let commentLikes : Set.Set<(Principal, Nat)> = Set.empty();
  // Saved posts: (userId, postId)
  let savedPosts : Set.Set<(Principal, Nat)> = Set.empty();

  let state = {
    var nextPostId : Nat = 1;
    var nextCommentId : Nat = 1;
    var nextMessageId : Nat = 1;
    var nextConvId : Nat = 1;
    var nextNotifId : Nat = 1;
    var nextReportId : Nat = 1;
  };

  // ─── Compare helpers ──────────────────────────────────────────────────

  func comparePrincipalPairNat(a : (Principal, Nat), b : (Principal, Nat)) : { #less; #equal; #greater } {
    let pc = Principal.compare(a.0, b.0);
    switch pc {
      case (#equal) Nat.compare(a.1, b.1);
      case other other;
    };
  };

  func comparePrincipalPair(a : (Principal, Principal), b : (Principal, Principal)) : { #less; #equal; #greater } {
    let pc = Principal.compare(a.0, b.0);
    switch pc {
      case (#equal) Principal.compare(a.1, b.1);
      case other other;
    };
  };

  // ─── Profile helpers ──────────────────────────────────────────────────

  func findProfile(uid : Principal) : ?UserProfile {
    profiles.find(func(p) { Principal.equal(p.id, uid) });
  };

  func requireProfile(uid : Principal) : UserProfile {
    switch (findProfile(uid)) {
      case (?p) p;
      case null Runtime.trap("User not found");
    };
  };

  func upsertProfile(p : UserProfile) {
    switch (profiles.findIndex(func(x) { Principal.equal(x.id, p.id) })) {
      case (?i) profiles.put(i, p);
      case null profiles.add(p);
    };
  };

  // ─── Notification helper ──────────────────────────────────────────────

  func addNotification(recipient : Principal, actor_ : Principal, notifType : Text, entityId : Text) {
    if (Principal.equal(recipient, actor_)) return;
    let notif : Notification = {
      id = state.nextNotifId;
      recipientId = recipient;
      actorId = actor_;
      notifType;
      entityId;
      isRead = false;
      createdAt = Time.now();
    };
    state.nextNotifId += 1;
    notifications.add(notif);
  };



  // ─── Auth ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func registerUser(username : Text, displayName : Text) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    switch (findProfile(caller)) {
      case (?_) return false;
      case null {};
    };
    // Check username uniqueness
    let taken = profiles.find(func(p) { Text.equal(p.username, username) });
    if (taken != null) Runtime.trap("Username already taken");
    let profile : UserProfile = {
      id = caller;
      username;
      displayName;
      bio = "";
      avatarUrl = "";
      coverUrl = "";
      followersCount = 0;
      followingCount = 0;
      postsCount = 0;
      isAdmin = false;
      isBanned = false;
      socialLinks = [];
      skills = [];
      createdAt = Time.now();
    };
    profiles.add(profile);
    true;
  };

  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    findProfile(caller);
  };

  public query func getProfile(uid : Principal) : async ?UserProfile {
    findProfile(uid);
  };

  public shared ({ caller }) func updateProfile(
    displayName : Text,
    bio : Text,
    avatarUrl : Text,
    coverUrl : Text,
    socialLinks : [Text],
    skills : [Text],
  ) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let p = requireProfile(caller);
    upsertProfile({
      p with
      displayName;
      bio;
      avatarUrl;
      coverUrl;
      socialLinks;
      skills;
    });
    true;
  };

  public query func searchUsers(query_ : Text) : async [UserProfile] {
    let lower = query_.toLower();
    profiles.filter(func(p) {
      not p.isBanned and
      (p.username.toLower().contains(#text lower) or p.displayName.toLower().contains(#text lower));
    }).toArray();
  };

  public query ({ caller }) func getSuggestedUsers() : async [UserProfile] {
    profiles.filter(func(p) {
      not Principal.equal(p.id, caller) and
      not p.isBanned and
      not follows.contains(comparePrincipalPair, (caller, p.id));
    }).toArray().sliceToArray(0, 10);
  };

  // ─── Follow ────────────────────────────────────────────────────────────

  public query func getFollowers(uid : Principal) : async [UserProfile] {
    let followerIds = follows.filter(comparePrincipalPair, func(pair : (Principal, Principal)) : Bool = Principal.equal(pair.1, uid)).toArray();
    followerIds.filterMap(func((fid, _) : (Principal, Principal)) : ?UserProfile {
      findProfile(fid);
    });
  };

  public query func getFollowing(uid : Principal) : async [UserProfile] {
    let followingIds = follows.filter(comparePrincipalPair, func(pair : (Principal, Principal)) : Bool = Principal.equal(pair.0, uid)).toArray();
    followingIds.filterMap(func((_, fid) : (Principal, Principal)) : ?UserProfile {
      findProfile(fid);
    });
  };

  public shared ({ caller }) func followUser(target : Principal) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    if (Principal.equal(caller, target)) Runtime.trap("Cannot follow yourself");
    let pair = (caller, target);
    if (follows.contains(comparePrincipalPair, pair)) return false;
    follows.add(comparePrincipalPair, pair);
    // Update counts
    let cp = requireProfile(caller);
    upsertProfile({ cp with followingCount = cp.followingCount + 1 });
    let tp = requireProfile(target);
    upsertProfile({ tp with followersCount = tp.followersCount + 1 });
    addNotification(target, caller, "follow", caller.toText());
    true;
  };

  public shared ({ caller }) func unfollowUser(target : Principal) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let pair = (caller, target);
    if (not follows.contains(comparePrincipalPair, pair)) return false;
    follows.remove(comparePrincipalPair, pair);
    let cp = requireProfile(caller);
    if (cp.followingCount > 0)
      upsertProfile({ cp with followingCount = cp.followingCount - 1 });
    let tp = requireProfile(target);
    if (tp.followersCount > 0)
      upsertProfile({ tp with followersCount = tp.followersCount - 1 });
    true;
  };

  public query ({ caller }) func isFollowingUser(target : Principal) : async Bool {
    follows.contains(comparePrincipalPair, (caller, target));
  };

  // ─── Posts ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func createPost(
    content : Text,
    imageUrls : [Text],
    videoUrl : Text,
    hashtags : [Text],
    isReel : Bool,
    scheduledAt : ?Int,
  ) : async Nat {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let p = requireProfile(caller);
    if (p.isBanned) Runtime.trap("Account is banned");
    let id = state.nextPostId;
    state.nextPostId += 1;
    let post : Post = {
      id;
      authorId = caller;
      content;
      imageUrls;
      videoUrl;
      likesCount = 0;
      commentsCount = 0;
      hashtags;
      isDeleted = false;
      isReel;
      scheduledAt;
      createdAt = Time.now();
    };
    posts.add(post);
    upsertProfile({ p with postsCount = p.postsCount + 1 });
    id;
  };

  public query func getPost(postId : Nat) : async ?Post {
    posts.find(func(p) { p.id == postId and not p.isDeleted });
  };

  public query ({ caller }) func getFeedPosts(limit : Nat, offset : Nat) : async [Post] {
    let now_ = Time.now();
    let visible = posts.filter(func(p) {
      not p.isDeleted and
      (p.scheduledAt == null or (switch (p.scheduledAt) { case (?t) t <= now_; case null true })) and
      (Principal.equal(p.authorId, caller) or follows.contains(comparePrincipalPair, (caller, p.authorId)));
    });
    // Sort by newest: convert to array and sort descending
    let arr = visible.toArray();
    let sorted = arr.sort(func(a : Post, b : Post) : Order.Order = Int.compare(b.createdAt, a.createdAt));
    sorted.sliceToArray(offset, offset + limit);
  };

  public query func getExplorePosts(limit : Nat, offset : Nat) : async [Post] {
    let now_ = Time.now();
    let visible = posts.filter(func(p) {
      not p.isDeleted and not p.isReel and
      (p.scheduledAt == null or (switch (p.scheduledAt) { case (?t) t <= now_; case null true }));
    });
    let arr = visible.toArray();
    let sorted = arr.sort(func(a : Post, b : Post) : Order.Order = Int.compare(b.createdAt, a.createdAt));
    sorted.sliceToArray(offset, offset + limit);
  };

  public query func getUserPosts(uid : Principal, limit : Nat, offset : Nat) : async [Post] {
    let now_ = Time.now();
    let userPosts = posts.filter(func(p) {
      Principal.equal(p.authorId, uid) and not p.isDeleted and not p.isReel and
      (p.scheduledAt == null or (switch (p.scheduledAt) { case (?t) t <= now_; case null true }));
    });
    let arr = userPosts.toArray();
    let sorted = arr.sort(func(a : Post, b : Post) : Order.Order = Int.compare(b.createdAt, a.createdAt));
    sorted.sliceToArray(offset, offset + limit);
  };

  public query func getReels(limit : Nat, offset : Nat) : async [Post] {
    let reels = posts.filter(func(p) { p.isReel and not p.isDeleted });
    let arr = reels.toArray();
    let sorted = arr.sort(func(a : Post, b : Post) : Order.Order = Int.compare(b.createdAt, a.createdAt));
    sorted.sliceToArray(offset, offset + limit);
  };

  public shared ({ caller }) func likePost(postId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let pair = (caller, postId);
    if (postLikes.contains(comparePrincipalPairNat, pair)) return false;
    postLikes.add(comparePrincipalPairNat, pair);
    switch (posts.findIndex(func(p) { p.id == postId and not p.isDeleted })) {
      case (?i) {
        let p = posts.at(i);
        posts.put(i, { p with likesCount = p.likesCount + 1 });
        addNotification(p.authorId, caller, "like", postId.toText());
      };
      case null {};
    };
    true;
  };

  public shared ({ caller }) func unlikePost(postId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let pair = (caller, postId);
    if (not postLikes.contains(comparePrincipalPairNat, pair)) return false;
    postLikes.remove(comparePrincipalPairNat, pair);
    switch (posts.findIndex(func(p) { p.id == postId })) {
      case (?i) {
        let p = posts.at(i);
        if (p.likesCount > 0)
          posts.put(i, { p with likesCount = p.likesCount - 1 });
      };
      case null {};
    };
    true;
  };

  public query ({ caller }) func isPostLiked(postId : Nat) : async Bool {
    postLikes.contains(comparePrincipalPairNat, (caller, postId));
  };

  public shared ({ caller }) func savePost(postId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let pair = (caller, postId);
    if (savedPosts.contains(comparePrincipalPairNat, pair)) return false;
    savedPosts.add(comparePrincipalPairNat, pair);
    true;
  };

  public shared ({ caller }) func unsavePost(postId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let pair = (caller, postId);
    if (not savedPosts.contains(comparePrincipalPairNat, pair)) return false;
    savedPosts.remove(comparePrincipalPairNat, pair);
    true;
  };

  public query ({ caller }) func getSavedPosts() : async [Post] {
    let saved = savedPosts.filter(comparePrincipalPairNat, func((uid, _ ) : (Principal, Nat)) : Bool = Principal.equal(uid, caller)).toArray();
    saved.filterMap(func((_, pid) : (Principal, Nat)) : ?Post {
      posts.find(func(p) { p.id == pid and not p.isDeleted });
    });
  };

  public shared ({ caller }) func deletePost(postId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    switch (posts.findIndex(func(p) { p.id == postId })) {
      case (?i) {
        let p = posts.at(i);
        if (not Principal.equal(p.authorId, caller)) {
          let prof = requireProfile(caller);
          if (not prof.isAdmin) Runtime.trap("Not authorized");
        };
        posts.put(i, { p with isDeleted = true });
        let author = findProfile(p.authorId);
        switch author {
          case (?ap) {
            if (ap.postsCount > 0)
              upsertProfile({ ap with postsCount = ap.postsCount - 1 });
          };
          case null {};
        };
        true;
      };
      case null false;
    };
  };

  public query func getTrendingHashtags() : async [(Text, Nat)] {
    let hashtagCounts : Map.Map<Text, Nat> = Map.empty();
    posts.forEach(func(p) {
      if (not p.isDeleted) {
        p.hashtags.forEach(func(tag) {
          let current = switch (hashtagCounts.get(tag)) {
            case (?n) n;
            case null 0;
          };
          hashtagCounts.add(tag, current + 1);
        });
      };
    });
    let arr = hashtagCounts.entries().toArray();
    let sorted = arr.sort(func(a : (Text, Nat), b : (Text, Nat)) : Order.Order = Nat.compare(b.1, a.1));
    sorted.sliceToArray(0, 20);
  };

  // ─── Comments ──────────────────────────────────────────────────────────

  public shared ({ caller }) func addComment(postId : Nat, content : Text) : async Nat {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let p = requireProfile(caller);
    if (p.isBanned) Runtime.trap("Account is banned");
    let id = state.nextCommentId;
    state.nextCommentId += 1;
    let comment : Comment = {
      id;
      postId;
      authorId = caller;
      content;
      likesCount = 0;
      isDeleted = false;
      createdAt = Time.now();
    };
    comments.add(comment);
    // Increment post comment count
    switch (posts.findIndex(func(post) { post.id == postId })) {
      case (?i) {
        let post = posts.at(i);
        posts.put(i, { post with commentsCount = post.commentsCount + 1 });
        addNotification(post.authorId, caller, "comment", postId.toText());
      };
      case null {};
    };
    id;
  };

  public query func getComments(postId : Nat) : async [Comment] {
    let postComments = comments.filter(func(c) { c.postId == postId and not c.isDeleted });
    let arr = postComments.toArray();
    arr.sort(func(a : Comment, b : Comment) : Order.Order = Int.compare(a.createdAt, b.createdAt));
  };

  public shared ({ caller }) func deleteComment(commentId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    switch (comments.findIndex(func(c) { c.id == commentId })) {
      case (?i) {
        let c = comments.at(i);
        if (not Principal.equal(c.authorId, caller)) {
          let prof = requireProfile(caller);
          if (not prof.isAdmin) Runtime.trap("Not authorized");
        };
        comments.put(i, { c with isDeleted = true });
        true;
      };
      case null false;
    };
  };

  public shared ({ caller }) func likeComment(commentId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let pair = (caller, commentId);
    if (commentLikes.contains(comparePrincipalPairNat, pair)) return false;
    commentLikes.add(comparePrincipalPairNat, pair);
    switch (comments.findIndex(func(c) { c.id == commentId })) {
      case (?i) {
        let c = comments.at(i);
        comments.put(i, { c with likesCount = c.likesCount + 1 });
      };
      case null {};
    };
    true;
  };

  // ─── Conversations & Messages ──────────────────────────────────────────

  public shared ({ caller }) func createConversation(
    participants : [Principal],
    isGroup : Bool,
    groupName : Text,
  ) : async Nat {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    // Ensure caller is in participants
    let allParticipants = if (participants.find(func(p) { Principal.equal(p, caller) }) == null) {
      participants.concat([caller]);
    } else participants;
    let id = state.nextConvId;
    state.nextConvId += 1;
    let conv : Conversation = {
      id;
      participants = allParticipants;
      lastMessage = "";
      lastMessageAt = Time.now();
      isGroup;
      groupName;
      createdAt = Time.now();
    };
    conversations.add(conv);
    id;
  };

  public query ({ caller }) func getConversations() : async [Conversation] {
    let myConvs = conversations.filter(func(c) {
      c.participants.find(func(p) { Principal.equal(p, caller) }) != null;
    });
    let arr = myConvs.toArray();
    arr.sort(func(a : Conversation, b : Conversation) : Order.Order = Int.compare(b.lastMessageAt, a.lastMessageAt));
  };

  public query ({ caller }) func getMessages(convId : Nat, limit : Nat, offset : Nat) : async [Message] {
    let conv = conversations.find(func(c) { c.id == convId });
    switch conv {
      case (?c) {
        if (c.participants.find(func(p) { Principal.equal(p, caller) }) == null)
          Runtime.trap("Not a participant");
      };
      case null Runtime.trap("Conversation not found");
    };
    let convMsgs = messages.filter(func(m) { m.conversationId == convId });
    let arr = convMsgs.toArray();
    let sorted = arr.sort(func(a : Message, b : Message) : Order.Order = Int.compare(a.createdAt, b.createdAt));
    sorted.sliceToArray(offset, offset + limit);
  };

  public shared ({ caller }) func sendMessage(convId : Nat, content : Text) : async Nat {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let convIdx = conversations.findIndex(func(c) { c.id == convId });
    switch convIdx {
      case (?i) {
        let c = conversations.at(i);
        if (c.participants.find(func(p) { Principal.equal(p, caller) }) == null)
          Runtime.trap("Not a participant");
        let id = state.nextMessageId;
        state.nextMessageId += 1;
        let msg : Message = {
          id;
          conversationId = convId;
          senderId = caller;
          content;
          isRead = false;
          createdAt = Time.now();
        };
        messages.add(msg);
        conversations.put(i, {
          c with
          lastMessage = content;
          lastMessageAt = Time.now();
        });
        // Notify other participants
        c.participants.forEach(func(p) {
          if (not Principal.equal(p, caller))
            addNotification(p, caller, "message", convId.toText());
        });
        id;
      };
      case null Runtime.trap("Conversation not found");
    };
  };

  public shared ({ caller }) func markMessageRead(msgId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    switch (messages.findIndex(func(m) { m.id == msgId })) {
      case (?i) {
        let m = messages.at(i);
        messages.put(i, { m with isRead = true });
        true;
      };
      case null false;
    };
  };

  // ─── Notifications ─────────────────────────────────────────────────────

  public query ({ caller }) func getNotifications() : async [Notification] {
    let myNotifs = notifications.filter(func(n) {
      Principal.equal(n.recipientId, caller);
    });
    let arr = myNotifs.toArray();
    arr.sort(func(a : Notification, b : Notification) : Order.Order = Int.compare(b.createdAt, a.createdAt));
  };

  public shared ({ caller }) func markNotificationRead(notifId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    switch (notifications.findIndex(func(n) { n.id == notifId and Principal.equal(n.recipientId, caller) })) {
      case (?i) {
        let n = notifications.at(i);
        notifications.put(i, { n with isRead = true });
        true;
      };
      case null false;
    };
  };

  public shared ({ caller }) func markAllNotificationsRead() : async () {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    notifications.mapInPlace(func(n : Notification) : Notification {
      if (Principal.equal(n.recipientId, caller) and not n.isRead) {
        { n with isRead = true };
      } else {
        n;
      };
    });
  };

  public query ({ caller }) func getUnreadNotificationCount() : async Nat {
    notifications.foldLeft(0, func(acc : Nat, n : Notification) : Nat {
      if (Principal.equal(n.recipientId, caller) and not n.isRead)
        acc + 1
      else acc;
    });
  };

  // ─── Reports ────────────────────────────────────────────────────────────

  public shared ({ caller }) func reportContent(
    contentType : Text,
    contentId : Text,
    reason : Text,
  ) : async Nat {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let id = state.nextReportId;
    state.nextReportId += 1;
    let report : Report = {
      id;
      reporterId = caller;
      contentType;
      contentId;
      reason;
      createdAt = Time.now();
    };
    reports.add(report);
    id;
  };

  // ─── Admin ──────────────────────────────────────────────────────────────

  func requireAdmin(caller : Principal) {
    let p = requireProfile(caller);
    if (not p.isAdmin) Runtime.trap("Admin access required");
  };

  public query ({ caller }) func getAdminStats() : async AdminStats {
    requireAdmin(caller);
    let totalUsers = profiles.size();
    let totalPosts = posts.filter(func(p) { not p.isDeleted }).size();
    let totalComments = comments.filter(func(c) { not c.isDeleted }).size();
    let totalReports = reports.size();
    let bannedUsers = profiles.filter(func(p) { p.isBanned }).size();
    let activeConversations = conversations.size();
    { totalUsers; totalPosts; totalComments; totalReports; bannedUsers; activeConversations };
  };

  public query ({ caller }) func getAdminUsers(limit : Nat, offset : Nat) : async [UserProfile] {
    requireAdmin(caller);
    let arr = profiles.toArray();
    arr.sliceToArray(offset, offset + limit);
  };

  public shared ({ caller }) func banUser(target : Principal) : async Bool {
    requireAdmin(caller);
    switch (profiles.findIndex(func(p) { Principal.equal(p.id, target) })) {
      case (?i) {
        let p = profiles.at(i);
        profiles.put(i, { p with isBanned = true });
        true;
      };
      case null false;
    };
  };

  public shared ({ caller }) func unbanUser(target : Principal) : async Bool {
    requireAdmin(caller);
    switch (profiles.findIndex(func(p) { Principal.equal(p.id, target) })) {
      case (?i) {
        let p = profiles.at(i);
        profiles.put(i, { p with isBanned = false });
        true;
      };
      case null false;
    };
  };

  public query ({ caller }) func getAdminPosts(limit : Nat, offset : Nat) : async [Post] {
    requireAdmin(caller);
    let arr = posts.toArray();
    let sorted = arr.sort(func(a : Post, b : Post) : Order.Order = Int.compare(b.createdAt, a.createdAt));
    sorted.sliceToArray(offset, offset + limit);
  };

  public shared ({ caller }) func adminDeletePost(postId : Nat) : async Bool {
    requireAdmin(caller);
    switch (posts.findIndex(func(p) { p.id == postId })) {
      case (?i) {
        let p = posts.at(i);
        posts.put(i, { p with isDeleted = true });
        true;
      };
      case null false;
    };
  };

  // ─── AI Features (stubs) ──────────────────────────────────────────────

  public shared query({ caller = _ }) func isMyOpenAIConfigured() : async Bool { false };

  public shared({ caller = _ }) func setMyOpenAIApiKey(_key : Text) : async { #ok : Text; #err : Text } { #ok("Not available") };

  public shared({ caller = _ }) func clearMyOpenAIApiKey() : async { #ok : Text; #err : Text } { #ok("Not available") };

  public shared({ caller = _ }) func generateCaption(_desc : Text) : async { #ok : Text; #err : Text } { #ok("Amazing photo! Check this out ✨ #trending #photography #lifestyle") };

  public shared({ caller = _ }) func suggestHashtags(_content : Text) : async { #ok : [Text]; #err : Text } { #ok(["trending", "photography", "lifestyle", "vibes", "instagood", "social", "community", "connect"]) };

  public shared({ caller = _ }) func chatWithAI(_message : Text, _history : [{ role : Text; content : Text }]) : async { #ok : Text; #err : Text } { #ok("Hello! I'm SocializeX AI Assistant. How can I help you today?") };

};
