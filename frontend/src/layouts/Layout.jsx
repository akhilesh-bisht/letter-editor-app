import React from "react";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { GoogleAuthProvider } from "./hooks/use-google-auth";

export default function RootLayout({ children }) {
  return (
    <div>
      <ThemeProvider>
        <GoogleAuthProvider>{children}</GoogleAuthProvider>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}
