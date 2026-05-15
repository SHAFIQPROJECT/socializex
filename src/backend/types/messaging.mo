import Storage "mo:caffeineai-object-storage/Storage";
import CommonTypes "common";

module {
  public type Message = {
    id : CommonTypes.MessageId;
    conversationId : CommonTypes.ConversationId;
    senderId : CommonTypes.UserId;
    var content : Text;
    var imageBlob : ?Storage.ExternalBlob;
    var readBy : [CommonTypes.UserId];
    createdAt : CommonTypes.Timestamp;
    messageType : CommonTypes.MessageType;
    var isDeleted : Bool;
  };

  public type MessagePublic = {
    id : CommonTypes.MessageId;
    conversationId : CommonTypes.ConversationId;
    senderId : CommonTypes.UserId;
    content : Text;
    imageUrl : ?Text;
    readBy : [CommonTypes.UserId];
    createdAt : CommonTypes.Timestamp;
    messageType : CommonTypes.MessageType;
  };

  public type Conversation = {
    id : CommonTypes.ConversationId;
    var participants : [CommonTypes.UserId];
    var lastMessage : ?Text;
    var lastMessageAt : CommonTypes.Timestamp;
    var isGroup : Bool;
    var groupName : ?Text;
    var groupAvatarBlob : ?Storage.ExternalBlob;
    var unreadCounts : [(CommonTypes.UserId, Nat)];
  };

  public type ConversationPublic = {
    id : CommonTypes.ConversationId;
    participants : [CommonTypes.UserId];
    lastMessage : ?Text;
    lastMessageAt : CommonTypes.Timestamp;
    isGroup : Bool;
    groupName : ?Text;
    groupAvatarUrl : ?Text;
    unreadCount : Nat;
  };

  public type CreateConversationInput = {
    participantIds : [CommonTypes.UserId];
    isGroup : Bool;
    groupName : ?Text;
  };
};
