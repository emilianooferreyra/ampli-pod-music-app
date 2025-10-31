import React from "react";
import { View } from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { CustomDrawerContent } from "@/components/ui/custom-drawer-content";

export default function MainLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Drawer
          drawerContent={CustomDrawerContent}
          screenOptions={{
            drawerActiveTintColor: "#FF6B35",
            drawerInactiveTintColor: "#999",
            drawerStyle: {
              backgroundColor: "#1a1a1a",
              width: "90%",
            },
            drawerLabelStyle: {
              fontSize: 14,
              fontWeight: "500",
              marginLeft: -12,
            },
            headerShown: false,
          }}
        >
          <Drawer.Screen
            name="(drawer)"
            options={{
              drawerLabel: "App",
              drawerItemStyle: { display: "none" },
            }}
          />
        </Drawer>
      </View>
    </GestureHandlerRootView>
  );
}
