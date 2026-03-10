import { z } from "zod";

export const onboardingSchema = z.object({
    brand_name: z.string().min(1, "Brand name is required"),
    brand_description: z
        .string()
        .min(50, "Brand description must be at least 50 characters")
        .max(300, "Brand description must be at most 300 characters"),
    instagram_url: z.string().url("Must be a valid URL").min(1, "Instagram url is required"),
    logo_url: z.string().url("Must be a valid URL").min(1, "Logo url is required"),
    public_email: z.string().email("Must be a valid email").min(1, "Public email is required"),
    public_phone: z
        .string()
        .regex(/^[0-9]{10,15}$/, "Public phone must be 10 to 15 digits"),
    business_type: z.enum([
        "individual",
        "sole_proprietorship",
        "partnership",
        "pvt_ltd",
        "llp",
    ]),
    legal_business_name: z.string().min(1, "Legal business name is required"),
    pan_number: z
        .string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number format"),
    gst_registered: z.boolean(),
    gst_number: z.string().optional(),
    business_registration_number: z.string().optional(),
    address_line_1: z.string().min(1, "Address line 1 is required"),
    address_line_2: z.string().min(1, "Address line 2 is required"),
    landmark: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^[0-9]{6}$/, "Invalid Pincode format"),
    country: z.string().optional().default("India"),
    account_holder_name: z.string().min(1, "Account holder name is required"),
    account_number: z
        .string()
        .regex(/^[0-9]{9,18}$/, "Account number must be 9 to 18 digits"),
    ifsc_code: z
        .string()
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
    bank_name: z.string().min(1, "Bank name is required"),
    confirm_account_number: z
        .string()
        .regex(/^[0-9]{9,18}$/, "Confirm account number must be 9 to 18 digits"),
    upi_id: z.string().optional(),
    agreed_terms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
    }),
    agreed_commission: z.boolean().refine((val) => val === true, {
        message: "You must agree to the commission structure",
    }),
    agreed_authenticity: z.boolean().refine((val) => val === true, {
        message: "You must agree to the authenticity policy",
    }),
    agreed_return_policy: z.boolean().refine((val) => val === true, {
        message: "You must agree to the return policy",
    }),
}).superRefine((data, ctx) => {
    if (data.gst_registered) {
        if (!data.gst_number || data.gst_number.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "GST number is required when GST registered is selected",
                path: ["gst_number"],
            });
        } else if (
            !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
                data.gst_number
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid GST number format",
                path: ["gst_number"],
            });
        }
    }

    if (data.account_number !== data.confirm_account_number) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Account numbers do not match",
            path: ["confirm_account_number"],
        });
    }
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
