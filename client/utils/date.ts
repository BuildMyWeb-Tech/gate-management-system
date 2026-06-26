export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDateTime = (dateString: string): string => {
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
};

export const toISODate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const todayISO = (): string => toISODate(new Date());