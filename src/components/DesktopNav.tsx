"use client";

import { useState, useEffect } from "react";
import SideNav from "./SideNav";

export default function DesktopNav() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // מונע hydration mismatch - מחזיר null עד שהקליינט נטען
  if (!isClient) {
    return <div className="hidden lg:block w-72" />; // placeholder בגודל הנכון
  }

  return (
    <div className="hidden lg:block">
      <SideNav isOpen={true} onClose={() => {}} />
    </div>
  );
}
