"use client"

import { Button } from "../ui/button"

export function Header() {

  return (
    <header className="flex items-center gap-2 py-4">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="ml-auto flex items-center gap-2">
          <Button size="lg" className="hidden sm:flex">
            Sign Up
          </Button>
        </div>
      </div>
    </header>

  )
}
