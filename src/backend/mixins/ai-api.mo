import Debug "mo:core/Debug";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import OpenAI "../lib/openai";

mixin (
  accessControlState : AccessControl.AccessControlState,
  openAIKeys : Map.Map<Principal, Text>,
) {
  public query ({ caller }) func isMyOpenAIConfigured() : async Bool {
    Debug.todo();
  };

  public shared ({ caller }) func setMyOpenAIApiKey(key : Text) : async () {
    Debug.todo();
  };

  public shared ({ caller }) func clearMyOpenAIApiKey() : async () {
    Debug.todo();
  };

  public shared ({ caller }) func generateCaption(imageDescription : Text) : async Text {
    Debug.todo();
  };

  public shared ({ caller }) func suggestHashtags(content : Text) : async [Text] {
    Debug.todo();
  };

  public shared ({ caller }) func chatWithAI(prompt : Text) : async Text {
    Debug.todo();
  };

  public shared ({ caller }) func moderateContent(content : Text) : async Bool {
    Debug.todo();
  };
};
