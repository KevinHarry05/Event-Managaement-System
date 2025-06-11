"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Users, Star, BarChart3, Search } from "lucide-react"
import Link from "next/link"
import { EventList } from "@/components/event-list"
import { PageTransition } from "@/components/page-transition"
import { getCategories, getStats } from "@/lib/api"
import { getCurrentUser } from "@/lib/auth"

interface Category {
  id: string
  name: string
  color: string
  icon: string
}

interface Stats {
  totalEvents: number
  totalUsers: number
  averageRating: number
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<Stats>({ totalEvents: 0, totalUsers: 0, averageRating: 0 })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      // Check if user is logged in
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      // Load categories
      const categoriesData = await getCategories()
      setCategories(categoriesData)

      // Load stats
      const statsData = await getStats()
      setStats(statsData)
    }

    loadData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // This would typically navigate to a search results page
    console.log("Searching for:", searchQuery)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
          <div className="relative container mx-auto px-4 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Discover Amazing{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Events
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Find, create, and manage events with ease. Join thousands of event enthusiasts and never miss out on
                amazing experiences.
              </p>

              {/* Search Bar */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onSubmit={handleSearch}
                className="max-w-2xl mx-auto mb-8"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search events, locations, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg rounded-full border-0 shadow-lg bg-white dark:bg-gray-800"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8"
                  >
                    Search
                  </Button>
                </div>
              </motion.form>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                {user ? (
                  <>
                    <Link href="/events">
                      <Button size="lg" className="text-lg px-8 py-4 rounded-full shadow-lg">
                        Explore Events
                      </Button>
                    </Link>
                    <Link href="/events/create">
                      <Button size="lg" variant="outline" className="text-lg px-8 py-4 rounded-full">
                        Create Event
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signup">
                      <Button size="lg" className="text-lg px-8 py-4 rounded-full shadow-lg">
                        Get Started Free
                      </Button>
                    </Link>
                    <Link href="/events">
                      <Button size="lg" variant="outline" className="text-lg px-8 py-4 rounded-full">
                        Browse Events
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            >
              <div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stats.totalEvents}+</div>
                <div className="text-gray-600 dark:text-gray-400">Active Events</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{stats.totalUsers}+</div>
                <div className="text-gray-600 dark:text-gray-400">Happy Users</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stats.averageRating.toFixed(1)}★
                </div>
                <div className="text-gray-600 dark:text-gray-400">Average Rating</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore by Category</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover events that match your interests from our diverse range of categories
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedCategory === category.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: category.color + "20" }}
                      >
                        <Calendar className="h-6 w-6" style={{ color: category.color }} />
                      </div>
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800/30">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedCategory ? "Category Events" : "Featured Events"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {selectedCategory ? "Events in your selected category" : "Hand-picked events that you shouldn't miss"}
              </p>
            </motion.div>

            <EventList limit={6} categoryId={selectedCategory || undefined} featured={!selectedCategory} />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link href="/events">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  View All Events
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose EventHub?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Everything you need to discover, create, and manage amazing events
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Calendar,
                  title: "Smart Calendar",
                  description: "Interactive calendar with heatmap analytics to find the best events",
                  color: "text-blue-600",
                },
                {
                  icon: Users,
                  title: "Easy Registration",
                  description: "One-click registration with instant confirmation and QR codes",
                  color: "text-green-600",
                },
                {
                  icon: Star,
                  title: "Reviews & Ratings",
                  description: "Honest feedback from attendees to help you choose the best events",
                  color: "text-yellow-600",
                },
                {
                  icon: BarChart3,
                  title: "Analytics Dashboard",
                  description: "Comprehensive insights for organizers to track event performance",
                  color: "text-purple-600",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <feature.icon className={`h-12 w-12 ${feature.color} mx-auto mb-4`} />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of event enthusiasts and organizers who trust EventHub for their event needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-4 rounded-full">
                    Sign Up Free
                  </Button>
                </Link>
                <Link href="/events">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 rounded-full border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Explore Events
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
