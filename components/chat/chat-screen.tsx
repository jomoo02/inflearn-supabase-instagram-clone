"use client";

import Person from "./person";
import Message from "./message";
import { useRecoilValue } from "recoil";
import {
  selectedUserIdState,
  selectedUserIndexState,
} from "utils/recoil/atoms";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "actions/chat-actions";

export default function ChatScreen() {
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const selectedUserIndex = useRecoilValue(selectedUserIndexState);

  const selectedUserQuery = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => getUserById(selectedUserId),
  });
  return selectedUserQuery.data !== null ? (
    <div className="w-full h-screen flex flex-col">
      <Person
        index={selectedUserIndex}
        isActive={false}
        name={selectedUserQuery.data?.email?.split("@")?.[0]}
        onChatScreen={true}
        onlineAt={new Date().toISOString()}
        userId={selectedUserQuery.data?.id}
      />
      <div className="w-full flex-1 bg-white flex flex-col p-4 gap-3">
        <Message isFromMe={true} message={"teetetetet"} />
        <Message isFromMe={false} message={"teetetetet"} />
      </div>
      <div className="flex">
        <input
          className="p-2.5 w-full border-2 border-light-blue-600"
          placeholder="메시지를 입력하세요."
        />
        <button className="min-w-20 p-1 bg-light-blue-600 text-white">
          <span>전송</span>
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full"></div>
  );
}
