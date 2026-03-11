import { db } from "@/lib/db"

export interface CreateReviewData {
  orderId?: string
  userId?: string
  name: string
  email: string
  rating: number
  title: string
  text: string
  destination?: string
  countryCode?: string
}

export async function createReview(data: CreateReviewData) {
  // Check if order exists and belongs to the email (for verification)
  let verified = false
  if (data.orderId) {
    const order = await db.order.findUnique({
      where: { id: data.orderId },
      select: { email: true, status: true },
    })
    if (order && order.email === data.email && order.status === "COMPLETED") {
      verified = true
    }
  }

  return db.review.create({
    data: {
      ...data,
      verified,
      approved: false,
    },
  })
}

export async function getApprovedReviews(options?: {
  destination?: string
  limit?: number
  offset?: number
}) {
  const { destination, limit = 20, offset = 0 } = options || {}

  const where: any = { approved: true }
  if (destination) {
    where.destination = { contains: destination }
  }

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.review.count({ where }),
  ])

  return { reviews, total }
}

export async function getReviewStats() {
  const reviews = await db.review.findMany({
    where: { approved: true },
    select: { rating: true },
  })

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  }

  const total = reviews.length
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  for (const r of reviews) {
    distribution[r.rating as keyof typeof distribution]++
  }

  return {
    averageRating: Math.round((sum / total) * 10) / 10,
    totalReviews: total,
    distribution,
  }
}

export async function getPendingReviews(limit = 20, offset = 0) {
  return db.review.findMany({
    where: { approved: false },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  })
}

export async function approveReview(id: string) {
  return db.review.update({
    where: { id },
    data: { approved: true },
  })
}

export async function rejectReview(id: string) {
  return db.review.update({
    where: { id },
    data: { approved: false },
  })
}
