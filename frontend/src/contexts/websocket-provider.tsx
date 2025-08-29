"use client";

import { useWebSocket } from "@/hooks/use-websocket";
import { ReactNode } from "react";

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  useWebSocket();

  return <>{children}</>;
};
