import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotificationStore } from "@/store/notification";
import colors from "@/constants/colors";
import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react-native";

const NotificationItem = ({
  id,
  message,
  type,
}: {
  id: string;
  message: string;
  type: string;
}) => {
  const { removeNotification } = useNotificationStore();
  const slideAnim = React.useRef(new Animated.Value(-100)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      removeNotification(id);
    });
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} color={colors.SUCCESS} />;
      case "error":
        return <AlertCircle size={20} color={colors.ERROR} />;
      case "warning":
        return <AlertTriangle size={20} color={colors.WARNING} />;
      case "info":
        return <Info size={20} color={colors.INFO} />;
      default:
        return null;
    }
  };

  const typeConfig: { [key: string]: any } = {
    success: {
      bg: colors.GRAY_300,
    },
    error: {
      bg: "#FEE2E2",
    },
    warning: {
      bg: "#FEF3C7",
    },
    info: {
      bg: "#DBEAFE",
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <Animated.View
      style={[
        styles.notificationContainer,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View
        style={[
          styles.notification,
          {
            backgroundColor: config.bg,
          },
        ]}
      >
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>{getIcon()}</View>
          <Text style={styles.notificationText}>{message}</Text>
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={18} color={colors.TEXT_SECONDARY} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export const AppNotification = () => {
  const { notifications } = useNotificationStore();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.wrapper}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: "transparent",
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notificationContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    flex: 1,
    fontSize: 16,
    color: colors.BLACK,
    fontWeight: "bold",
    lineHeight: 20,
  },
  closeButton: {
    padding: 6,
    marginLeft: 8,
  },
});
