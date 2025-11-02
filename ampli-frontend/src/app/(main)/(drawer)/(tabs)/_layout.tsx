import React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { House, Search, Compass, Plus } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/ui/haptic-tab";
import { MiniAudioPlayer, MiniPlayerHeight } from "@/components/player";

const TAB_BAR_HEIGHT = 70;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const bottomOffset = TAB_BAR_HEIGHT + insets.bottom;

  return (
    <View style={styles.container}>
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
          name="create"
          options={{
            title: "Create",
            tabBarIcon: ({ color }) => <Plus size={28} color={color} />,
          }}
        />
      </Tabs>
      <View style={[styles.miniPlayerWrapper, { bottom: bottomOffset }]}>
        <View style={styles.miniPlayerContainer}>
          <MiniAudioPlayer />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  miniPlayerWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
  },
  miniPlayerContainer: {
    height: MiniPlayerHeight + 2,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
});
