import * as React from "react";
import * as ReactNativeScript from "react-nativescript";
import { NavigationContainer } from "./navigation/NavigationContainer";

Object.defineProperty(global, "__DEV__", { value: false });

ReactNativeScript.start(React.createElement(NavigationContainer, {}, null));