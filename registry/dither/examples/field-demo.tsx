"use client";

import * as React from "react";

import { Button } from "@/registry/dither/ui/button";
import { Field, FieldControl, FieldLabel } from "@/registry/dither/ui/field";
import { Input } from "@/registry/dither/ui/input";

export default function FieldDemo() {
  const [email, setEmail] = React.useState("lea@northwind");
  const [error, setError] = React.useState<string | undefined>();
  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setError(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? undefined : "Enter a full email address, like lea@northwind.com.");
      }}
    >
      <Field description="We send invoices and reports here." error={error}>
        <FieldLabel>Work email</FieldLabel>
        <FieldControl>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FieldControl>
      </Field>
      <Button type="submit" className="self-start">Save</Button>
    </form>
  );
}
