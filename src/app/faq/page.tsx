import { FaqContent } from "@/components/faq/faq-content";
import { faqSections } from "@/lib/site-content";

export default function FaqPage() {
  return <FaqContent sections={faqSections} />;
}
