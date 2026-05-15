import Debug "mo:core/Debug";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";
import NotifTypes "../types/notifications";
import NotificationsLib "../lib/notifications";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notificationsState : NotificationsLib.State,
) {
  public query ({ caller }) func getNotifications(limit : Nat, offset : Nat) : async [NotifTypes.NotificationPublic] {
    Debug.todo();
  };

  public shared ({ caller }) func markNotificationRead(notificationId : CommonTypes.NotificationId) : async () {
    Debug.todo();
  };

  public shared ({ caller }) func markAllNotificationsRead() : async () {
    Debug.todo();
  };
};
