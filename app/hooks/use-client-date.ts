import { useEffect, useState } from "react";
export function useClientDate(dateStr?: string) {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    setDate(dateStr ? new Date(dateStr) : new Date());
  }, [dateStr]);

  return date;
}
