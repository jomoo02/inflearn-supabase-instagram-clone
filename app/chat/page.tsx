import ChatPeopleList from "components/chat/chat-pepole-list";
import ChatScreen from "components/chat/chat-screen";
import Person from "components/chat/person";

export default function ChatPage() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <ChatPeopleList />
      <ChatScreen />
    </div>
  );
}
