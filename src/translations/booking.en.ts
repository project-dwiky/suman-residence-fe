export const bookingEn = {
  form: {
    title: "Book Room",
    personalInfo: "Personal Information",
    rentalDetails: "Rental Details",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    phoneNumber: "Phone Number",
    phoneNumberPlaceholder: "Enter your phone number",
    email: "Email",
    emailPlaceholder: "Enter your email address",
    startDate: "Start Date",
    endDate: "End Date",
    durationType: "Rental Period",
    weeklyOption: "Weekly",
    monthlyOption: "Monthly", 
    semesterOption: "Semester (6 months)",
    yearlyOption: "Yearly",
    additionalNotes: "Additional Notes",
    additionalNotesPlaceholder: "Any special requests or notes...",
    submitButton: "Submit Booking Request",
    submittingButton: "Submitting...",
    closeButton: "Close",
    backButton: "Back"
  },
  pricing: {
    title: "Pricing Information",
    weekly: "Weekly",
    monthly: "Monthly",
    semester: "Semester (6 months)",
    yearly: "Yearly",
    selectedPeriod: "Selected Period",
    totalPrice: "Total Price"
  },
  validation: {
    nameRequired: "Full name is required",
    phoneRequired: "Phone number is required",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    startDateRequired: "Start date is required",
    endDateRequired: "End date is required",
    endDateInvalid: "End date must be after start date"
  },
  success: {
    title: "Booking Request Submitted!",
    message: "Your booking request has been submitted successfully. We will contact you soon to confirm your reservation.",
    contactInfo: "You can also contact us directly:",
    whatsapp: "WhatsApp",
    phone: "Phone",
    email: "Email"
  },
  error: {
    title: "Booking Failed",
    message: "There was an error submitting your booking request. Please try again or contact us directly.",
    tryAgain: "Try Again",
    contactUs: "Contact Us"
  }
};

export type BookingTranslationKeys = typeof bookingEn;
