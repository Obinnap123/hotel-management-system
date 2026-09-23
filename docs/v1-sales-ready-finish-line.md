# Version One Sales-Ready Finish Line

## Product goal

Finish a small, dependable first version that a hotel can genuinely use, then begin selling while later improvements are guided by real hotel feedback.

This is the agreed Version One boundary. Features outside this document are not required before initial sales unless testing reveals that they block or endanger a core hotel workflow.

## Remaining implementation work

### Step 3.5 — Homepage structure and featured rooms

Give an administrator safe control over the public homepage without turning Settings into a free-form website builder.

- Select the room types promoted on the homepage.
- Arrange the selected featured room types.
- Show or hide optional homepage sections.
- Keep essential reservation elements—navigation, hero, availability search, and footer—always available.
- Never delete or change room inventory when a room type is removed from the homepage.
- Keep all active room types available on the complete Rooms & Suites page.

### Step 3.6 — Essential hotel policies

Allow the hotel to maintain the important rules guests should understand before reserving.

- Cancellation policy
- Check-in requirements
- Hotel or house rules
- Terms accepted when a reservation is submitted

The first version will use clear structured fields. It will not include a free-form legal-document builder.

### Step 3.7 — Reservation notifications

Make new public reservations visible without requiring reception to repeatedly refresh the HMS.

- Notify configured hotel recipients when a reservation is received.
- Include the booking number, guest, dates, room, and contact details.
- Send the guest an acknowledgement that the request was received.
- Clearly state that a new public reservation is pending until confirmed by the hotel.
- Allow administrators to manage the hotel recipient addresses.
- Persist the reservation before attempting email delivery so an email failure cannot lose the booking.

### Final Version One cleanup and launch verification

Stop adding major features and verify the complete hotel journey:

1. A guest searches for a room.
2. The guest submits a reservation.
3. The hotel receives the notification.
4. The booking appears in the HMS.
5. Reception confirms or cancels it.
6. A payment is recorded.
7. The guest is checked in.
8. The guest is checked out.
9. The room becomes available correctly again.

The launch review must also cover:

- Mobile, tablet, and desktop layouts
- Keyboard access, form labels, focus, and readable contrast
- Empty, loading, success, and error states
- Validation and understandable error messages
- Logos, browser icons, colours, typography, and uploaded images
- Database migrations against a fresh database
- Separate databases and deployments for the SymplyUp demo and each hotel
- Required environment variables and administrator setup
- Public-booking system-user setup
- Domain, email, and DNS configuration
- Backup and recovery procedure
- Basic production error monitoring
- A repeatable hotel onboarding and launch checklist

## Deliberately deferred until after initial sales

These features may be valuable later, but they are not part of the first sales-ready boundary:

- Social-media links
- Image focal-point controls
- Free section reordering
- Full draft and publishing workflow
- Revision history and restore
- Advanced audit history
- Advanced minimum, maximum, same-day, and cut-off booking rules
- Taxes and service charges
- Deposits and partial payments
- Online payment gateway processing
- Advanced receipts and invoices
- Advanced reports and exports
- Additional staff roles beyond Admin and Receptionist
- A drag-and-drop website builder

## Scope rule

Before adding anything outside this finish line, answer one question:

> Does the hotel need this to safely receive and manage real reservations in Version One?

If the answer is no, record it for a later release instead of delaying the first sales-ready product.
