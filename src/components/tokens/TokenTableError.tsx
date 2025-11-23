"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function TokenTableError({ message, onRetry }: Props) {
  return (
    <div className="px-4 py-8 text-center text-sm text-axiom-textSecondary md:px-6" role="alert" aria-live="polite">
      <p className="mb-2 text-axiom-textPrimary">
        Failed to load tokens.
      </p>

      {message && (
        <p className="mb-4 text-[11px] text-axiom-textMuted">
          {message}
        </p>
      )}

      {onRetry && (
        <Button
          variant="outline"
          size="md"
          onClick={onRetry}
          className="text-xs"
        >
          Retry
        </Button>
      )}
    </div>
  );
}

