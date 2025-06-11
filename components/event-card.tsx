"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Star, Heart, Share2 } from "lucide-react"
import { formatDate, formatTime, formatPrice } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: string
    time?: string
    location?: string
    capacity: number
    price: number
    currency: string
    image_url?: string
    tags: string[]
    organizer?: {
      full_name: string
    }
    category?: {
      name: string
      color: string
    }
    registrations: { id: string }[]
    feedback: { rating: number }[]
  }
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)

  const averageRating =
    event.feedback.length > 0 ? event.feedback.reduce((sum, f) => sum + f.rating, 0) / event.feedback.length : 0

  const registrationCount = event.registrations.length
  const isAlmostFull = registrationCount / event.capacity > 0.8

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description || "",
          url: `${window.location.origin}/events/${event.id}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`)
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/events/${event.id}`}>
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
          {/* Event Image */}
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
            {event.image_url && !imageError ? (
              <Image
                src={event.image_url || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Calendar className="h-12 w-12 text-white opacity-50" />
              </div>
            )}

            {/* Overlay Actions */}
            <div className="absolute top-3 right-3 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Category Badge */}
            {event.category && (
              <div className="absolute top-3 left-3">
                <Badge style={{ backgroundColor: event.category.color }} className="text-white border-0">
                  {event.category.name}
                </Badge>
              </div>
            )}

            {/* Price Badge */}
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-900 font-semibold">
                {formatPrice(event.price, event.currency)}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4 space-y-3">
            {/* Event Title */}
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{event.description}</p>
              )}
            </div>

            {/* Event Details */}
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {formatDate(event.date)}
                  {event.time && ` • ${formatTime(event.time)}`}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {registrationCount}/{event.capacity}
                    {isAlmostFull && <span className="text-orange-500 ml-1">• Almost Full</span>}
                  </span>
                </div>

                {averageRating > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {event.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {event.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{event.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Organizer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500">by {event.organizer?.full_name || "Unknown"}</span>
              <Button size="sm" className="h-7 px-3 text-xs">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
