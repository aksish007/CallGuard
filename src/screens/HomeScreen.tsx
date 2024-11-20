import * as React from "react";
import { RouteProp } from "@react-navigation/core";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { GroupStore } from "../stores/GroupStore";
import { GroupCard } from "../components/GroupCard";
import { AddGroupCard } from "../components/AddGroupCard";

type HomeScreenProps = {
  route: RouteProp<any, "Home">;
  navigation: FrameNavigationProp<any, "Home">;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const groupStore = GroupStore.getInstance();
  const [groups, setGroups] = React.useState(groupStore.groups);

  React.useEffect(() => {
    const store = GroupStore.getInstance();
    store.on('propertyChange', () => {
      setGroups([...store.groups]);
    });
  }, []);

  const handleToggleGroup = (groupId: string) => {
    groupStore.toggleGroup(groupId);
  };

  const handleAddGroup = () => {
    navigation.navigate("EditGroup", { mode: "create" });
  };

  const handleEditGroup = (groupId: string) => {
    navigation.navigate("EditGroup", { mode: "edit", groupId });
  };

  return (
    <flexboxLayout className="flex-1 bg-gray-100">
      <actionBar className="bg-blue-600">
        <label text="Call Blocker" className="text-white text-lg p-2"/>
      </actionBar>
      
      <scrollView className="flex-1">
        <stackLayout className="p-2">
          <AddGroupCard onPress={handleAddGroup} />
          
          {groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onToggle={handleToggleGroup}
              onPress={() => handleEditGroup(group.id)}
            />
          ))}
        </stackLayout>
      </scrollView>
    </flexboxLayout>
  );
}