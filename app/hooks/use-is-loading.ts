import { useNavigation } from "@remix-run/react";

export function useIsSubmitting() {
  const navigation = useNavigation();
  return navigation.state === "submitting";
}
