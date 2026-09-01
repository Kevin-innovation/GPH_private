"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/content/site-config";

type FormState = {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  consent: boolean;
  website: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const initialForm: FormState = {
  name: "",
  email: "",
  category: "",
  subject: "",
  message: "",
  consent: false,
  website: "",
};

const formCategories = [
  "General question",
  "Nutrition information",
  "Nutrition app",
  "Website feedback",
  "Club participation",
  "Collaboration",
  "Technical issue",
  "Other",
];

// Minimum time on the form before a submission is accepted, in milliseconds.
// Paired with the hidden honeypot field this covers basic bot traffic without a CAPTCHA.
const MIN_FILL_TIME_MS = 900;

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (form.website) nextErrors.website = "Please leave this field blank.";
    if (form.name.trim().length < 2) nextErrors.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Please enter a valid email address.";
    if (!form.category) nextErrors.category = "Please choose a category.";
    if (form.subject.trim().length < 3) nextErrors.subject = "Please enter a subject.";
    if (form.message.trim().length < 15) nextErrors.message = "Please add a little more detail.";
    if (!form.consent) nextErrors.consent = "Please confirm that you understand this contact boundary.";
    if (Date.now() - startedAt.current < MIN_FILL_TIME_MS) nextErrors.form = "Please take a moment before submitting.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      window.requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setStatus("submitting");
    setErrors({});

    // No endpoint configured: the form is fully interactive but delivery is off.
    // Setting siteConfig.contact.endpoint is the only change needed to enable it.
    if (!siteConfig.contact.endpoint) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      setStatus("success");
      return;
    }

    try {
      const response = await fetch(siteConfig.contact.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Contact request failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrors({ form: "We could not send your message. Please try again later." });
    }
  };

  if (status === "success") {
    const deliveryEnabled = Boolean(siteConfig.contact.endpoint);

    return (
      <div className="form-success" role="status">
        <Eyebrow>{deliveryEnabled ? "Message received" : "Demo complete"}</Eyebrow>
        <h3>
          {deliveryEnabled
            ? "Thank you for contacting Global Public Health Lens."
            : "The form interaction is working, but no message was sent."}
        </h3>
        <p>
          {deliveryEnabled
            ? "Your message has been received. Please remember that we cannot provide emergency assistance, diagnosis, or personalized medical treatment through this form."
            : "This preview has no delivery endpoint. Connect one in the site configuration before publishing the contact form."}
        </p>
        {!deliveryEnabled ? (
          <p className="form-note">
            This preview is in demo mode. Add a Formspree endpoint in the site configuration to enable delivery.
          </p>
        ) : null}
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setForm(initialForm);
            setStatus("idle");
            startedAt.current = Date.now();
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"}>
      <div className="form-grid">
        <label>
          Name
          <input
            id="contact-name"
            name="name"
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name ? <span className="field-error" id="contact-name-error">{errors.name}</span> : null}
        </label>
        <label>
          Email address
          <input
            id="contact-email"
            name="email"
            required
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email ? <span className="field-error" id="contact-email-error">{errors.email}</span> : null}
        </label>
        <label>
          Question category
          <select
            id="contact-category"
            name="category"
            required
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "contact-category-error" : undefined}
          >
            <option value="">Select a category</option>
            {formCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          {errors.category ? <span className="field-error" id="contact-category-error">{errors.category}</span> : null}
        </label>
        <label>
          Subject
          <input
            id="contact-subject"
            name="subject"
            required
            value={form.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          />
          {errors.subject ? <span className="field-error" id="contact-subject-error">{errors.subject}</span> : null}
        </label>
      </div>
      <label>
        Message
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message ? <span className="field-error" id="contact-message-error">{errors.message}</span> : null}
      </label>
      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => updateField("website", event.target.value)} />
      </label>
      <label className="consent-label">
        <input
          id="contact-consent"
          name="consent"
          required
          type="checkbox"
          checked={form.consent}
          onChange={(event) => updateField("consent", event.target.checked)}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "contact-consent-error" : undefined}
        />
        <span>
          I understand that this form is for general contact only and is not a source of diagnosis, emergency assistance, or
          individualized medical advice.
        </span>
      </label>
      {errors.consent ? <span className="field-error" id="contact-consent-error">{errors.consent}</span> : null}
      {errors.form ? (
        <p className="form-error" role="alert">
          {errors.form}
        </p>
      ) : null}
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
        <p className="form-note">
          {siteConfig.contact.endpoint
            ? `Typical response time: ${siteConfig.contact.responseTime}`
            : "Contact delivery is not connected in this preview."}
        </p>
      </div>
    </form>
  );
}
