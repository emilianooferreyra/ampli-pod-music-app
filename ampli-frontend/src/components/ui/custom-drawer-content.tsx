import { View, Text, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import {
  Plus,
  Music,
  Zap,
  Clock,
  Settings,
  MessageSquare,
  LogOut,
  Tv,
} from "lucide-react-native";

interface MenuItem {
  iconName: string;
  label: string;
  onPress: () => void;
}

interface DrawerContentProps {
  navigation: any;
}

const getIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    plus: Plus,
    music: Music,
    zap: Zap,
    subscriptions: Tv,
    clock: Clock,
    settings: Settings,
    message: MessageSquare,
    logout: LogOut,
  };
  return icons[iconName] || null;
};

export function CustomDrawerContent(props: DrawerContentProps) {
  const handleNavigate = (screenName: string) => {
    props.navigation.navigate("(drawer)", { screen: screenName });
    props.navigation.closeDrawer();
  };

  const menuItems: MenuItem[] = [
    {
      iconName: "plus",
      label: "Agregar cuenta",
      onPress: () => handleNavigate("add-account"),
    },
    {
      iconName: "music",
      label: "Suscripciones",
      onPress: () => handleNavigate("subscriptions"),
    },
    {
      iconName: "zap",
      label: "Novedades",
      onPress: () => handleNavigate("news"),
    },

    {
      iconName: "clock",
      label: "Recientes",
      onPress: () => handleNavigate("recent"),
    },
    {
      iconName: "settings",
      label: "Configuración y privacidad",
      onPress: () => handleNavigate("(settings)"),
    },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={true}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: "#1a1a1a",
        paddingVertical: 0,
      }}
    >
      <TouchableOpacity
        onPress={() => handleNavigate("profile")}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#333",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#FF6B35",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "700", color: "#FFF" }}>
            E
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#FFF" }}>
            emitoo
          </Text>
          <Text style={{ fontSize: 14, color: "#999", marginTop: 2 }}>
            Ver perfil
          </Text>
        </View>
      </TouchableOpacity>

      {/* Menu Items */}
      <View style={{ paddingVertical: 12 }}>
        {menuItems.map((item, index) => {
          const IconComponent = getIcon(item.iconName);
          if (!IconComponent) return null;

          return (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                  flex: 1,
                }}
              >
                <IconComponent size={24} color="#FFF" strokeWidth={1.5} />
                <Text
                  style={{ fontSize: 16, fontWeight: "500", color: "#FFF" }}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}
