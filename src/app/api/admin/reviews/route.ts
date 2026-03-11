import { NextRequest } from "next/server"
import { successResponse, errorResponse, requireAdmin } from "@/lib/auth-helpers"
import { getPendingReviews, approveReview, rejectReview } from "@/services/review-service"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50)
    const offset = parseInt(searchParams.get("offset") || "0")

    const reviews = await getPendingReviews(limit, offset)
    return successResponse({ reviews })
  } catch (error: any) {
    if (error?.name === "AuthError") {
      return errorResponse(error.message, error.statusCode || 401)
    }
    console.error("Error fetching pending reviews:", error)
    return errorResponse("Failed to fetch reviews", 500)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin(request)

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
  } catch (error: any) {
    if (error?.name === "AuthError") {
      return errorResponse(error.message, error.statusCode || 401)
    }
    console.error("Error updating review:", error)
    return errorResponse("Failed to update review", 500)
  }
}
