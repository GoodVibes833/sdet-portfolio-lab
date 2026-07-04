const dayMap: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  "일": 0, "월": 1, "화": 2, "수": 3, "목": 4, "금": 5, "토": 6,
};

export function isOpenNow(openHours?: string): boolean {
  if (!openHours) return false;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const parts = openHours.split(/,|\//).map((s) => s.trim());

  for (const part of parts) {
    const match = part.match(/([\w\-]+)\s*(?:\([^)]*\))?\s*(\d{1,2}):?(\d{2})?\s*[\-~]\s*(\d{1,2}):?(\d{2})?/);
    if (!match) continue;

    const days = match[1];
    const startHour = parseInt(match[2] || "0", 10);
    const startMin = parseInt(match[3] || "0", 10);
    const endHour = parseInt(match[4] || "0", 10);
    const endMin = parseInt(match[5] || "0", 10);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (days.includes("-")) {
      const [start, end] = days.split("-");
      const startIdx = dayMap[start] ?? -1;
      const endIdx = dayMap[end] ?? -1;
      if (startIdx === -1 || endIdx === -1) continue;

      if (startIdx <= endIdx) {
        if (currentDay >= startIdx && currentDay <= endIdx) {
          if (currentTime >= startTime && currentTime <= endTime) return true;
        }
      } else {
        // Wrap around weekend
        if (currentDay >= startIdx || currentDay <= endIdx) {
          if (currentTime >= startTime && currentTime <= endTime) return true;
        }
      }
    } else {
      const idx = dayMap[days] ?? -1;
      if (idx === currentDay) {
        if (currentTime >= startTime && currentTime <= endTime) return true;
      }
    }
  }

  return false;
}
