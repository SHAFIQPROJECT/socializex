import Debug "mo:core/Debug";
import Map "mo:core/Map";
import CommonTypes "../types/common";
import NotifTypes "../types/notifications";

module {
  public type State = {
    notifications : Map.Map<CommonTypes.NotificationId, NotifTypes.Notification>;
    nextNotificationId : { var value : Nat };
  };

  public func getNotifications(
    state : State,
    caller : CommonTypes.UserId,
    limit : Nat,
    offset : Nat,
  ) : [NotifTypes.NotificationPublic] {
    Debug.todo();
  };

  public func markNotificationRead(
    state : State,
    caller : CommonTypes.UserId,
    notificationId : CommonTypes.NotificationId,
  ) : () {
    Debug.todo();
  };

  public func createNotification(
    state : State,
    recipientId : CommonTypes.UserId,
    actorId : CommonTypes.UserId,
    notificationType : CommonTypes.NotificationType,
    entityId : Nat,
    entityType : Text,
  ) : () {
    Debug.todo();
  };

  public func markAllRead(
    state : State,
    caller : CommonTypes.UserId,
  ) : () {
    Debug.todo();
  };
};
