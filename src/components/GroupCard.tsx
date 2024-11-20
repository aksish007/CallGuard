import * as React from "react";
import { Group } from "../types/Group";

interface GroupCardProps {
  group: Group;
  onToggle: (id: string) => void;
  onPress: () => void;
}

export function GroupCard({ group, onToggle, onPress }: GroupCardProps) {
  return (
    <gridLayout
      className="bg-white rounded-lg p-4 m-2 elevation-3"
      rows="auto, auto"
      columns="*, auto"
      onTap={onPress}
    >
      <label
        row={0}
        col={0}
        className="text-xl font-bold text-gray-800"
        text={group.name}
      />
      <switch
        row={0}
        col={1}
        checked={group.isEnabled}
        onToggle={() => onToggle(group.id)}
        className="ml-2"
      />
      <stackLayout row={1} col={0} colSpan={2} className="mt-2">
        <label 
          className="text-sm text-gray-600"
          text={`${group.contacts.length} contacts`}
        />
        {group.isEnabled && (
          <label 
            className="text-xs text-green-600 mt-1"
            text="Active"
          />
        )}
      </stackLayout>
    </gridLayout>
  );
}