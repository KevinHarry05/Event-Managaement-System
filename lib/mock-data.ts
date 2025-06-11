export interface User {
  id: string
  email: string
  full_name: string
  role: "user" | "organizer" | "admin"
  avatar_url?: string
  bio?: string
  phone?: string
  location?: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time?: string
  end_time?: string
  location?: string
  capacity: number
  price: number
  currency: string
  category_id: string
  organizer_id: string
  image_url?: string
  tags: string[]
  status: "active" | "cancelled" | "completed" | "draft"
  is_featured: boolean
  check_in_code?: string
  created_at: string
}

export interface Registration {
  id: string
  event_id: string
  user_id: string
  status: "confirmed" | "cancelled" | "waitlist" | "checked_in"
  registered_at: string
}

export interface Feedback {
  id: string
  event_id: string
  user_id: string
  rating: number
  comment?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error" | "event_reminder" | "registration_confirmed"
  read: boolean
  created_at: string
}

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Technology",
    description: "Tech conferences, workshops, and meetups",
    color: "#3B82F6",
    icon: "laptop",
  },
  {
    id: "2",
    name: "Music",
    description: "Concerts, festivals, and music events",
    color: "#EF4444",
    icon: "music",
  },
  {
    id: "3",
    name: "Sports",
    description: "Sports events, tournaments, and fitness",
    color: "#10B981",
    icon: "trophy",
  },
  {
    id: "4",
    name: "Food & Drink",
    description: "Food festivals, wine tastings, and culinary events",
    color: "#F59E0B",
    icon: "utensils",
  },
  {
    id: "5",
    name: "Business",
    description: "Networking, conferences, and professional events",
    color: "#8B5CF6",
    icon: "briefcase",
  },
  {
    id: "6",
    name: "Arts & Culture",
    description: "Art exhibitions, theater, and cultural events",
    color: "#EC4899",
    icon: "palette",
  },
  {
    id: "7",
    name: "Education",
    description: "Workshops, seminars, and learning events",
    color: "#06B6D4",
    icon: "book-open",
  },
  {
    id: "8",
    name: "Health & Wellness",
    description: "Fitness, yoga, and wellness events",
    color: "#84CC16",
    icon: "heart",
  },
]

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@eventhub.com",
    full_name: "Admin User",
    role: "admin",
    bio: "Platform administrator",
    location: "San Francisco, CA",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "sarah.organizer@example.com",
    full_name: "Sarah Johnson",
    role: "organizer",
    bio: "Event organizer specializing in tech conferences and workshops",
    location: "New York, NY",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    email: "mike.user@example.com",
    full_name: "Mike Chen",
    role: "user",
    bio: "Tech enthusiast and event attendee",
    location: "Austin, TX",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    email: "emma.organizer@example.com",
    full_name: "Emma Davis",
    role: "organizer",
    bio: "Music event organizer and festival curator",
    location: "Los Angeles, CA",
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Mock Events
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "AI & Machine Learning Summit 2024",
    description:
      "Join industry leaders and experts for a comprehensive exploration of the latest trends in artificial intelligence and machine learning. This summit features keynote speakers, hands-on workshops, and networking opportunities.",
    date: "2024-03-15",
    time: "09:00",
    end_time: "18:00",
    location: "Moscone Center, San Francisco",
    capacity: 500,
    price: 299.0,
    currency: "USD",
    category_id: "1",
    organizer_id: "2",
    image_url: "/placeholder.svg?height=300&width=500",
    tags: ["AI", "Machine Learning", "Technology", "Conference"],
    status: "active",
    is_featured: true,
    check_in_code: "AI2024SF",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description:
      "Three days of incredible music featuring top artists from around the world. Food trucks, art installations, and camping available.",
    date: "2024-06-20",
    time: "14:00",
    end_time: "23:00",
    location: "Golden Gate Park, San Francisco",
    capacity: 5000,
    price: 149.0,
    currency: "USD",
    category_id: "2",
    organizer_id: "4",
    image_url: "/placeholder.svg?height=300&width=500",
    tags: ["Music", "Festival", "Outdoor", "Summer"],
    status: "active",
    is_featured: true,
    check_in_code: "MUSIC2024",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    title: "Startup Pitch Competition",
    description:
      "Watch innovative startups pitch their ideas to a panel of investors. Network with entrepreneurs and industry professionals.",
    date: "2024-04-10",
    time: "18:00",
    end_time: "21:00",
    location: "TechCrunch Disrupt Stage, SF",
    capacity: 200,
    price: 0.0,
    currency: "USD",
    category_id: "5",
    organizer_id: "2",
    image_url: "/placeholder.svg?height=300&width=500",
    tags: ["Startup", "Pitch", "Networking", "Free"],
    status: "active",
    is_featured: false,
    check_in_code: "PITCH2024",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    title: "Gourmet Food & Wine Tasting",
    description:
      "Experience exquisite cuisine paired with premium wines. Meet renowned chefs and learn about wine pairing techniques.",
    date: "2024-05-05",
    time: "19:00",
    end_time: "22:00",
    location: "Napa Valley Wine Country",
    capacity: 80,
    price: 125.0,
    currency: "USD",
    category_id: "4",
    organizer_id: "4",
    image_url: "/placeholder.svg?height=300&width=500",
    tags: ["Food", "Wine", "Tasting", "Gourmet"],
    status: "active",
    is_featured: false,
    check_in_code: "WINE2024",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    title: "Marathon Training Workshop",
    description:
      "Comprehensive training session for marathon preparation. Includes nutrition guidance, training plans, and injury prevention.",
    date: "2024-04-20",
    time: "08:00",
    end_time: "12:00",
    location: "Central Park, New York",
    capacity: 100,
    price: 45.0,
    currency: "USD",
    category_id: "3",
    organizer_id: "2",
    image_url: "/placeholder.svg?height=300&width=500",
    tags: ["Marathon", "Training", "Fitness", "Health"],
    status: "active",
    is_featured: false,
    check_in_code: "RUN2024",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    title: "Contemporary Art Exhibition Opening",
    description: "Opening night for our latest contemporary art exhibition featuring emerging and established artists.",
    date: "2024-03-30",
    time: "18:00",
    end_time: "21:00",
    location: "Museum of Modern Art, NYC",
    capacity: 300,
    price: 25.0,
    currency: "USD",
    category_id: "6",
    organizer_id: "4",
    image_url: "/placeholder.svg?height=300&width=500",
    tags: ["Art", "Exhibition", "Contemporary", "Culture"],
    status: "active",
    is_featured: true,
    check_in_code: "ART2024",
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Mock Registrations
export const mockRegistrations: Registration[] = [
  {
    id: "1",
    event_id: "1",
    user_id: "3",
    status: "confirmed",
    registered_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    event_id: "2",
    user_id: "3",
    status: "confirmed",
    registered_at: "2024-01-16T00:00:00Z",
  },
  {
    id: "3",
    event_id: "3",
    user_id: "3",
    status: "confirmed",
    registered_at: "2024-01-17T00:00:00Z",
  },
  {
    id: "4",
    event_id: "1",
    user_id: "4",
    status: "confirmed",
    registered_at: "2024-01-18T00:00:00Z",
  },
]

// Mock Feedback
export const mockFeedback: Feedback[] = [
  {
    id: "1",
    event_id: "1",
    user_id: "3",
    rating: 5,
    comment: "Incredible event! The speakers were world-class and the networking opportunities were amazing.",
    created_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "2",
    event_id: "2",
    user_id: "3",
    rating: 4,
    comment: "Great lineup and atmosphere. The food options could be improved but overall fantastic experience.",
    created_at: "2024-01-21T00:00:00Z",
  },
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "1",
    user_id: "3",
    title: "Event Reminder",
    message: "AI & Machine Learning Summit 2024 starts tomorrow!",
    type: "event_reminder",
    read: false,
    created_at: "2024-03-14T00:00:00Z",
  },
  {
    id: "2",
    user_id: "3",
    title: "Registration Confirmed",
    message: "You're registered for Summer Music Festival",
    type: "registration_confirmed",
    read: true,
    created_at: "2024-01-16T00:00:00Z",
  },
]
