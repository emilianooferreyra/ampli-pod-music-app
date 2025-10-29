import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import colors from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

const otpFields = new Array(6).fill("");

const VerifyEmail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { verifyEmail } = useAuth();
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<TextInput>(null);
  const userId = params.userId as string;

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];

    if (value === "Backspace") {
      if (!newOtp[index]) setActiveOtpIndex(index - 1);
      newOtp[index] = "";
    } else {
      setActiveOtpIndex(index + 1);
      newOtp[index] = value;
    }

    setOtp([...newOtp]);
  };

  const handlePaste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const newOtp = value.split("");
      setOtp([...newOtp]);
    }
  };

  const isValidOtp = otp.every((value) => {
    return value.trim();
  });

  const handleSubmit = async () => {
    if (!isValidOtp) {
      setError("Por favor completa el código OTP");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const otpCode = otp.join("");
      const response = await verifyEmail(userId, otpCode);

      if (response.success) {
        router.replace("/(auth)/sign-in");
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Error al verificar email";
      setError(message);
    }

    setSubmitting(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Verifica tu Email</Text>
        <Text style={styles.subtitle}>
          Ingresa el código de 6 dígitos que recibiste en tu email
        </Text>

        <View style={styles.otpContainer}>
          {otpFields.map((_, index) => {
            return (
              <TextInput
                ref={activeOtpIndex === index ? inputRef : null}
                key={index}
                style={styles.otpInput}
                placeholder="*"
                onKeyPress={({ nativeEvent }) => {
                  handleChange(nativeEvent.key, index);
                }}
                onChangeText={handlePaste}
                keyboardType="numeric"
                maxLength={1}
                value={otp[index] || ""}
              />
            );
          })}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.BLACK} />
          ) : (
            <Text style={styles.buttonText}>Verificar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} disabled={submitting}>
          <Text style={styles.backLink}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.TEXT_SECONDARY,
    marginBottom: 32,
    textAlign: "center",
  },
  otpContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  otpInput: {
    width: "14%",
    height: 56,
    borderWidth: 2,
    borderColor: colors.BORDER,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: colors.TEXT_PRIMARY,
    backgroundColor: colors.BACKGROUND_SECONDARY,
  },
  errorText: {
    color: colors.ERROR,
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: colors.WHITE,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.BLACK,
    fontSize: 16,
    fontWeight: "600",
  },
  backLink: {
    color: colors.ACCENT,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default VerifyEmail;
