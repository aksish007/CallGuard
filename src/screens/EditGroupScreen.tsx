import * as React from "react";
import { RouteProp } from "@react-navigation/core";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { Group } from "../types/Group";

type EditGroupScreenProps = {
  route: RouteProp<any, "EditGroup">;
  navigation: FrameNavigationProp<any, "EditGroup">;
};

export function EditGroupScreen({ navigation, route }: EditGroupScreenProps) {
  const [name, setName] = React.useState("");
  const isCreateMode = route.params?.mode === "create";

  const handleSave = () => {
    // TODO: Implement save functionality
    navigation.goBack();
  };

  return (
    <flexboxLayout className="flex-1 bg-gray-100">
      <actionBar className="bg-blue-600">
        <navigationButton text="Back" android.systemIcon="ic_menu_back" onTap={() => navigation.goBack()} />
        <label text={isCreateMode ? "Create Group" : "Edit Group"} className="text-white text-lg p-2"/>
      </actionBar>
      
      <stackLayout className="p-4">
        <label text="Group Name" className="text-sm font-medium text-gray-600 mb-2"/>
        <textField
          text={name}
          onTextChange={(args) => setName(args.value)}
          hint="Enter group name"
          className="bg-white p-4 rounded-lg border border-gray-300 mb-4"
        />
        
        <button
          text="Save Group"
          className="bg-blue-500 text-white p-4 rounded-lg font-bold"
          onTap={handleSave}
        />
      </stackLayout>
    </flexboxLayout>
  );
}