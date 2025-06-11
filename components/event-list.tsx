"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { EventCard } from "./event-card"
import { LoadingSpinner } from "./loading-spinner"
import { getEvents } from "@/lib/api"
import { Calendar } from "lucide-react"

interface EventListProps {
  limit?: number
  categoryId?: string
  searchQuery?: string
  featured?: boolean
  organizerId?: string
}

export function EventList({ limit, categoryId, searchQuery, featured, organizerId }: EventListProps) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const data = await getEvents({
          limit,
          categoryId,
          searchQuery,
          featured,
          organizerId,
        })
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [limit, categoryId, searchQuery, featured, organizerId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No events found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery ? "Try adjusting your search terms" : "Check back later for upcoming events"}
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  )
}
