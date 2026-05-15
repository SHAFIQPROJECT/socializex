import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";
import MsgTypes "../types/messaging";
import MessagingLib "../lib/messaging";

mixin (
  accessControlState : AccessControl.AccessControlState,
  messagingState : MessagingLib.State,
) {
  public query ({ caller }) func getConversations(limit : Nat, offset : Nat) : async [MsgTypes.ConversationPublic] {
    Debug.todo();
  };

  public query ({ caller }) func getMessages(conversationId : CommonTypes.ConversationId, limit : Nat, offset : Nat) : async [MsgTypes.MessagePublic] {
    Debug.todo();
  };

  public shared ({ caller }) func sendMessage(conversationId : CommonTypes.ConversationId, content : Text, imageBlob : ?CommonTypes.UserId) : async MsgTypes.MessagePublic {
    Debug.todo();
  };

  public shared ({ caller }) func markMessageRead(messageId : CommonTypes.MessageId) : async () {
    Debug.todo();
  };

  public shared ({ caller }) func createConversation(input : MsgTypes.CreateConversationInput) : async MsgTypes.ConversationPublic {
    Debug.todo();
  };
};
