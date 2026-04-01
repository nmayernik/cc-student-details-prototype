"use client";

import { useEffect, useRef, useState } from "react";

interface StudentDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

const MONTHS = [
  { value: "1", label: "01 - January" },
  { value: "2", label: "02 - February" },
  { value: "3", label: "03 - March" },
  { value: "4", label: "04 - April" },
  { value: "5", label: "05 - May" },
  { value: "6", label: "06 - June" },
  { value: "7", label: "07 - July" },
  { value: "8", label: "08 - August" },
  { value: "9", label: "09 - September" },
  { value: "10", label: "10 - October" },
  { value: "11", label: "11 - November" },
  { value: "12", label: "12 - December" },
];

const GRADUATION_YEARS = Array.from({ length: 10 }, (_, i) =>
  String(new Date().getFullYear() + i - 4)
);

const RELATIONSHIPS = [
  "Mother",
  "Father",
  "Stepmother",
  "Stepfather",
  "Guardian",
  "Grandparent",
  "Other",
];

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#707070" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 7.5L10 12.5L15 7.5" />
    </svg>
  );
}

function Checkbox({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        flex items-center justify-center shrink-0 size-5 rounded-[6px] border transition-colors
        ${disabled
          ? "bg-gray-100 border-gray-300 cursor-not-allowed"
          : checked
            ? "bg-navy-50 border-navy-600"
            : "bg-white border-input-border hover:border-gray-600"
        }
      `}
    >
      {checked && !disabled && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#2c78a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" />
        </svg>
      )}
    </button>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="flex gap-1 items-start text-sm font-medium leading-5 text-gray-700">
      <span>{children}</span>
      {required && <span className="text-red-600">*</span>}
    </label>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-input-border bg-white px-3.5 py-2.5 text-base leading-6 text-gray-850 shadow-[0_1px_2px_rgba(16,24,40,0.05)] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600"
    />
  );
}

function SelectInput({
  placeholder,
  value,
  onChange,
  options,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[] | { value: string; label: string }[];
}) {
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div className="relative w-full min-w-0 overflow-hidden">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-full appearance-none rounded-lg border border-input-border bg-white px-3.5 py-2.5 pr-10 text-base leading-6 shadow-[0_1px_2px_rgba(16,24,40,0.05)] focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 text-gray-850 text-ellipsis"
        style={{ color: value ? undefined : "#707070" }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {normalized.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
    </div>
  );
}

export default function StudentDetailsModal({ open, onClose }: StudentDetailsModalProps) {
  const [addMyself, setAddMyself] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [relationship, setRelationship] = useState("");
  const [inviteStudent, setInviteStudent] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [timeZone, setTimeZone] = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!isVisible) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const timeZones = [
    "(UTC-05:00) Eastern Time (US & Canada)",
    "(UTC-06:00) Central Time (US & Canada)",
    "(UTC-07:00) Mountain Time (US & Canada)",
    "(UTC-08:00) Pacific Time (US & Canada)",
    "(UTC-09:00) Alaska",
    "(UTC-10:00) Hawaii",
  ];

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`
        fixed inset-0 z-50 flex items-end md:items-center md:justify-center
        transition-colors duration-300
        ${isAnimating ? "bg-black/50" : "bg-black/0"}
      `}
    >
      {/* Desktop modal */}
      <div
        className={`
          hidden md:flex flex-col bg-white rounded-xl overflow-hidden w-[540px] max-h-[90vh]
          shadow-[0_20px_24px_-4px_rgba(16,24,40,0.08),0_8px_8px_-4px_rgba(16,24,40,0.03)]
          transition-all duration-300 ease-out
          ${isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        <div className="relative shrink-0">
          <ModalHeader variant="desktop" onClose={onClose} />
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-white/0 to-white pointer-events-none" />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <ModalForm
            variant="desktop"
            addMyself={addMyself}
            setAddMyself={setAddMyself}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            month={month}
            setMonth={setMonth}
            day={day}
            setDay={setDay}
            year={year}
            setYear={setYear}
            gradYear={gradYear}
            setGradYear={setGradYear}
            relationship={relationship}
            setRelationship={setRelationship}
            inviteStudent={inviteStudent}
            setInviteStudent={setInviteStudent}
            studentEmail={studentEmail}
            setStudentEmail={setStudentEmail}
            timeZone={timeZone}
            setTimeZone={setTimeZone}
            timeZones={timeZones}
          />
        </div>
        <div className="relative shrink-0">
          <div className="absolute top-0 left-0 right-0 h-6 -translate-y-full bg-gradient-to-t from-white/0 to-white pointer-events-none" />
          <ModalFooter variant="desktop" onClose={onClose} />
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div
        className={`
          flex md:hidden flex-col bg-white rounded-t-xl overflow-hidden w-full max-h-[92vh]
          shadow-[0_20px_24px_-4px_rgba(16,24,40,0.08),0_8px_8px_-4px_rgba(16,24,40,0.03)]
          transition-transform duration-300 ease-out
          ${isAnimating ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="relative shrink-0">
          <ModalHeader variant="mobile" onClose={onClose} />
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-white/0 to-white pointer-events-none" />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <ModalForm
            variant="mobile"
            addMyself={addMyself}
            setAddMyself={setAddMyself}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            month={month}
            setMonth={setMonth}
            day={day}
            setDay={setDay}
            year={year}
            setYear={setYear}
            gradYear={gradYear}
            setGradYear={setGradYear}
            relationship={relationship}
            setRelationship={setRelationship}
            inviteStudent={inviteStudent}
            setInviteStudent={setInviteStudent}
            studentEmail={studentEmail}
            setStudentEmail={setStudentEmail}
            timeZone={timeZone}
            setTimeZone={setTimeZone}
            timeZones={timeZones}
          />
        </div>
        <div className="relative shrink-0">
          <div className="absolute top-0 left-0 right-0 h-6 -translate-y-full bg-gradient-to-t from-white/0 to-white pointer-events-none" />
          <ModalFooter variant="mobile" onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

function ModalHeader({
  variant,
  onClose,
}: {
  variant: "desktop" | "mobile";
  onClose: () => void;
}) {
  const isDesktop = variant === "desktop";

  return (
    <div className="relative bg-white shrink-0">
      <div className={`flex flex-col ${isDesktop ? "gap-4 pt-6 px-6" : "gap-3 pt-5 px-4"}`}>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-semibold leading-8 text-gray-850">
            Student Details
          </h2>
          {isDesktop ? (
            <p className="text-base font-normal leading-5 text-gray-800">
              An asterisk (<span className="text-red-600">*</span>) indicates a required field.
            </p>
          ) : (
            <p className="text-sm font-normal leading-5">
              <span className="text-red-600">* </span>
              <span className="text-gray-800">Required</span>
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className={`absolute ${isDesktop ? "right-4 top-4" : "right-3 top-3"} p-2.5 rounded-lg hover:bg-gray-100 transition-colors`}
        aria-label="Close"
      >
        <CloseIcon />
      </button>
      <div className="h-5" />
    </div>
  );
}

interface ModalFormProps {
  variant: "desktop" | "mobile";
  addMyself: boolean;
  setAddMyself: (v: boolean) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  month: string;
  setMonth: (v: string) => void;
  day: string;
  setDay: (v: string) => void;
  year: string;
  setYear: (v: string) => void;
  gradYear: string;
  setGradYear: (v: string) => void;
  relationship: string;
  setRelationship: (v: string) => void;
  inviteStudent: boolean;
  setInviteStudent: (v: boolean) => void;
  studentEmail: string;
  setStudentEmail: (v: string) => void;
  timeZone: string;
  setTimeZone: (v: string) => void;
  timeZones: string[];
}

function ModalForm({
  variant,
  addMyself,
  setAddMyself,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  month,
  setMonth,
  day,
  setDay,
  year,
  setYear,
  gradYear,
  setGradYear,
  relationship,
  setRelationship,
  inviteStudent,
  setInviteStudent,
  studentEmail,
  setStudentEmail,
  timeZone,
  setTimeZone,
  timeZones,
}: ModalFormProps) {
  const isDesktop = variant === "desktop";
  const gap = isDesktop ? "gap-6" : "gap-4";

  return (
    <div className={`flex flex-col ${gap}`}>
      {/* Add myself checkbox */}
      <div className="flex gap-3 items-center">
        <Checkbox checked={addMyself} onChange={setAddMyself} />
        <span className="text-base font-medium leading-5 text-gray-800">Add myself</span>
      </div>

      {/* First Name / Last Name */}
      {isDesktop ? (
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <Label required>First Name</Label>
            <TextInput value={firstName} onChange={setFirstName} />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <Label required>Last Name</Label>
            <TextInput value={lastName} onChange={setLastName} />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <Label required>First Name</Label>
            <TextInput value={firstName} onChange={setFirstName} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label required>Last Name</Label>
            <TextInput value={lastName} onChange={setLastName} />
          </div>
        </>
      )}

      {/* Date of birth — USWDS memorable date pattern */}
      <div role="group" aria-labelledby="dob-label" className="flex flex-col gap-1.5">
        <p id="dob-label" className="text-base font-semibold leading-5 text-gray-800">
          Date of birth
        </p>
        <div className={`flex ${isDesktop ? "gap-4" : "gap-2"}`}>
          <div className="flex flex-col gap-1.5 flex-[2_1_0] min-w-0">
            <Label required>Month</Label>
            <SelectInput
              placeholder="Select"
              value={month}
              onChange={setMonth}
              options={MONTHS}
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-[1_1_0] min-w-0">
            <Label required>Day</Label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              placeholder="DD"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full rounded-lg border border-input-border bg-white px-3.5 py-2.5 text-base leading-6 text-gray-850 shadow-[0_1px_2px_rgba(16,24,40,0.05)] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-[1_1_0] min-w-0">
            <Label required>Year</Label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              minLength={4}
              maxLength={4}
              placeholder="YYYY"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-lg border border-input-border bg-white px-3.5 py-2.5 text-base leading-6 text-gray-850 shadow-[0_1px_2px_rgba(16,24,40,0.05)] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600"
            />
          </div>
        </div>
      </div>

      {/* Year of High School Graduation */}
      <div className="flex flex-col gap-1.5">
        <Label required>{isDesktop ? "Year of High School Graduation" : "Year of Graduation"}</Label>
        <SelectInput
          placeholder="Select"
          value={gradYear}
          onChange={setGradYear}
          options={GRADUATION_YEARS}
        />
      </div>

      {/* Relationship to Student */}
      <div className="flex flex-col gap-1.5">
        <Label required>Relationship to Student</Label>
        <SelectInput
          placeholder="Select"
          value={relationship}
          onChange={setRelationship}
          options={RELATIONSHIPS}
        />
      </div>

      {/* Invite checkbox */}
      <div className="flex gap-3 items-start">
        <div className="pt-0.5">
          <Checkbox checked={inviteStudent} onChange={setInviteStudent} />
        </div>
        <span className={`${isDesktop ? "text-base font-medium" : "text-sm font-normal"} leading-5 text-gray-700`}>
          Invite your student to set up their own College Coach login
        </span>
      </div>

      {/* Conditional fields when invite is checked */}
      {inviteStudent && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label required>Student Email</Label>
            <TextInput
              placeholder="student@email.com"
              value={studentEmail}
              onChange={setStudentEmail}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label required>Time Zone</Label>
            <SelectInput
              placeholder="Select"
              value={timeZone}
              onChange={setTimeZone}
              options={timeZones}
            />
          </div>
        </>
      )}
    </div>
  );
}

function ModalFooter({
  variant,
  onClose,
}: {
  variant: "desktop" | "mobile";
  onClose: () => void;
}) {
  const isDesktop = variant === "desktop";

  return (
    <div className={`shrink-0 ${isDesktop ? "pt-8" : "pt-6"}`}>
      <div
        className={`flex ${isDesktop ? "flex-row gap-3 px-6 pb-6" : "flex-col gap-3 px-4 pb-4"}`}
      >
        {isDesktop ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-lg border border-gray-300 bg-white text-base font-semibold text-gray-800 hover:bg-gray-100/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 h-11 rounded-lg bg-yellow-500 text-base font-semibold text-primary-800 hover:bg-yellow-500/90 transition-colors"
            >
              Add
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="w-full h-11 rounded-lg bg-yellow-500 text-base font-semibold text-primary-800 hover:bg-yellow-500/90 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 rounded-lg border border-gray-300 bg-white text-base font-semibold text-gray-800 hover:bg-gray-100/40 transition-colors"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
