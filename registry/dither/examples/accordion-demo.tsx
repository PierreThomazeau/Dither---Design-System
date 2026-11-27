import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/dither/ui/accordion";

export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="billing" className="w-full max-w-md">
      <AccordionItem value="billing">
        <AccordionTrigger>How does billing work?</AccordionTrigger>
        <AccordionContent>You pay per seat, monthly or yearly. Seats added mid-cycle are prorated on the next invoice.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="export">
        <AccordionTrigger>Can I export my reports?</AccordionTrigger>
        <AccordionContent>Yes: CSV, PDF or a scheduled email to your team every Monday.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="sso">
        <AccordionTrigger>Do you support single sign-on?</AccordionTrigger>
        <AccordionContent>SAML and OIDC are available on the Team plan.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
