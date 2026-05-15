import CommonTypes "common";

module {
  public type Notification = {
    id : CommonTypes.NotificationId;
    recipientId : CommonTypes.UserId;
    actorId : CommonTypes.UserId;
    notificationType : CommonTypes.NotificationType;
    entityId : Nat;
    entityType : Text;
    var isRead : Bool;
    createdAt : CommonTypes.Timestamp;
  };

  public type NotificationPublic = {
    id : CommonTypes.NotificationId;
    recipientId : CommonTypes.UserId;
    actorId : CommonTypes.UserId;
    notificationType : CommonTypes.NotificationType;
    entityId : Nat;
    entityType : Text;
    isRead : Bool;
    createdAt : CommonTypes.Timestamp;
  };
};
