"use client";

import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";

export default function WebVitals() {
  useReportWebVitals((metric) => {
    console.log("[WebVitals]", metric.name, metric.value, metric);

    // 성능이 저하된 경우에만 콘솔에 경고 표시
    if (metric.name === "LCP" && metric.value > 2500) {
      console.warn("[WebVitals] LCP 경고:", metric.value, "ms (목표: < 2500ms)");
    }
    if (metric.name === "CLS" && metric.value > 0.1) {
      console.warn("[WebVitals] CLS 경고:", metric.value, "(목표: < 0.1)");
    }
    if (metric.name === "INP" && metric.value > 200) {
      console.warn("[WebVitals] INP 경고:", metric.value, "ms (목표: < 200ms)");
    }
  });

  return null;
}
