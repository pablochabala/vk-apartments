"use client";

import { useEffect, useId, useRef, useState } from "react";
import { apartments, contact, site } from "@/content";
import { useUI } from "@/components/providers/AppProviders";
import { MagneticButton } from "./MagneticButton";
import { Icon } from "./Icon";

type Field = "name" | "phone" | "unit" | "checkin" | "checkout" | "message";
type Errors = Partial<Record<Field, string>>;

const phoneOk = (v: string) => /^\+?[\d\s-]{9,16}$/.test(v.trim()) && v.replace(/\D/g, "").length >= 9;

function validate(f: Record<Field, string>): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name (at least 2 letters).";
  if (!phoneOk(f.phone)) e.phone = "Enter a phone number we can call back, e.g. 097 123 4567.";
  if (!f.unit) e.unit = "Choose an apartment, or pick “Not sure yet”.";
  if (f.checkin && f.checkout && f.checkout <= f.checkin) e.checkout = "Check-out must be after check-in.";
  return e;
}

/**
 * Enquiry form → opens WhatsApp with a pre-filled message to VK Apartments.
 * No backend and no online payment, as requested.
 */
export function EnquiryForm({ tone = "light", compact }: { tone?: "light" | "dark"; compact?: boolean }) {
  const { unit, setUnit } = useUI();
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<Record<Field, string>>({ name: "", phone: "", unit: unit || "", checkin: "", checkout: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [sent, setSent] = useState(false);

  // Follow "Enquire" buttons elsewhere on the page.
  useEffect(() => {
    if (unit) setForm((f) => ({ ...f, unit }));
  }, [unit]);

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (k === "unit") setUnit(e.target.value);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: Field) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(form));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({ name: true, phone: true, unit: true, checkout: true });
    const first = (Object.keys(errs) as Field[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const unitLabel = apartments.types.find((t) => t.id === form.unit)?.label ?? "Not sure yet";
    const lines = [
      `Hello VK Apartments, I'd like to enquire about a stay.`,
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Apartment: ${unitLabel}`,
      form.checkin && `Check-in: ${form.checkin}`,
      form.checkout && `Check-out: ${form.checkout}`,
      form.message.trim() && `Message: ${form.message.trim()}`,
    ].filter(Boolean);
    window.open(`${site.phone.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const dark = tone === "dark";
  const label = `eyebrow mb-2 block ${dark ? "text-sand/80" : "text-muted"}`;
  const input = `w-full min-h-12 border-b bg-transparent py-3 text-base outline-none transition-colors placeholder:opacity-50 focus-visible:outline-none ${
    dark ? "border-limestone/25 text-limestone focus:border-copper-lt" : "border-ink/20 text-ink focus:border-copper"
  }`;
  const err = (k: Field) =>
    touched[k] && errors[k] ? (
      <p id={`${id}-${k}-err`} className={`mt-2 text-sm ${dark ? "text-blush" : "text-[#9b2c1c]"}`} role="alert">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: Field) => ({
    "aria-invalid": !!(touched[k] && errors[k]),
    "aria-describedby": touched[k] && errors[k] ? `${id}-${k}-err` : undefined,
  });

  if (sent) {
    return (
      <div className={`flex flex-col items-start gap-6 py-6 ${dark ? "text-limestone" : ""}`} role="status">
        <span className="serif-accent text-5xl text-copper">Thank you.</span>
        <p className="max-w-md">WhatsApp should now be open with your enquiry ready to send. If it didn't open, call or WhatsApp us on <a className="underline underline-offset-4" href={site.phone.tel}>{site.phone.display}</a>.</p>
        <button type="button" onClick={() => setSent(false)} className="eyebrow min-h-11 underline underline-offset-4" data-cursor="link">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className={`grid gap-6 ${compact ? "" : "md:grid-cols-2"}`}>
      <div>
        <label htmlFor={`${id}-name`} className={label}>
          Name <span aria-hidden="true">*</span>
        </label>
        <input id={`${id}-name`} name="name" autoComplete="name" required value={form.name} onChange={set("name")} onBlur={blur("name")} className={input} {...aria("name")} />
        {err("name")}
      </div>
      <div>
        <label htmlFor={`${id}-phone`} className={label}>
          Phone <span aria-hidden="true">*</span>
        </label>
        <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={form.phone} onChange={set("phone")} onBlur={blur("phone")} className={input} {...aria("phone")} />
        {err("phone")}
      </div>
      <div className={compact ? "" : "md:col-span-2"}>
        <label htmlFor={`${id}-unit`} className={label}>
          Preferred apartment <span aria-hidden="true">*</span>
        </label>
        <select id={`${id}-unit`} name="unit" required value={form.unit} onChange={set("unit")} onBlur={blur("unit")} className={`${input} cursor-pointer appearance-none`} {...aria("unit")}>
          <option value="" disabled className="text-ink">
            Select an apartment
          </option>
          {apartments.types.map((t) => (
            <option key={t.id} value={t.id} className="text-ink">
              {t.label}: {apartments.currency}
              {t.price.toLocaleString("en-ZM")} {apartments.priceSuffix}
            </option>
          ))}
          <option value="unsure" className="text-ink">
            Not sure yet
          </option>
        </select>
        {err("unit")}
      </div>
      <div>
        <label htmlFor={`${id}-checkin`} className={label}>
          Check-in <span className="normal-case tracking-normal opacity-70">(optional)</span>
        </label>
        <input id={`${id}-checkin`} name="checkin" type="date" value={form.checkin} onChange={set("checkin")} onBlur={blur("checkin")} className={input} style={{ colorScheme: dark ? "dark" : "light" }} />
      </div>
      <div>
        <label htmlFor={`${id}-checkout`} className={label}>
          Check-out <span className="normal-case tracking-normal opacity-70">(optional)</span>
        </label>
        <input id={`${id}-checkout`} name="checkout" type="date" min={form.checkin || undefined} value={form.checkout} onChange={set("checkout")} onBlur={blur("checkout")} className={input} style={{ colorScheme: dark ? "dark" : "light" }} {...aria("checkout")} />
        {err("checkout")}
      </div>
      <div className={compact ? "" : "md:col-span-2"}>
        <label htmlFor={`${id}-message`} className={label}>
          Message <span className="normal-case tracking-normal opacity-70">(optional)</span>
        </label>
        <textarea id={`${id}-message`} name="message" rows={3} value={form.message} onChange={set("message")} className={`${input} resize-none`} />
      </div>
      <div className={`flex flex-col items-start gap-4 sm:flex-row sm:items-center ${compact ? "" : "md:col-span-2"}`}>
        <MagneticButton type="submit" variant={dark ? "light" : "copper"} size="lg">
          <Icon name="whatsapp" className="h-5 w-5" /> Send via WhatsApp
        </MagneticButton>
        <p className={`text-sm ${dark ? "text-sand/80" : "text-muted"}`}>{contact.formNote}</p>
      </div>
    </form>
  );
}
