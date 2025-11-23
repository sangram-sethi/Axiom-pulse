"use client";

import React from "react";

interface Props {
  message?: string;
}

export function TokenTableError({ message }: Props) {
  return (
    <div className="rounded-2xl border border-red-500/40 bg-red-500/5 px-6 py-4 text-sm text-red-300">
      Failed to load tokens. {message ?? "Please try again."}
    </div>
  );
}
