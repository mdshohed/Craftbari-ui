// src/hooks/usePageViewTracking.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageViewTracking() {
  const location = useLocation();

  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname, location.search]);
}