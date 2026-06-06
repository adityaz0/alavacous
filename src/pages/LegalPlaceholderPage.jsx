import { ArrowLeft, FileText } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export default function LegalPlaceholderPage({ type }) {
  return (
    <main className="page-shell grid min-h-[calc(100vh-4rem)] place-items-center py-6 sm:py-8">
      <section className="panel-soft w-full max-w-2xl p-4 sm:p-6">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10 text-cyan">
          <FileText size={20} />
        </span>
        <p className="label mt-6 text-cyan">ALAVACOUS Legal</p>
        <h1 className="mt-3 text-3xl font-bold text-white">{type}</h1>
        <p className="mt-4 text-sm leading-7 text-white/58">
          The complete {type.toLowerCase()} policy is being prepared for the public launch. No policy text is being
          represented as final yet.
        </p>
        <Button as="link" className="mt-7" to="/" variant="secondary">
          <ArrowLeft size={16} />
          Back to Home
        </Button>
      </section>
    </main>
  );
}
