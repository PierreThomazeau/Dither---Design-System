"use client";

import { useId } from "react";

import { Button } from "@/registry/dither/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/dither/ui/card";
import { Input } from "@/registry/dither/ui/input";
import { Label } from "@/registry/dither/ui/label";

export default function CardDemo() {
  const id = useId();
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Log in to your account</CardTitle>
        <CardDescription>Enter your email below to log in.</CardDescription>
        <CardAction>
          <Button variant="link" size="sm">Sign up</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${id}-email`}>Email</Label>
          <Input id={`${id}-email`} type="email" placeholder="you@lumen.finance" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${id}-password`}>Password</Label>
            <a href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">Forgot it?</a>
          </div>
          <Input id={`${id}-password`} type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex-col">
        <Button className="w-full">Log in</Button>
        <Button variant="outline" className="w-full">Log in with SSO</Button>
      </CardFooter>
    </Card>
  );
}
