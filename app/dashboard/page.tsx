"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Users, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, getUserProfile } from "@/lib/auth"
import Link from "next/link"

interface DashboardStats {
  totalEvents: number
  totalRegistrations: number
  upcomingEvents: number
  averageRating: number
}

interface Event {
  id: string
  title: string
  date: string
  registrations: { id: string }[]
  capacity: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
    averageRating: 0,
  })
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadDashboard() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/auth/signin")
          return
        }

        setUser(currentUser)
        const userProfile = await getUserProfile(currentUser.id)
        setProfile(userProfile)

        // Load dashboard data based on user role
        if (userProfile.role === "organizer" || userProfile.role === "admin") {
          await loadOrganizerStats(currentUser.id)
        } else {
          await loadUserStats(currentUser.id)
        }
      } catch (error) {
        console.error("Error loading dashboard:", error)
        router.push("/auth/signin")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [router])

  async function loadOrganizerStats(userId: string) {
    // Load events created by organizer
    const { data: events } = await supabase
      .from("events")
      .select(`
        *,
        registrations (id),
        feedback (rating)
      `)
      .eq("organizer_id", userId)

    if (events) {
      const totalRegistrations = events.reduce((sum, event) => sum + event.registrations.length, 0)
      const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date()).length
      const ratings = events.flatMap((event) => event.feedback.map((f: any) => f.rating))
      const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

      setStats({
        totalEvents: events.length,
        totalRegistrations,
        upcomingEvents,
        averageRating,
      })

      setRecentEvents(events.slice(0, 5))
    }
  }

  async function loadUserStats(userId: string) {
    // Load user registrations
    const { data: registrations } = await supabase
      .from("registrations")
      .select(`
        *,
        events (
          id,
          title,
          date,
          registrations (id),
          capacity
        )
      `)
      .eq("user_id", userId)

    if (registrations) {
      const upcomingEvents = registrations.filter((reg) => new Date(reg.events.date) >= new Date()).length

      setStats({
        totalEvents: 0,
        totalRegistrations: registrations.length,
        upcomingEvents,
        averageRating: 0,
      })

      setRecentEvents(registrations.map((reg) => reg.events).slice(0, 5))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isOrganizer = profile?.role === "organizer" || profile?.role === "admin"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {profile?.full_name || "User"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isOrganizer ? "Manage your events and track performance" : "View your registered events"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isOrganizer && (
                <Link href="/events/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              )}
              <Link href="/calendar">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isOrganizer ? "Total Events" : "Registered Events"}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isOrganizer ? stats.totalEvents : stats.totalRegistrations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            </CardContent>
          </Card>

          {isOrganizer && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "N/A"}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>{isOrganizer ? "Your Events" : "Your Registered Events"}</CardTitle>
            <CardDescription>
              {isOrganizer ? "Events you have created" : "Events you have registered for"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {event.registrations?.length || 0}/{event.capacity}
                      </Badge>
                      <Link href={`/events/${event.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {isOrganizer ? "No events created yet" : "No events registered yet"}
                </p>
                {isOrganizer && (
                  <Link href="/events/create">
                    <Button className="mt-4">Create Your First Event</Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
