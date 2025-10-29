import React from "react";
import { Tabs } from "expo-router";
import { House, Search, Compass, Settings } from "lucide-react-native";

import { HapticTab } from "@/components/ui/haptic-tab";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#FFFFFF",
        tabBarStyle: {
          backgroundColor: "#232323",
          borderTopColor: "#232323",
        },

        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(explore)"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Compass size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
