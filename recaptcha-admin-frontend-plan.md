# reCAPTCHA v2 — Admin Frontend Implementation Plan

**Project:** `hisd3-cms-admin-frontend`  
**Stack:** React + TanStack Router + Apollo Client + Ant Design  
**Target Surface:** Admin login page  
**Target File:** `src/routes/login.tsx`

---

## Phase A1: Package Installation

Install the reCAPTCHA React wrapper and its TypeScript types.

```bash
cd hisd3-cms-admin-frontend
npm install react-google-recaptcha
npm install -D @types/react-google-recaptcha
```

**Why these two packages:**
- `react-google-recaptcha` — provides the `<ReCAPTCHA>` widget component and a ref-based API to get/reset the token
- `@types/react-google-recaptcha` — TypeScript type definitions for the component and its ref methods

---

## Phase A2: Environment Configuration

#### [MODIFY] `.env`

Add the **site key** (this is the public key — safe to expose in frontend code):

```env
VITE_RECAPTCHA_SITE_KEY=6Lfqq5UsAAAAADs6M3L79YTlAYnrls1erB9AStXL
```

> [!IMPORTANT]
> The **secret key** must NEVER be in frontend code. It is already in the backend `.env` only.
> The **site key** and **secret key** are a matched pair registered on the same Google reCAPTCHA domain. Do not mix them.

---

## Phase A3: GraphQL Codegen (Required — Blocking Step)

The admin frontend uses **typed-document-node codegen**. The `graphql()` function in `mutations.ts` generates fully typed variables from the backend schema.

**Why this step is required:**  
The backend's `SignInInput` now has a new required field `captchaToken: String!`. Until codegen runs against the updated schema, the TypeScript type for `$signInInput` will not include `captchaToken`, and the compiler will throw an error when you try to pass it.

```bash
# Ensure the backend is running locally so codegen can introspect the live schema
npm run codegen
```

**What this updates:**  
The auto-generated file at `src/graphql/generated/graphql.ts` will now include `captchaToken` in the `SignInInput` type definition.

> [!NOTE]
> If codegen is configured to use a schema file instead of a live endpoint, re-download or regenerate the schema file first.

---

## Phase A4: Login Component — Full Integration

#### [MODIFY] `src/routes/login.tsx`

### Step 4.1 — Add Imports

```diff
 import { createFileRoute } from "@tanstack/react-router";
 import { Button, Checkbox, Form, Input, message } from "antd";
 import { UserOutlined, LockOutlined } from "@ant-design/icons";
 import { useNavigate } from "@tanstack/react-router";
 import { useMutation } from "@apollo/client/react";
 import { SIGN_IN_MUTATION } from "../graphql/mutations";
+import ReCAPTCHA from "react-google-recaptcha";
+import { useRef } from "react";
```

### Step 4.2 — Add the CAPTCHA Ref inside the `Login` function

The ref gives us direct access to the reCAPTCHA widget's methods (`getValue()`, `reset()`).

```diff
 function Login() {
   const navigate = useNavigate();
   const [signin, { loading }] = useMutation(SIGN_IN_MUTATION);
   const [messageApi, contextHolder] = message.useMessage();
+  const recaptchaRef = useRef<ReCAPTCHA>(null);
```

### Step 4.3 — Read and Validate Token in `onFinish`

CAPTCHA verification runs **before** the mutation is called. If the token is missing, the request is blocked client-side.

```diff
   const onFinish = async (values: { username: string; password: string }) => {
+    // Guard: require the CAPTCHA to be completed
+    const captchaToken = recaptchaRef.current?.getValue();
+    if (!captchaToken) {
+      messageApi.error("Please complete the CAPTCHA verification.");
+      return;
+    }
+
     try {
       const { data } = await signin({
         variables: {
           signInInput: {
             username: values.username,
             password: values.password,
+            captchaToken,
           },
         },
       });
       if (data?.signin?.isSignedIn) {
         messageApi.success("Signed in successfully!");
         navigate({ to: "/" });
       }
     } catch (error: any) {
       console.error("Sign in error:", error);
       messageApi.error(error.message || "An error occurred during sign in.");
+      // Always reset CAPTCHA after a failed attempt to prevent token reuse
+      recaptchaRef.current?.reset();
     }
   };
```

### Step 4.4 — Render the Widget in the Form

Place the `<ReCAPTCHA>` widget between the "Remember me" row and the "Log in" button. Wrapping in a `<Form.Item>` keeps it visually aligned with the rest of the form.

```diff
           {/* ... Checkbox and Forgot Password row ... */}
         </Form.Item>

+        <Form.Item>
+          <div className="flex justify-center">
+            <ReCAPTCHA
+              ref={recaptchaRef}
+              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
+            />
+          </div>
+        </Form.Item>

         <Form.Item>
           <Button
             type="primary"
             htmlType="submit"
             className="w-full bg-[#1280ED]"
             size="large"
             loading={loading}
             disabled={loading}
           >
             Log in
           </Button>
         </Form.Item>
```

---

## Phase A5: Verification Checklist

Start the backend locally with `RECAPTCHA_SECRET_KEY` present in `.env`, then run the admin frontend with `npm run dev`.

| Test | Expected Result |
|---|---|
| Navigate to `/login` | reCAPTCHA checkbox widget appears between the checkbox row and `Log in` button |
| Click `Log in` without completing CAPTCHA | Error toast: "Please complete the CAPTCHA verification." — no network request sent |
| Complete CAPTCHA, submit correct credentials | Successful login, redirect to `/` |
| Complete CAPTCHA, submit wrong credentials | Error toast with server message, CAPTCHA resets |
| Submit with a tampered/fake token (via DevTools) | Backend returns `ForbiddenException: CAPTCHA verification failed` |

---

## Files Summary

| Phase | Action | File |
|---|---|---|
| A1 | Install packages | `package.json` |
| A2 | Add `VITE_RECAPTCHA_SITE_KEY` | `.env` |
| A3 | Re-run codegen | `src/graphql/generated/*` (auto-generated) |
| A4 | Integrate widget + token logic | `src/routes/login.tsx` |
