"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, Button } from "../ui";

export type FormFieldConfig = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  rows?: number;
};

/**
 * The shared shape behind every "apply to become a partner" form
 * (Affiliate, SDR, Agency). Configuration in, real submission behavior
 * out — a new field, or a whole new application type, is a config change
 * here, not a new page-specific form implementation.
 */
export default function ApplicationForm({
  fields,
  submitLabel = "Submit application",
  onSubmit,
  successTitle = "Application received!",
  successMessage,
  accentColor = "var(--color-primary)",
  agreement,
}: {
  fields: FormFieldConfig[];
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  successTitle?: string;
  successMessage?: (values: Record<string, string>) => string;
  accentColor?: string;
  /** Optional legal/compliance gate — submission is disabled until checked. */
  agreement?: { label: React.ReactNode; expandableContent?: React.ReactNode };
}) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showAgreementText, setShowAgreementText] = useState(false);

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(values);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <Card className="text-center py-12">
        <CheckCircle2 size={40} style={{ color: accentColor }} className="mx-auto mb-4" />
        <h3 className="pd-text-h3 mb-2">{successTitle}</h3>
        <p className="pd-text-body">
          {successMessage ? successMessage(values) : "We'll be in touch soon."}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-(--color-foreground) mb-2">
              {field.label}
              {field.required && " *"}
            </label>
            {field.type === "textarea" ? (
              <textarea
                required={field.required}
                rows={field.rows ?? 4}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full border border-(--color-border) rounded-[var(--radius-md)] px-4 py-3 text-sm bg-(--color-surface) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
              />
            ) : field.type === "select" ? (
              <select
                required={field.required}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full border border-(--color-border) rounded-[var(--radius-md)] px-4 py-3 text-sm bg-(--color-surface) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
              >
                <option value="">{field.placeholder ?? `Select ${field.label.toLowerCase()}`}</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full border border-(--color-border) rounded-[var(--radius-md)] px-4 py-3 text-sm bg-(--color-surface) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
              />
            )}
          </div>
        ))}

        {agreement && (
          <div>
            {agreement.expandableContent && (
              <div className="rounded-[var(--radius-lg)] border border-(--color-border) bg-(--color-surface-alt) overflow-hidden mb-3">
                <button
                  type="button"
                  onClick={() => setShowAgreementText(!showAgreementText)}
                  className="w-full flex items-center justify-between px-5 py-3 text-left text-sm font-semibold"
                >
                  <span>Read the full agreement</span>
                  <span className="text-(--color-foreground-subtle)">{showAgreementText ? "Hide" : "Show"}</span>
                </button>
                {showAgreementText && (
                  <div className="px-5 pb-5 pt-1 border-t border-(--color-border) text-sm text-(--color-foreground-muted) space-y-3 max-h-96 overflow-y-auto">
                    {agreement.expandableContent}
                  </div>
                )}
              </div>
            )}
            <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-(--color-primary-light)">
              <input
                type="checkbox"
                id="pd-application-agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 flex-shrink-0"
                style={{ accentColor }}
              />
              <label htmlFor="pd-application-agree" className="text-sm text-(--color-foreground) leading-relaxed cursor-pointer">
                {agreement.label}
              </label>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-(--color-danger)">{error}</p>}

        <Button type="submit" disabled={submitting || (!!agreement && !agreed)} className="w-full">
          {submitting ? "Submitting..." : submitLabel}
        </Button>
      </form>
    </Card>
  );
}
