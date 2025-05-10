"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

export async function submitContactForm(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    // Extract form data
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    }

    // Validate form data
    const result = contactSchema.safeParse(rawData)

    if (!result.success) {
      // Return validation errors
      const errorMessage = result.error.errors.map((err) => `${err.path}: ${err.message}`).join(", ")
      return {
        success: false,
        message: `Validation failed: ${errorMessage}`,
      }
    }

    const validatedData = result.data

    // Process the form data (e.g., send email, store in database)
    // This is a placeholder for your actual implementation
    console.log("Processing contact form submission:", validatedData)

    // Simulate API call or database operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Revalidate the contact page to reflect the submission
    revalidatePath("/")

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "An error occurred while submitting the form. Please try again later.",
    }
  }
}
