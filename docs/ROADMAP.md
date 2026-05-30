# iKicks — Pre-Deployment Roadmap

Work through each phase in order. Do not move to the next phase until every task in the current one is checked off. Each task is self-contained and actionable.

---

## Phase 1 — Foundation (Blockers)

Nothing else works until these are done. Every commented-out route depends on them.

- [ ] **Create `client/.env`** — add `VITE_BACKEND_URL=http://localhost:8000`. Without this, every Axios call is broken.
- [ ] **Create `CartContext.jsx`** — the original was deleted. It must hold: `cart` (array), `setCart`, `cartCount`, and expose `addItem`, `removeItem`, `clearCart`. Wire it into `main.jsx` alongside `UserProvider`.
- [ ] **Create missing service files** — the only service files that exist are `user.service.js` and `product.service.js`. Create:
  - `cart.service.js` — `addToCart`, `getCartPreview`, `increaseQty`, `decreaseQty`, `deleteCartItem`
  - `order.service.js` — `placeOrder`, `getOrderPreview`, `getOrderDetails`
  - `payment.service.js` — `makePayment`
  - `shipping.service.js` — `addAddress`, `getAddresses`, `updateAddress`, `deleteAddress`
  - `wishlist.service.js` — `addToWishlist`, `getWishlist`
- [ ] **Create `ProtectedRoute.jsx`** — a wrapper component that checks `user` from `UserContext`. If not logged in, redirect to `/login`. Use it to guard every private route below.
- [ ] **Create `AdminRoute.jsx`** — same as above but also checks `user.role === 'admin'`. Redirect to `/` if not admin.
- [ ] **Uncomment all routes in `App.jsx`** and wrap private ones with `ProtectedRoute`, admin ones with `AdminRoute`.

---

## Phase 2 — Bug Fixes (Server)

Two existing bugs that will cause silent failures in production.

- [ ] **Fix `cart/add` missing `authMiddleware`** — `cartRouter.route("/add")` has no auth guard. Any unauthenticated request can add items. Add `authMiddleware` before the rate limiter.
- [ ] **Fix `updateUserInfo` parameter source** — the controller reads `req.params.userId` but the route is `/profile PUT` protected by `authMiddleware`, so the user id should come from `req.user.userId`. Change the destructuring in the controller.

---

## Phase 3 — Core Shopping Flow

The primary user journey: browse → product → cart → checkout → confirmation.

- [ ] **Product listing (`/products`)** — connect `AllProducts.jsx` to `product.service.js`. Call `getProductsPreview` on mount. Display the loading state. Ensure the filter form calls `filterProducts` and updates the list.
- [ ] **Product by brand (`/brand`)** — connect `SneakerByBrand.jsx`. Pass the selected brand as a query param to `filterProducts`.
- [ ] **Product detail (`/sneaker/:id`)** — connect `SneakerDisplay.jsx` to `getProductDetails`. Render name, brand, colorway, images, sizes, and price. The size selector must be functional and pass `sizeId` to the add-to-cart call.
- [ ] **Add to cart** — wire the "Add to Cart" button in `SneakerDisplay.jsx` to `cart.service.js → addToCart`. On success, update `CartContext` state and update the cart badge count in the navbar (read `cartCount` from `CartContext`).
- [ ] **Cart page (`/cart`)** — connect `Cart.jsx`. Call `getCartPreview` on mount. Render items with quantity controls (`increaseQty`, `decreaseQty`, `deleteCartItem`). Show subtotal. "Checkout" button navigates to `/delivery`.
- [ ] **Delivery page (`/delivery`)** — connect `DeliveryInfo.jsx`. Call `getAddresses` on mount. Allow user to select an existing address or add a new one (`addAddress`). "Continue" button calls `placeOrder` with the selected address, then navigates to `/payment` passing the `orderId`.
- [ ] **Payment page (`/payment`)** — connect `Payment.jsx` and `CheckoutForm.jsx`. Call `makePayment` with the `orderId` to get a Stripe `clientSecret`. Render Stripe's `PaymentElement`. On success Stripe fires the webhook — the client should poll or listen for order status and then navigate to `/confirmation`.
- [ ] **Order confirmation (`/confirmation`)** — connect `OrderConfirmation.jsx`. Fetch and display the completed order summary. Clear the cart from `CartContext`.

