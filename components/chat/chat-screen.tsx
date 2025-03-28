"use client";

import Person from "./person";
import Message from "./message";
import { useRecoilValue } from "recoil";
import {
  presenceState,
  selectedUserIdState,
  selectedUserIndexState,
} from "utils/recoil/atoms";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserById, sendMessage, getAllMessages } from "actions/chat-actions";
import { useEffect, useState } from "react";
import { Spinner } from "@material-tailwind/react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function ChatScreen() {
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const selectedUserIndex = useRecoilValue(selectedUserIndexState);
  const presence = useRecoilValue(presenceState);

  const [message, setMessage] = useState("");

  const supabase = createBrowserSupabaseClient();

  const selectedUserQuery = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => getUserById(selectedUserId),
  });

  const sendMessagesMutation = useMutation({
    mutationFn: async () => {
      return sendMessage({ message, chatUserId: selectedUserId });
    },
    onSuccess: () => {
      setMessage("");
      getAllMessagesQuery.refetch();
    },
  });

  const getAllMessagesQuery = useQuery({
    queryKey: ["messages", selectedUserId],
    queryFn: () => getAllMessages({ chatUserId: selectedUserId }),
  });

  useEffect(() => {
    const channel = supabase
      .channel("message_postgres_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message" },
        (payload) => {
          if (
            payload.eventType === "INSERT" &&
            !payload.errors &&
            !!payload.new
          ) {
            getAllMessagesQuery.refetch();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return selectedUserQuery.data !== null ? (
    <div className="w-full h-screen flex flex-col">
      <Person
        index={selectedUserIndex}
        isActive={false}
        name={selectedUserQuery.data?.email?.split("@")?.[0]}
        onChatScreen={true}
        onlineAt={presence?.[selectedUserId]?.[0]?.onlineAt}
        userId={selectedUserQuery.data?.id}
      />
      <div className="w-full overflow-y-scroll flex-1 bg-white flex flex-col p-4 gap-3">
        {getAllMessagesQuery.data?.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            isFromMe={message.receiver === selectedUserId}
          />
        ))}
      </div>
      <div className="flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2.5 w-full border-2 border-light-blue-600"
          placeholder="메시지를 입력하세요."
        />
        <button
          onClick={() => sendMessagesMutation.mutate()}
          className="min-w-20 p-1 bg-light-blue-600 text-white flex justify-center items-center"
        >
          {sendMessagesMutation.isPending ? <Spinner /> : <span>전송</span>}
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full"></div>
  );
}
