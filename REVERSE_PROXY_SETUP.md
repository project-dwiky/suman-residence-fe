# API Reverse Proxy Setup

This document explains how the frontend now acts as a reverse proxy for API calls, eliminating the need for external backend API calls for booking and room functionality.

## Changes Made

### 1. Service Layer Updates
All services now use `/api` routes within the Next.js application instead of calling external backend URLs:

- **RoomService**: Updated to use `/api/rooms` instead of `${BACKEND_URL}/api/rooms`
- **UserBookingService**: Updated to use `/api/bookings` instead of `${BACKEND_URL}/api/bookings`
- **AdminBookingService**: Updated to use `/api/admin/bookings` instead of `${BACKEND_URL}/api/admin/bookings`
- **WhatsAppService**: Updated to use `/api/whatsapp` instead of calling backend directly

### 2. API Routes Structure
The frontend now includes the following API routes:

```
/api/
├── auth/              # Authentication routes
├── rooms/             # Room management
│   ├── route.ts       # GET/POST rooms
│   └── [id]/route.ts  # GET/PUT specific room
├── bookings/          # Booking management
│   ├── route.ts       # GET/POST bookings
│   └── [id]/route.ts  # GET/PUT/DELETE specific booking
├── admin/             # Admin-specific routes
│   ├── rooms/         # Admin room management
│   └── bookings/      # Admin booking management
│       ├── route.ts   # GET all bookings
│       └── [id]/      # Individual booking operations
│           ├── route.ts      # GET/PUT/DELETE booking
│           └── action/route.ts # POST approval/rejection actions
└── whatsapp/          # WhatsApp functionality (proxies to backend)
    ├── status/route.ts
    ├── qrcode/route.ts
    ├── send/route.ts
    └── reset-connection/route.ts
```

### 3. Repository Layer
All API routes use local Firebase repositories instead of making HTTP calls:

- **Room operations**: Use `@/repositories/room.repository.ts`
- **Booking operations**: Use `@/repositories/booking.repository.ts`
- **User operations**: Use `@/repositories/user.repository.ts`

### 4. WhatsApp Integration
WhatsApp functionality remains on the backend but is accessed through local API routes that proxy the requests. The frontend WhatsApp API routes forward requests to the backend WhatsApp server.

## Benefits

1. **Unified API**: All API calls go through `/api/*` routes
2. **Better Performance**: Eliminates external HTTP calls for room/booking operations
3. **Simplified Architecture**: Frontend handles all data operations directly
4. **Consistent Error Handling**: Unified error response format
5. **Type Safety**: Direct use of TypeScript interfaces throughout

## Environment Variables
The following environment variables are no longer needed for room/booking operations:
- `NEXT_PUBLIC_BACKEND_URL` (still used for WhatsApp proxy)
- `NEXT_PUBLIC_BACKEND_API_KEY` (still used for WhatsApp proxy)

Firebase configuration remains the same as all operations use Firebase directly.

## Migration Guide

### Before (External API calls)
```typescript
const response = await fetch(`${BACKEND_URL}/api/rooms`, {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});
```

### After (Local API routes)
```typescript
const response = await fetch('/api/rooms', {
  headers: { 'Content-Type': 'application/json' }
});
```

## Notes
- Admin booking routes include basic implementations that may need enhancement based on specific business logic
- WhatsApp functionality continues to use the backend server through proxy routes
- All authentication flows remain unchanged
