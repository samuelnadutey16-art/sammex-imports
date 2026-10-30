# Sammex Imports website starter

A responsive Next.js storefront starter for Sammex Imports (China to Ghana).

## Decisions implemented
- Black and gold visual identity
- Ready-stock and pre-order product types
- GHS and USD price fields
- Shipping fee stored separately and calculated after arrival for pre-orders
- Owner-only admin is the intended access model (admin authentication/API still needs configuration)
- Contact: +233 54 312 8235 / sammeximport@gmail.com

## Run locally
1. Install Node.js 20+
2. Run `npm install`
3. Copy `.env.example` to `.env.local`
4. Add Supabase project URL and anon key
5. Run `npm run dev`

## Supabase setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Create the owner account in Supabase Auth.
4. Implement server-side owner authorization before enabling admin mutations.
5. Configure storage bucket for product images.

## Payments and launch
This starter intentionally does not accept real payments yet. Add Paystack checkout with server-side transaction initialization and verified webhook handling. Never expose `PAYSTACK_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in browser code. Add order creation validation, rate limiting, email notifications, privacy/terms pages, and test-mode payment verification before launch.

## Domain
Purchase `sammeximports.com` through a domain registrar, then connect DNS to Vercel after deployment. Domain availability and purchase are not verified by this package.

## Important pre-order policy
The storefront states an estimated 45–60 working days after container purchase/shipment and shipping fees calculated separately after arrival. Have the business owner approve final terms and display them at checkout before accepting orders.
