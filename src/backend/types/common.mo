import Time "mo:core/Time";

module {
  public type UserId = Principal;
  public type PostId = Nat;
  public type CommentId = Nat;
  public type MessageId = Nat;
  public type ConversationId = Nat;
  public type NotificationId = Nat;
  public type Timestamp = Time.Time;

  public type Visibility = { #public_; #followers; #private_ };
  public type MessageType = { #text; #image; #system_ };
  public type NotificationType = { #like; #comment; #follow; #mention; #message };
  public type ContentType = { #post; #comment };
};
