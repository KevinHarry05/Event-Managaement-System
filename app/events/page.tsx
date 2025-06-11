"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, MapPin, DollarSign } from "lucide-react"
import { EventList } from "@/components/event-list"
import { PageTransition } from "@/components/page-transition"
import { getCategories } from "@/lib/api"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface Category {
  id: string
  name: string
  color: string
}

interface Filters {
  categories: string[]
  priceRange: [number, number]
  dateRange: string
  location: string
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: [0, 500],
    dateRange: "all",
    location: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories()
      setCategories(data)
    }
    loadCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search functionality is handled by EventList component
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 500],
      dateRange: "all",
      location: "",
    })
  }

  const activeFiltersCount =
    filters.categories.length +
    (filters.dateRange !== "all" ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0)

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Discover Events</h1>
              <p className="text-gray-600 dark:text-gray-400">Find amazing events happening near you</p>
            </motion.div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="mb-8 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Find Your Perfect Event</span>
                </CardTitle>
                <CardDescription>Search by name, location, or category</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Sheet open={showFilters} onOpenChange={setShowFilters}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="relative">
                          <SlidersHorizontal className="h-4 w-4 mr-2" />
                          Filters
                          {activeFiltersCount > 0 && (
                            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                              {activeFiltersCount}
                            </Badge>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Filter Events</SheetTitle>
                          <SheetDescription>Narrow down your search with these filters</SheetDescription>
                        </SheetHeader>
                        <div className="space-y-6 mt-6">
                          {/* Categories */}
                          <div>
                            <Label className="text-base font-semibold">Categories</Label>
                            <div className="grid grid-cols-1 gap-2 mt-2">
                              {categories.map((category) => (
                                <div key={category.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={category.id}
                                    checked={filters.categories.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setFilters((prev) => ({
                                          ...prev,
                                          categories: [...prev.categories, category.id],
                                        }))
                                      } else {
                                        setFilters((prev) => ({
                                          ...prev,
                                          categories: prev.categories.filter((id) => id !== category.id),
                                        }))
                                      }
                                    }}
                                  />
                                  <Label htmlFor={category.id} className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                                    <span>{category.name}</span>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Price Range */}
                          <div>
                            <Label className="text-base font-semibold">Price Range</Label>
                            <div className="mt-2">
                              <Slider
                                value={filters.priceRange}
                                onValueChange={(value) =>
                                  setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
                                }
                                max={500}
                                step={10}
                                className="w-full"
                              />
                              <div className="flex justify-between text-sm text-gray-500 mt-1">
                                <span>${filters.priceRange[0]}</span>
                                <span>${filters.priceRange[1]}+</span>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div>
                            <Label htmlFor="location" className="text-base font-semibold">
                              Location
                            </Label>
                            <Input
                              id="location"
                              placeholder="Enter city or venue"
                              value={filters.location}
                              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                              className="mt-2"
                            />
                          </div>

                          {/* Clear Filters */}
                          {activeFiltersCount > 0 && (
                            <Button variant="outline" onClick={clearFilters} className="w-full">
                              Clear All Filters
                            </Button>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </form>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {filters.categories.map((categoryId) => {
                      const category = categories.find((c) => c.id === categoryId)
                      return category ? (
                        <Badge key={categoryId} variant="secondary" className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                          <span>{category.name}</span>
                          <button
                            onClick={() =>
                              setFilters((prev) => ({
                                ...prev,
                                categories: prev.categories.filter((id) => id !== categoryId),
                              }))
                            }
                            className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </Badge>
                      ) : null
                    })}
                    {filters.location && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{filters.location}</span>
                        <button
                          onClick={() => setFilters((prev) => ({ ...prev, location: "" }))}
                          className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {(filters.priceRange[0] > 0 || filters.priceRange[1] < 500) && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>
                          ${filters.priceRange[0]} - ${filters.priceRange[1]}
                        </span>
                        <button
                          onClick={() => setFilters((prev) => ({ ...prev, priceRange: [0, 500] }))}
                          className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Events List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <EventList
              searchQuery={searchQuery}
              categoryId={filters.categories.length === 1 ? filters.categories[0] : undefined}
            />
          </motion.div>
        </main>
      </div>
    </PageTransition>
  )
}
