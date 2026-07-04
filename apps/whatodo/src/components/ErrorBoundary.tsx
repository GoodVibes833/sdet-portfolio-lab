"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 text-center">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <h2 className="text-lg font-black text-slate-800 mb-2">문제가 발생했어요</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-xs">
            {this.state.error?.message || "예기치 않은 오류가 발생했어요."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold bg-gradient-to-br from-[#e85d26] to-[#f5a623] hover:opacity-90 transition-opacity"
          >
            <RotateCcw size={14} />
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
