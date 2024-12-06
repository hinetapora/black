// app/layout.tsx

import { Image } from "@nextui-org/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="relative container mx-auto max-w-7xl z-10 px-6 min-h-[calc(100vh_-_64px_-_108px)] mb-12 flex-grow">
        {children}
      </main>
      <div
        aria-hidden="true"
        className="fixed hidden dark:md:block dark:opacity-70 -bottom-[40%] -left-[20%] z-0"
      >
        <Image removeWrapper alt="background left" src="/gradients/docs-left.png" />
      </div>
      <div
        aria-hidden="true"
        className="fixed hidden dark:md:block dark:opacity-70 -top-[80%] -right-[60%] 2xl:-top-[60%] 2xl:-right-[45%] z-0 rotate-12"
      >
        <Image removeWrapper alt="background right" src="/gradients/docs-right.png" />
      </div>
    </>
  );
}
