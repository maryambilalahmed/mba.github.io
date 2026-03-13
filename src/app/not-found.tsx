import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="editorial-shell editorial-section text-center">
      <p className="kicker">404</p>
      <h1 className="mt-2 text-4xl text-primary md:text-5xl">Page not found</h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        The page you requested does not exist or has moved. You can continue through the main portfolio sections below.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/research">Research</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/blog">Blog</Link>
        </Button>
      </div>
    </div>
  );
}
