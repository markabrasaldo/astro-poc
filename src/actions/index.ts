import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  postConsultation: defineAction({
    accept: "form",
    input: z.object({
      fname: z.string().nonempty("First name is required"),
      lname: z.string().nonempty("Last name is required"),
      email: z
        .string()
        .nonempty("Email is required")
        .email("Invalid email address"),
      contactNumber: z
        .string()
        .nonempty("Contact number is required")
        .regex(/^\d+$/, "Contact number must contain only digits"),
      company: z.string().nonempty("Company name is required"),
    }),
    handler: async (input) => {
      try {
        const response = await fetch("https://api.restful-api.dev/objects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${input.fname} ${input.lname}`,
            data: {
              email: input.email,
              contactNumber: input.contactNumber,
              company: input.company,
            },
          }),
        });

        console.log("response", response);

        const result = await response.json();

        console.log("result", result);

        if (!response.ok) {
          throw new Error(result.message || "External API request failed.");
        }

        return {
          formData: input,
          message: `Thank you for reaching us, ${input.fname}. References ID: ${result.id}`,
        };
      } catch (err) {
        return {
          error: {
            message:
              err instanceof Error ? err.message : "Something went wrong.",
          },
        };
      }
    },
  }),
};
