import { useQuery } from "@tanstack/react-query";
import { getGuests } from "../../services/apiGuests";

export function useGuests() {
  const {
    isLoading,
    data: guests,
    error,
  } = useQuery({ queryFn: getGuests, queryKey: ["guests"] });

  return { isLoading, guests, error };
}
