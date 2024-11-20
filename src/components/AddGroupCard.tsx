import * as React from "react";
import { StyleSheet } from "react-nativescript";

interface AddGroupCardProps {
  onPress: () => void;
}

export function AddGroupCard({ onPress }: AddGroupCardProps) {
  return (
    <gridLayout
      className="bg-blue-500 rounded-lg p-4 m-2 shadow-md"
      rows="auto"
      columns="auto, *"
      onTap={onPress}
    >
      <label
        row={0}
        col={0}
        className="text-3xl font-bold text-white"
        text="+"
      />
      <label
        row={0}
        col={1}
        className="text-xl font-bold text-white ml-2"
        text="Add New Group"
      />
    </gridLayout>
  );
}