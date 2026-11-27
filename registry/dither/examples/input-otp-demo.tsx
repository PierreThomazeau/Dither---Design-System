"use client";

import * as React from "react";

import { MomentSweep } from "@/registry/dither/lib/moment-sweep";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/registry/dither/ui/input-otp";
import { toast } from "@/registry/dither/ui/toast";

export default function InputOTPDemo() {
  const [done, setDone] = React.useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <InputOTP
        maxLength={6}
        aria-label="Verification code"
        onComplete={() => {
          setDone((n) => n + 1);
          toast.success("Code verified");
        }}
      >
        <InputOTPGroup>
          <MomentSweep play={done} direction="right" />
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <MomentSweep play={done} direction="right" />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-muted-foreground">Type any 6 digits.</p>
    </div>
  );
}
