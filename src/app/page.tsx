import Link from "next/link"
import { Bus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-6">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2 text-primary">
          <Bus className="h-10 w-10" />
          <span className="text-3xl font-bold tracking-tight">RouteyAI</span>
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          Smart routing. Real-time tracking. Peace of mind.
        </h1>
        <p className="text-balance text-lg text-muted-foreground">
          AI-powered school bus routing built for Qatari private schools.
          Coming soon.
        </p>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/login">School Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#demo">Request a Demo</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
