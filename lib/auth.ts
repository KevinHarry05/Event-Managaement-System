import { mockUsers, type User } from "./mock-data"

// Simulate authentication state
let currentUser: User | null = null

export async function signUp(email: string, password: string, fullName: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  const existingUser = mockUsers.find((user) => user.email === email)
  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email,
    full_name: fullName,
    role: "user",
    created_at: new Date().toISOString(),
  }

  // Add to mock users (in real app, this would be saved to database)
  mockUsers.push(newUser)
  currentUser = newUser

  return { user: newUser }
}

export async function signIn(email: string, password: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Find user by email
  const user = mockUsers.find((u) => u.email === email)
  if (!user) {
    throw new Error("Invalid email or password")
  }

  // In a real app, you'd verify the password here
  // For demo purposes, we'll accept any password
  currentUser = user

  return { user }
}

export async function signOut() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  currentUser = null
}

export async function getCurrentUser() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return currentUser
}

export async function getUserProfile(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const user = mockUsers.find((u) => u.id === userId)
  if (!user) {
    throw new Error("User not found")
  }

  return user
}

export async function updateProfile(userId: string, updates: Partial<User>) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const userIndex = mockUsers.findIndex((u) => u.id === userId)
  if (userIndex === -1) {
    throw new Error("User not found")
  }

  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }

  if (currentUser?.id === userId) {
    currentUser = mockUsers[userIndex]
  }

  return mockUsers[userIndex]
}

// Initialize with a demo user for testing
currentUser = mockUsers[1] // Sarah Johnson (organizer)
