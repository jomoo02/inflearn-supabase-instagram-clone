"use client";

import { useEffect, useState } from "react";
import Person from "./person";
import { useRecoilState } from "recoil";
import {
  selectedUserIdState,
  selectedUserIndexState,
  presenceState,
} from "utils/recoil/atoms";
import { getAllUsers } from "actions/chat-actions";
import { useQuery } from "@tanstack/react-query";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function ChatPeopleList({ loggedInUser }) {
  const [selectedUserId, setSelectedUserId] =
    useRecoilState(selectedUserIdState);

  const [selectedUserIndex, setSelectedUserIndex] = useRecoilState(
    selectedUserIndexState
  );

  const [presence, setPresence] = useRecoilState(presenceState);

  const getAllUsersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await getAllUsers();
      console.log(allUsers);
      return allUsers.filter((user) => user.id !== loggedInUser.id);
    },
  });

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const channel = supabase.channel("online_users", {
      config: {
        presence: {
          key: loggedInUser.id,
        },
      },
    });

    channel.on(
      "presence",
      {
        event: "sync",
      },
      () => {
        const newState = channel.presenceState();
        const newStateObj = JSON.parse(JSON.stringify(newState));
        setPresence(newStateObj);
      }
    );

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }

      const newPresenceStatus = await channel.track({
        onlineAt: new Date().toISOString(),
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="h-screen w-60 flex flex-col bg-gray-50">
      {getAllUsersQuery.data?.map((user, index) => (
        <Person
          key={user.id}
          index={index}
          isActive={selectedUserId === user.id}
          name={user.email.split("@")[0]}
          onChatScreen={false}
          onlineAt={presence?.[user.id]?.[0]?.onlineAt}
          userId={user.id}
          onClick={() => {
            setSelectedUserId(user.id);
            setSelectedUserIndex(index);
          }}
        />
      ))}
    </div>
  );
}
