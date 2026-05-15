import CommonTypes "common";

module {
  public type AdminStats = {
    totalUsers : Nat;
    totalPosts : Nat;
    totalComments : Nat;
    totalMessages : Nat;
    activeUsersToday : Nat;
    bannedUsers : Nat;
    pendingReports : Nat;
  };
};
