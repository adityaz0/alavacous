import Button from "../components/ui/Button.jsx";

export default function NotFoundPage() {
  return (
    <main className="page-shell grid min-h-[calc(100vh-4rem)] place-items-center py-12 text-center">
      <section className="panel max-w-lg p-8">
        <p className="label text-amber">404</p>
        <h1 className="mt-3 text-3xl font-bold text-white">This page does not exist.</h1>
        <p className="mt-3 text-sm leading-6 text-white/56">Head back to project discovery or the landing page.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button as="link" to="/projects" variant="secondary">
            Browse Projects
          </Button>
          <Button as="link" to="/">
            Home
          </Button>
        </div>
      </section>
    </main>
  );
}
