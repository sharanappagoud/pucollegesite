# WhatsApp Business Platform Integration – MPUC College Website

This document provides complete instructions for configuring, testing, and deploying the WhatsApp Business integration on the Master Pre-University College (MPUC) website.

---

## 1. Architecture Overview

The WhatsApp integration operates in a hybrid dual-channel architecture:
1. **Public Click-to-Chat Layer (`wa.me`)**:
   - Zero-dependency, immediate engagement channel requiring no API tokens.
   - Powers the bottom-right floating widget across all public pages.
   - Powers contextual enquiry buttons across Home, Admissions, Academics, Contact, and Examinations.
   - Prefills customized messages for Science (PCMB/PCMC), Commerce (CEBA/SEBA), Examinations, and Admissions enquiries.
2. **Meta WhatsApp Business Platform Cloud API (`graph.facebook.com`)**:
   - Automated server-to-server messaging for admission enquiry acknowledgement, application status changes, and announcements.
   - Dedicated Spring Boot service with HMAC SHA-256 webhook signature verification (`X-Hub-Signature-256`).
   - Webhook endpoint for delivery receipts (`SENT`, `DELIVERED`, `READ`, `FAILED`).
   - Strict student consent register (`whatsapp_opt_in_records`) ensuring messages are only sent to opted-in numbers.
   - Clean, secure fallback: When Cloud API tokens are not configured in environment, the system gracefully falls back to Click-to-Chat without throwing unhandled exceptions.

---

## 2. Configuration & Environment Variables

### Backend Environment Variables (`backend/.env` or server secrets)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `WHATSAPP_ACCESS_TOKEN` | Meta System User permanent token with `whatsapp_business_messaging` permission | `EAA...` (Kept in backend only) |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID from Meta WhatsApp Manager | `104829182749102` |
| `WHATSAPP_BUSINESS_ACCOUNT_ID`| WhatsApp Business Account (WABA) ID | `294819283749182` |
| `WHATSAPP_API_VERSION` | Graph API Version | `v19.0` |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification token for handshake | `mpuc_whatsapp_verify_token_2026` |
| `WHATSAPP_APP_SECRET` | App Secret for HMAC SHA-256 signature check | Meta App Dashboard -> Basic Settings |
| `WHATSAPP_DEFAULT_PHONE` | College verified WhatsApp phone number (E.164) | `918023456789` |

> [!IMPORTANT]
> Raw access tokens and app secrets are **never** rendered in frontend UI, browser localStorage, or frontend environment variables. The Admin Dashboard displays masked connection status only.

---

## 3. Database Tables (Flyway Migration `V12__whatsapp_integration.sql`)

1. **`whatsapp_settings`**: Stores verified contact number, floating button toggle, welcome copy, webhook verification token, and automated notification preference toggles.
2. **`whatsapp_message_templates`**: Stores message templates with category (`UTILITY`, `MARKETING`, `GENERAL_ENQUIRY`), status (`APPROVED`), header, body with parameters `{{1}}, {{2}}`, and footer.
3. **`whatsapp_notification_logs`**: Full audit log of all dispatched messages, recipient phone, template, channel (`CLOUD_API` vs `WA_ME`), delivery status, and Meta message ID.
4. **`whatsapp_opt_in_records`**: Student consent tracking linked to phone numbers with opt-in source and timestamps.
5. **`whatsapp_webhook_events`**: Stores raw incoming webhook payloads, event IDs, signatures, and processing status.

---

## 4. API Endpoints

### Public Endpoints:
- `GET /api/v1/whatsapp/config`: Returns public-safe configuration (phone number, welcome copy, prefilled templates, Cloud API status).
- `POST /api/v1/whatsapp/opt-in`: Registers or updates candidate WhatsApp communication consent.
- `GET /api/v1/whatsapp/webhook`: Handles Meta webhook hub challenge verification (`hub.mode`, `hub.verify_token`, `hub.challenge`).
- `POST /api/v1/whatsapp/webhook`: Ingestion point for delivery receipts with `X-Hub-Signature-256` HMAC validation.

### Protected Admin Endpoints (`/api/v1/admin/whatsapp/*`):
- `GET /api/v1/admin/whatsapp/settings`: View settings, masked credentials, and notification toggles.
- `PUT /api/v1/admin/whatsapp/settings`: Update settings and notification triggers.
- `GET /api/v1/admin/whatsapp/templates`: List all message templates.
- `POST /api/v1/admin/whatsapp/templates`: Create new template.
- `PUT /api/v1/admin/whatsapp/templates/{id}`: Update template.
- `DELETE /api/v1/admin/whatsapp/templates/{id}`: Delete template.
- `GET /api/v1/admin/whatsapp/logs`: Paginated delivery logs with status filtering.
- `GET /api/v1/admin/whatsapp/opt-ins`: Paginated user consent register.
- `POST /api/v1/admin/whatsapp/send`: Send test message or manual template dispatch.

---

## 5. UI Features & Pages

- **Floating WhatsApp Widget** (`FloatingWhatsApp.jsx`): Mounted in `PublicLayout.jsx`. Includes tooltip "Chat with MPUC College", animated pulse, official `#25D366` branding, college greeting bubble, interactive quick chips for Admissions, Science, Commerce, and Exams, customizable message input, and "Start Chat on WhatsApp" button.
- **Home Page** (`Home.jsx`): WhatsApp action in Fast-Track Admissions section; on submission, presents reference number and direct "Continue on WhatsApp" button.
- **Admissions Page** (`Admissions.jsx`): Hero WhatsApp action, enquiry submission reference card with direct WhatsApp button, and consent opt-in checkbox in form.
- **Contact Page** (`Contact.jsx`): Dedicated WhatsApp Business Helpdesk Card with direct link to `+91 80234 56789`.
- **Academics Page** (`Academics.jsx`): Direct WhatsApp buttons for each Science (PCMB/PCMC) and Commerce (CEBA/SEBA) combination with tailored queries.
- **Examinations Page** (`Examinations.jsx`): WhatsApp examination enquiry actions in Hero and Examination Cell counter sections.
- **Admin Dashboard** (`/admin/whatsapp`): Full management console with 5 tabs: Settings, Message Templates, Delivery Logs, Consent Opt-Ins, and Test Messenger.
