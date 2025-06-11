"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Users, Clock, Star, ArrowLeft, UserCheck, MessageSquare } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  time: string | null
  location: string | null
  capacity: number
  organizer_id: string
  status: string
  profiles: {
    full_name: string | null
  }
  registrations: {
    id: string
    user_id: string
    status: string
  }[]
  feedback: {
    id: string
    rating: number
    comment: string | null
    profiles: {
      full_name: string | null
    }
  }[]
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackComment, setFeedbackComment] = useState("")
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  useEffect(() => {
    async function loadEvent() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        const { data, error } = await supabase
          .from("events")
          .select(`
            *,
            profiles:organizer_id (full_name),
            registrations (id, user_id, status),
            feedback (
              id,
              rating,
              comment,
              profiles:user_id (full_name)
            )
          `)
          .eq("id", params.id)
          .single()

        if (error) throw error
        setEvent(data)
      } catch (error) {
        console.error("Error loading event:", error)
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        })
        router.push("/events")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadEvent()
    }
  }, [params.id, router, toast])

  const isRegistered = user && event?.registrations.some((reg) => reg.user_id === user.id && reg.status === "confirmed")

  const isOrganizer = user && event?.organizer_id === user.id

  const isPastEvent = event && new Date(event.date) < new Date()

  const hasGivenFeedback =
    user && event?.feedback.some((fb) => fb.profiles && Object.values(fb.profiles).includes(user.id))

  const handleRegister = async () => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    if (!event) return

    setRegistering(true)

    try {
      const { error } = await supabase.from("registrations").insert({
        event_id: event.id,
        user_id: user.id,
      })

      if (error) throw error

      toast({
        title: "Registration Successful!",
        description: "You have been registered for this event.",
      })

      // Refresh event data
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for event",
        variant: "destructive",
      })
    } finally {
      setRegistering(false)
    }
  }

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !event) return

    setSubmittingFeedback(true)

    try {
      const { error } = await supabase.from("feedback").insert({
        event_id: event.id,
        user_id: user.id,
        rating: feedbackRating,
        comment: feedbackComment || null,
      })

      if (error) throw error

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your feedback.",
      })

      // Refresh event data
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive",
      })
    } finally {
      setSubmittingFeedback(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h2>
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const averageRating =
    event.feedback.length > 0 ? event.feedback.reduce((sum, fb) => sum + fb.rating, 0) / event.feedback.length : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/events">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">Organized by {event.profiles?.full_name || "Unknown"}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={event.status === "active" ? "default" : "secondary"}>{event.status}</Badge>
              {averageRating > 0 && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{averageRating.toFixed(1)}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{event.description}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {event.time && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{event.time}</span>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>
                      {event.registrations.filter((r) => r.status === "confirmed").length} / {event.capacity} registered
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Section */}
            {event.feedback.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Feedback & Reviews</span>
                  </CardTitle>
                  <CardDescription>
                    {event.feedback.length} review{event.feedback.length !== 1 ? "s" : ""} • Average rating:{" "}
                    {averageRating.toFixed(1)}/5
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.feedback.map((feedback) => (
                      <div key={feedback.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{feedback.profiles?.full_name || "Anonymous"}</span>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {feedback.comment && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{feedback.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Registration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {event.registrations.filter((r) => r.status === "confirmed").length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">of {event.capacity} spots filled</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (event.registrations.filter((r) => r.status === "confirmed").length / event.capacity) * 100,
                        100,
                      )}%`,
                    }}
                  ></div>
                </div>

                {!isPastEvent && (
                  <>
                    {isRegistered ? (
                      <div className="text-center">
                        <Badge variant="default" className="mb-2">
                          ✓ Registered
                        </Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400">You're registered for this event</p>
                      </div>
                    ) : (
                      <Button
                        onClick={handleRegister}
                        disabled={
                          registering ||
                          event.registrations.filter((r) => r.status === "confirmed").length >= event.capacity
                        }
                        className="w-full"
                      >
                        {registering
                          ? "Registering..."
                          : event.registrations.filter((r) => r.status === "confirmed").length >= event.capacity
                            ? "Event Full"
                            : "Register Now"}
                      </Button>
                    )}
                  </>
                )}

                {isPastEvent && isRegistered && !hasGivenFeedback && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Leave Feedback</h4>
                    <form onSubmit={handleSubmitFeedback} className="space-y-3">
                      <div>
                        <Label>Rating</Label>
                        <div className="flex items-center space-x-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setFeedbackRating(i + 1)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  i < feedbackRating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="comment">Comment (optional)</Label>
                        <Textarea
                          id="comment"
                          placeholder="Share your experience..."
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <Button type="submit" disabled={submittingFeedback} className="w-full">
                        {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                      </Button>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {isOrganizer && (
              <Card>
                <CardHeader>
                  <CardTitle>Organizer Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/events/${event.id}/edit`}>
                    <Button variant="outline" className="w-full">
                      Edit Event
                    </Button>
                  </Link>
                  <Link href={`/events/${event.id}/registrations`}>
                    <Button variant="outline" className="w-full">
                      View Registrations
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
