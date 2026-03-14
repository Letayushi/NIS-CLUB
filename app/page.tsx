"use client"

import { useState, useMemo, useEffect } from "react"
import { ClubCard } from "@/components/club-card"
import { api } from "@/lib/api"
import type { Club } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.clubs
      .list()
      .then(setClubs)
      .catch(() => setClubs([]))
      .finally(() => setLoading(false))
  }, [])

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(clubs.map((club) => club.city)))
    return uniqueCities.sort()
  }, [clubs])

  const categories = useMemo(() => {
    const allCategories = clubs.flatMap((club) => club.categories)
    const uniqueCategories = Array.from(new Set(allCategories))
    return uniqueCategories.sort()
  }, [clubs])

  const filteredClubs = clubs.filter((club) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      club.name.toLowerCase().includes(query) ||
      club.description.toLowerCase().includes(query) ||
      club.categories.some((cat) => cat.toLowerCase().includes(query))

    const matchesCity = selectedCity === "all" || club.city === selectedCity
    const matchesCategory = selectedCategory === "all" || club.categories.includes(selectedCategory)

    return matchesSearch && matchesCity && matchesCategory
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 text-balance bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
          Все клубы школы
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          Выберите клуб по интересам и присоединяйтесь к сообществу единомышленников
        </p>

        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, описанию или категории..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="city-filter" className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Город
              </Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger id="city-filter">
                  <SelectValue placeholder="Все города" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все города</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="category-filter" className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Направление
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Все направления" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все направления</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </motion.div>

      {filteredClubs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">
            {searchQuery || selectedCity !== "all" || selectedCategory !== "all"
              ? "Клубы не найдены"
              : "Клубы пока не добавлены"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ClubCard club={club} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
