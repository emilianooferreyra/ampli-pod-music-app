import { styled, Stack } from "tamagui";

// Componentes base styled para uso interno temporal
// TODO: Reemplazar con componentes personalizados más adelante

export const StyledView = styled(Stack, {
  name: "StyledView",
});

export const StyledXStack = styled(Stack, {
  name: "StyledXStack",
  flexDirection: "row",
});

export const StyledYStack = styled(Stack, {
  name: "StyledYStack",
  flexDirection: "column",
});

export const StyledZStack = styled(Stack, {
  name: "StyledZStack",
  position: "relative",
});
