"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Users } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  time: string | null
  location: string | null
  capacity: number
  registrations: { id: string }[]
}

interface EventsByDate {
  [key: string]: Event[]
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [eventsByDate, setEventsByDate] = useState<EventsByDate>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from("events")
          .select(`
            *,
            registrations (id)
          `)
          .eq("status", "active")
          .gte("date", new Date().toISOString().split("T")[0])
          .order("date", { ascending: true })

        if (error) throw error

        setEvents(data || [])

        // Group events by date
        const grouped = (data || []).reduce((acc: EventsByDate, event) => {
          const dateKey = event.date
          if (!acc[dateKey]) {
            acc[dateKey] = []
          }
          acc[dateKey].push(event)
          return acc
        }, {})

        setEventsByDate(grouped)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Get events for selected date
  const selectedDateKey = selectedDate?.toISOString().split("T")[0]
  const selectedDateEvents = selectedDateKey ? eventsByDate[selectedDateKey] || [] : []

  // Create heatmap data for calendar
  const getEventCountForDate = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0]
    return eventsByDate[dateKey]?.length || 0
  }

  // Custom day content to show event indicators
  const dayContent = (date: Date) => {
    const eventCount = getEventCountForDate(date)
    const isToday = date.toDateString() === new Date().toDateString()

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={isToday ? "font-bold" : ""}>{date.getDate()}</span>
        {eventCount > 0 && (
          <div className="absolute -top-1 -right-1">
            <div
              className={`w-2 h-2 rounded-full ${
                eventCount === 1
                  ? "bg-blue-400"
                  : eventCount === 2
                    ? "bg-blue-500"
                    : eventCount >= 3
                      ? "bg-blue-600"
                      : "bg-gray-300"
              }`}
            />
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event Calendar</h1>
              <p className="text-gray-600 dark:text-gray-400">View events with heatmap visualization</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/events">
                <Button variant="outline">Browse Events</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5" />
                  <span>Event Calendar</span>
                </CardTitle>
                <CardDescription>Click on a date to view events. Dots indicate event frequency.</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  components={{
                    DayContent: ({ date }) => dayContent(date),
                  }}
                />

                {/* Legend */}
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Event frequency:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span>1 event</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>2 events</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>3+ events</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Events */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Select a Date"}
                </CardTitle>
                <CardDescription>
                  {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? "s" : ""} scheduled
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => (
                      <div
                        key={event.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold line-clamp-2">{event.title}</h3>
                          <Badge variant="secondary">
                            {event.registrations.length}/{event.capacity}
                          </Badge>
                        </div>

                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                          {event.time && (
                            <div className="flex items-center space-x-1">
                              <CalendarDays className="h-3 w-3" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{event.registrations.length} registered</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Link href={`/events/${event.id}`}>
                            <Button size="sm" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No events scheduled for this date</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
