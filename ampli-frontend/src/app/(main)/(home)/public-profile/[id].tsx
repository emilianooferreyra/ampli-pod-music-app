import { useLocalSearchParams, Stack } from "expo-router";
import { YStack, H1, H2, Paragraph, Button } from "tamagui";
import { useRouter } from "expo-router";

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: `Profile ${id}`,
          headerShown: true,
        }}
      />
      <YStack f={1} jc="center" ai="center" p="$4" gap="$4">
        <H1>Public Profile</H1>
        <H2>User ID: {id}</H2>
        <Paragraph ta="center">
          This is a public profile view for user {id}
        </Paragraph>

        <Button onPress={() => router.back()}>Go Back</Button>
      </YStack>
    </>
  );
}
