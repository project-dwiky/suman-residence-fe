# Invoice Template Instructions

## Setup
1. Place your invoice template file as `invoice-template.docx` in this directory
2. The template should be a Microsoft Word document (.docx format)

## Template Variables
Your template can use the following variables (use curly braces syntax: `{variableName}`):

### Basic Information
- `{guestName}` - Customer/guest name
- `{bookDate}` - Formatted booking date (e.g., "Senin, 15 Januari 2024")
- `{bookDateRaw}` - Raw booking date (YYYY-MM-DD format)
- `{description}` - Service description
- `{invoiceNumber}` - Auto-generated invoice number
- `{invoiceDate}` - Current date when invoice is generated
- `{bookingId}` - Booking ID

### Financial Information
- `{quantity}` - Quantity/amount
- `{priceIdr}` - Formatted price per item (e.g., "Rp 500.000")
- `{priceIdrRaw}` - Raw price per item (number)
- `{totalPrice}` - Formatted total price (e.g., "Rp 1.500.000")
- `{totalPriceRaw}` - Raw total price (number)

### Company Information
- `{companyName}` - "Suman Residence"
- `{companyAddress}` - Company address
- `{companyPhone}` - "0812-3456-7890"

## Example Template Content
```
INVOICE

Invoice No: {invoiceNumber}
Date: {invoiceDate}

Bill To:
{guestName}

Booking Date: {bookDate}
Booking ID: {bookingId}

Description: {description}
Quantity: {quantity}
Price: {priceIdr}
Total: {totalPrice}

---
{companyName}
{companyAddress}
Phone: {companyPhone}
```

## Notes
- Make sure to save your template as .docx format (not .doc)
- Test your template with sample data before using in production
- Keep a backup of your template file