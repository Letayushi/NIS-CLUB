"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { User, LogOut, Settings, Shield, Menu } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">N</span>
              </div>
              <span className="text-xl font-semibold">NIS CLUBS</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {user && (
                <Link
                  href="/profile"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Профиль
                </Link>
              )}
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Все клубы
              </Link>
              <Link
                href="/community"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Комьюнити
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                О нас
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link href="/admin" className="hidden md:block">
                    <Button variant="ghost" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Админ
                    </Button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="h-4 w-4 mr-2" />
                        Профиль
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile#settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Настройки
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Меню</SheetTitle>
                      <SheetDescription>Навигация по сайту и настройки профиля</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-6">
                      <div className="px-2 py-2 border-b">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Link
                        href="/"
                        className="text-sm font-medium px-2 py-2 hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Все клубы
                      </Link>
                      <Link
                        href="/community"
                        className="text-sm font-medium px-2 py-2 hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Комьюнити
                      </Link>
                      <Link
                        href="/about"
                        className="text-sm font-medium px-2 py-2 hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        О нас
                      </Link>
                      <Link
                        href="/profile"
                        className="text-sm font-medium px-2 py-2 hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2 inline" />
                        Профиль
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="text-sm font-medium px-2 py-2 hover:bg-accent rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Shield className="h-4 w-4 mr-2 inline" />
                          Админ
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        className="justify-start px-2"
                        onClick={() => {
                          logout()
                          setMobileMenuOpen(false)
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Выйти
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden md:block">
                  <Button size="sm">Войти</Button>
                </Link>
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Меню</SheetTitle>
                      <SheetDescription>Навигация по сайту</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-6">
                      <Link
                        href="/"
                        className="text-sm font-medium px-2 py-2 hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Все клубы
                      </Link>
                      <Link
                        href="/community"
                        className="text-sm font-medium px-2 py-2 hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Комьюнити
                      </Link>
                      <Link
                        href="/about"
                        className="text-sm font-medium px-2 py-2 hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        О нас
                      </Link>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button size="sm" className="w-full">
                          Войти
                        </Button>
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
