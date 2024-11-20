import * as React from "react";
import { BaseNavigationContainer } from "@react-navigation/core";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { HomeScreen } from "../screens/HomeScreen";
import { EditGroupScreen } from "../screens/EditGroupScreen";

const StackNavigator = stackNavigatorFactory();

export function NavigationContainer() {
  return (
    <BaseNavigationContainer>
      <StackNavigator.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}
      >
        <StackNavigator.Screen
          name="Home"
          component={HomeScreen}
        />
        <StackNavigator.Screen
          name="EditGroup"
          component={EditGroupScreen}
        />
      </StackNavigator.Navigator>
    </BaseNavigationContainer>
  );
}