---

## Phase 4 — User Account

- [ ] **My Orders (`/myorders`)** — connect `MyOrders.jsx`. Call `getOrderPreview` to list all past orders. Each order links to its detail view using `getOrderDetails`.
- [ ] **Profile page (`/profile`)** — this component does not exist yet. Create it. Display the logged-in user's name and email (from `UserContext`). Add an edit form that calls `updateUserInfo`.
- [ ] **Logout** — wire the Logout button in the navbar dropdown to call `logoutUser` from `user.service.js`, then call `setUser({})` and navigate to `/`.
- [ ] **Wishlist** — add a wishlist icon to `SneakerDisplay.jsx`. Clicking it calls `addToWishlist`. Add a Wishlist page (or section in Profile) that calls `getWishlist` and displays saved items.
- [ ] **Password reset flow** — the backend is fully built (generate code → verify code → reset password). The `Verify.jsx` component exists. Connect the three steps:
  1. Forgot password form — enter email, call `generateCode`.
  2. `Verify.jsx` — enter the 6-digit code, call `verifyCode`, receive `resetToken`.
  3. Reset password form — enter new password, call `resetPassword` with the `resetToken`.

---

## Phase 5 — Admin Panel

- [ ] **Admin page (`/admin`)** — connect `AdminPage.jsx`. Call `getAllUsers` (admin only). Display user list.
- [ ] **Add product (`/new-inventory`)** — connect `CreateForm.jsx` (or `ProductForm.jsx`). Call `addNewProduct`. Requires image upload — confirm how product images are stored (check `ImageUrlGenerator.js` utility) before building the form.
- [ ] **Update product (`/update-inventory/:id`)** — connect `UpdateForm.jsx`. Allow updating price (`updatePriceById`) and stock quantity by size (`updateQuantityBySize`).
- [ ] **Delete product** — no delete endpoint exists on the server. Add `DELETE /product/:id` route, controller logic, and wire it into the admin UI.

---

## Phase 6 — Pre-Deployment Checklist

Complete this phase last, in order.

- [ ] **Environment audit** — verify all required variables exist in `server/.env`: `PORT`, `JWT_SECRET`, `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `CLIENT_URL`, `NODE_ENV=production`.
- [ ] **Stripe webhook** — register the production webhook URL in the Stripe dashboard (`POST /webhook`). Confirm `STRIPE_WEBHOOK_SECRET` matches.
- [ ] **Cookie security** — confirm `secure: true` and `sameSite: 'strict'` on all `res.cookie()` calls in production. The current code gates on `NODE_ENV === 'production'` — verify `NODE_ENV` is actually set on the host.
- [ ] **Add a 404 page** — create a `NotFound.jsx` component and add `<Route path="*" element={<NotFound />} />` as the last route in `App.jsx`.
- [ ] **Add a React error boundary** — wrap `<App />` in an `ErrorBoundary` component so an unhandled render error does not blank the entire page.
- [ ] **End-to-end test** — manually run the full purchase flow: register → browse → add to cart → checkout → pay with a Stripe test card → confirm order email arrives → check My Orders shows the order.
- [ ] **Run the ESLint client check** — `cd client && npm run lint`. Fix every warning (max-warnings is set to 0, so the build will fail if any remain).
- [ ] **Production build** — run `cd client && npm run build`. Fix any build errors before deploying.
- [ ] **Remove all `console.log` statements** from production server code. Keep `console.error` for genuine error logging only.
