"use client";

import { useState } from "react";
import Person from "./person";
import { useRecoilState } from "recoil";
import { selectedIndexState } from "utils/recoil/atoms";

export default function ChatPeopleList() {
  const [selectedIndex, setSelectedIndex] = useRecoilState(selectedIndexState);

  return (
    <div className="h-screen w-60 flex flex-col bg-gray-50">
      <Person
        index={0}
        isActive={selectedIndex === 0}
        name={"text"}
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId={"qwaa"}
        onClick={() => setSelectedIndex(0)}
      />
      <Person
        index={1}
        isActive={selectedIndex === 1}
        name={"text2"}
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId={"qwaaw"}
        onClick={() => setSelectedIndex(1)}
      />
    </div>
  );
}
