"use client";
import { useEffect } from "react";
import { withBase } from "../components/base-path";

export default function Page() {
  useEffect(() => {
    location.replace(withBase("/espace-testeur"));
  }, []);
  return (
    <main className="accessState">
      <p>Opening the tester workspace…</p>
    </main>
  );
}
