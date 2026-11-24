import { Button } from "@/registry/dither/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardInset, CardTitle } from "@/registry/dither/ui/card";

export default function CardSizes() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Small card</CardTitle>
          <CardDescription>Tighter padding for dense layouts.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">Set <code className="font-mono text-xs">size=&quot;sm&quot;</code> on the card.</CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">Action</Button>
        </CardFooter>
      </Card>
      <Card variant="inset" size="sm">
        <CardHeader>
          <CardTitle>Inset, small</CardTitle>
        </CardHeader>
        <CardInset className="text-sm">Content sits on the inner surface.</CardInset>
      </Card>
    </div>
  );
}
