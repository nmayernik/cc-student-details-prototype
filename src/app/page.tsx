"use client";

import { useState } from "react";
import StudentDetailsModal from "@/components/student-details-modal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[#f9fafb] px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center justify-center size-16 rounded-2xl bg-white border border-gray-300 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a475f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-gray-850">
            Add a Student
          </h1>
          <p className="text-base text-gray-600 max-w-md">
            Click the button below to open the Student Details form. On desktop
            it opens as a centered modal; on mobile it slides up as a bottom
            sheet.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="h-11 px-6 rounded-lg bg-yellow-500 text-base font-semibold text-primary-800 hover:bg-yellow-500/90 transition-colors cursor-pointer"
        >
          Add Student
        </button>
      </div>

      <StudentDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
