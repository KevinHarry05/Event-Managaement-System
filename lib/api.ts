import {
  mockEvents,
  mockCategories,
  mockUsers,
  mockRegistrations,
  mockFeedback,
  mockNotifications,
  type Event,
  type Registration,
  type Feedback,
} from "./mock-data"

// Events API
export async function getEvents(filters?: {
  limit?: number
  categoryId?: string
  searchQuery?: string
  featured?: boolean
  organizerId?: string
}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  let events = [...mockEvents]

  // Apply filters
  if (filters?.categoryId) {
    events = events.filter((event) => event.category_id === filters.categoryId)
  }

  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    events = events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query) ||
        event.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  if (filters?.featured) {
    events = events.filter((event) => event.is_featured)
  }

  if (filters?.organizerId) {
    events = events.filter((event) => event.organizer_id === filters.organizerId)
  }

  // Filter only active events and future dates
  events = events.filter((event) => event.status === "active" && new Date(event.date) >= new Date())

  // Sort by date
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Apply limit
  if (filters?.limit) {
    events = events.slice(0, filters.limit)
  }

  // Add related data
  return events.map((event) => ({
    ...event,
    organizer: mockUsers.find((user) => user.id === event.organizer_id),
    category: mockCategories.find((cat) => cat.id === event.category_id),
    registrations: mockRegistrations.filter((reg) => reg.event_id === event.id),
    feedback: mockFeedback
      .filter((fb) => fb.event_id === event.id)
      .map((fb) => ({
        ...fb,
        user: mockUsers.find((user) => user.id === fb.user_id),
      })),
  }))
}

export async function getEvent(id: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const event = mockEvents.find((e) => e.id === id)
  if (!event) {
    throw new Error("Event not found")
  }

  return {
    ...event,
    organizer: mockUsers.find((user) => user.id === event.organizer_id),
    category: mockCategories.find((cat) => cat.id === event.category_id),
    registrations: mockRegistrations.filter((reg) => reg.event_id === event.id),
    feedback: mockFeedback
      .filter((fb) => fb.event_id === event.id)
      .map((fb) => ({
        ...fb,
        user: mockUsers.find((user) => user.id === fb.user_id),
      })),
  }
}

export async function createEvent(eventData: Omit<Event, "id" | "created_at">) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newEvent: Event = {
    ...eventData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  }

  mockEvents.push(newEvent)
  return newEvent
}

export async function updateEvent(id: string, updates: Partial<Event>) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const eventIndex = mockEvents.findIndex((e) => e.id === id)
  if (eventIndex === -1) {
    throw new Error("Event not found")
  }

  mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...updates }
  return mockEvents[eventIndex]
}

// Categories API
export async function getCategories() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return [...mockCategories]
}

// Registrations API
export async function registerForEvent(eventId: string, userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if already registered
  const existingRegistration = mockRegistrations.find((reg) => reg.event_id === eventId && reg.user_id === userId)

  if (existingRegistration) {
    throw new Error("Already registered for this event")
  }

  // Check event capacity
  const event = mockEvents.find((e) => e.id === eventId)
  if (!event) {
    throw new Error("Event not found")
  }

  const currentRegistrations = mockRegistrations.filter(
    (reg) => reg.event_id === eventId && reg.status === "confirmed",
  ).length

  if (currentRegistrations >= event.capacity) {
    throw new Error("Event is full")
  }

  const newRegistration: Registration = {
    id: Date.now().toString(),
    event_id: eventId,
    user_id: userId,
    status: "confirmed",
    registered_at: new Date().toISOString(),
  }

  mockRegistrations.push(newRegistration)
  return newRegistration
}

export async function getUserRegistrations(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const userRegistrations = mockRegistrations.filter((reg) => reg.user_id === userId)

  return userRegistrations.map((registration) => ({
    ...registration,
    event: mockEvents.find((event) => event.id === registration.event_id),
  }))
}

// Feedback API
export async function submitFeedback(eventId: string, userId: string, rating: number, comment?: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if feedback already exists
  const existingFeedback = mockFeedback.find((fb) => fb.event_id === eventId && fb.user_id === userId)

  if (existingFeedback) {
    throw new Error("Feedback already submitted for this event")
  }

  const newFeedback: Feedback = {
    id: Date.now().toString(),
    event_id: eventId,
    user_id: userId,
    rating,
    comment,
    created_at: new Date().toISOString(),
  }

  mockFeedback.push(newFeedback)
  return newFeedback
}

// Notifications API
export async function getUserNotifications(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  return mockNotifications
    .filter((notification) => notification.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function markNotificationAsRead(notificationId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const notification = mockNotifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

// Stats API
export async function getStats() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const totalEvents = mockEvents.filter((e) => e.status === "active").length
  const totalUsers = mockUsers.length
  const ratings = mockFeedback.map((f) => f.rating)
  const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0

  return {
    totalEvents,
    totalUsers,
    averageRating,
    totalRegistrations: mockRegistrations.length,
  }
}

// Dashboard API
export async function getDashboardData(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const user = mockUsers.find((u) => u.id === userId)
  if (!user) {
    throw new Error("User not found")
  }

  if (user.role === "organizer" || user.role === "admin") {
    // Organizer dashboard
    const userEvents = mockEvents.filter((e) => e.organizer_id === userId)
    const totalRegistrations = mockRegistrations.filter((reg) =>
      userEvents.some((event) => event.id === reg.event_id),
    ).length
    const upcomingEvents = userEvents.filter((e) => e.status === "active" && new Date(e.date) >= new Date()).length

    const eventFeedback = mockFeedback.filter((fb) => userEvents.some((event) => event.id === fb.event_id))
    const averageRating =
      eventFeedback.length > 0 ? eventFeedback.reduce((sum, fb) => sum + fb.rating, 0) / eventFeedback.length : 0

    return {
      totalEvents: userEvents.length,
      totalRegistrations,
      upcomingEvents,
      averageRating,
      recentEvents: userEvents.slice(0, 5).map((event) => ({
        ...event,
        registrations: mockRegistrations.filter((reg) => reg.event_id === event.id),
      })),
    }
  } else {
    // User dashboard
    const userRegistrations = mockRegistrations.filter((reg) => reg.user_id === userId)
    const upcomingEvents = userRegistrations.filter((reg) => {
      const event = mockEvents.find((e) => e.id === reg.event_id)
      return event && event.status === "active" && new Date(event.date) >= new Date()
    }).length

    return {
      totalEvents: 0,
      totalRegistrations: userRegistrations.length,
      upcomingEvents,
      averageRating: 0,
      recentEvents: userRegistrations
        .slice(0, 5)
        .map((reg) => {
          const event = mockEvents.find((e) => e.id === reg.event_id)
          return {
            ...event,
            registrations: mockRegistrations.filter((r) => r.event_id === reg.event_id),
          }
        })
        .filter(Boolean),
    }
  }
}
