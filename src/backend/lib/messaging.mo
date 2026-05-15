import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import CommonTypes "../types/common";
import MsgTypes "../types/messaging";

module {
  public type State = {
    conversations : Map.Map<CommonTypes.ConversationId, MsgTypes.Conversation>;
    messages : List.List<MsgTypes.Message>;
    nextConversationId : { var value : Nat };
    nextMessageId : { var value : Nat };
  };

  public func getConversations(
    state : State,
    caller : CommonTypes.UserId,
    limit : Nat,
    offset : Nat,
  ) : [MsgTypes.ConversationPublic] {
    Debug.todo();
  };

  public func getMessages(
    state : State,
    caller : CommonTypes.UserId,
    conversationId : CommonTypes.ConversationId,
    limit : Nat,
    offset : Nat,
  ) : [MsgTypes.MessagePublic] {
    Debug.todo();
  };

  public func sendMessage(
    state : State,
    caller : CommonTypes.UserId,
    conversationId : CommonTypes.ConversationId,
    content : Text,
    imageBlob : ?CommonTypes.UserId,
  ) : MsgTypes.MessagePublic {
    Debug.todo();
  };

  public func markMessageRead(
    state : State,
    caller : CommonTypes.UserId,
    messageId : CommonTypes.MessageId,
  ) : () {
    Debug.todo();
  };

  public func createConversation(
    state : State,
    caller : CommonTypes.UserId,
    input : MsgTypes.CreateConversationInput,
  ) : MsgTypes.ConversationPublic {
    Debug.todo();
  };
};
