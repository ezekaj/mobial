import { NextRequest } from "next/server"
import { successResponse, errorResponse, requireAuth } from "@/lib/auth-helpers"
import { getPendingReviews, approveReview, rejectReview } from "@/services/review-service"

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return errorResponse("Unauthorized", 401)
    }
    if (authResult.user.role !== "ADMIN") {
      return errorResponse("Admin access required", 403)
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50)
    const offset = parseInt(searchParams.get("offset") || "0")

    const reviews = await getPendingReviews(limit, offset)
    return successResponse({ reviews })
  } catch (error) {
    console.error("Error fetching pending reviews:", error)
    return errorResponse("Failed to fetch reviews", 500)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return errorResponse("Unauthorized", 401)
    }
    if (authResult.user.role !== "ADMIN") {
      return errorResponse("Admin access required", 403)
    }

    const body = await request.json()
    const { reviewId, action } = body

    if (!reviewId || !action) {
      return errorResponse("reviewId and action are required", 400)
    }

    if (action === "approve") {
      await approveReview(reviewId)
      return successResponse({ message: "Review approved" })
    } else if (action === "reject") {
      await rejectReview(reviewId)
      return successResponse({ message: "Review rejected" })
    } else {
      return errorResponse("Invalid action. Use 'approve' or 'reject'", 400)
    }
  } catch (error) {
    console.error("Error updating review:", error)
    return errorResponse("Failed to update review", 500)
  }
}
