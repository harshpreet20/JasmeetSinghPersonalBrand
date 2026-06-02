# Supabase Security & RLS Setup Guide

**Application:** Jasmeet Singh Personal Brand - Admin Dashboard  
**Database:** PostgreSQL via Supabase  
**Last Updated:** June 2, 2026

## Overview

This guide provides complete setup instructions for securing your Supabase database with Row-Level Security (RLS) policies. RLS is the final layer of defense that prevents unauthorized data access even if API validation is bypassed.

---

## Database Schema Overview

### Tables
1. **form_submissions** - Lead capture from chatbot and forms
2. **chat_sessions** - Chatbot conversation logs
3. **chatbot_knowledge** - Knowledge base for chatbot system prompts
4. **blogs** - Blog posts with SEO metadata
5. **contacts** - Contact information (optional)
6. **submissions** - Form submission tracking (optional)

---

## RLS Policy Implementation

### Step 1: Enable RLS on All Tables

```sql
-- Enable RLS on all tables
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
```

---

## Detailed RLS Policies

### Table 1: form_submissions
**Purpose:** Store lead captures from chatbot and forms  
**Access Model:**
- Public: Can INSERT new submissions
- Authenticated (Admin): Can SELECT, UPDATE, DELETE own team's submissions
- Service Role: Full access (for API routes)

```sql
-- 1. Allow anonymous/public users to insert form submissions
CREATE POLICY "public_insert_form_submissions"
ON form_submissions
FOR INSERT
WITH CHECK (true);

-- 2. Allow authenticated users to view all submissions (admin)
CREATE POLICY "authenticated_select_form_submissions"
ON form_submissions
FOR SELECT
USING (auth.role() IN ('authenticated', 'service_role'));

-- 3. Allow authenticated users to update submissions (status, notes)
CREATE POLICY "authenticated_update_form_submissions"
ON form_submissions
FOR UPDATE
USING (auth.role() IN ('authenticated', 'service_role'))
WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

-- 4. Allow authenticated users to delete submissions
CREATE POLICY "authenticated_delete_form_submissions"
ON form_submissions
FOR DELETE
USING (auth.role() IN ('authenticated', 'service_role'));
```

### Table 2: chat_sessions
**Purpose:** Store chatbot conversation logs  
**Access Model:**
- Public: Can INSERT new sessions, SELECT own session via token
- Authenticated (Admin): Can SELECT all sessions
- Service Role: Full access

```sql
-- 1. Allow anonymous users to insert chat sessions
CREATE POLICY "public_insert_chat_sessions"
ON chat_sessions
FOR INSERT
WITH CHECK (true);

-- 2. Allow anonymous users to select only their own session
CREATE POLICY "public_select_own_chat_session"
ON chat_sessions
FOR SELECT
USING (
  -- Allow if session_token matches user's session
  -- This requires the client to pass session_token in request
  session_token = current_setting('request.jwt.claims')::json->>'session_token'
  OR
  -- Allow service role (API routes)
  auth.role() = 'service_role'
);

-- 3. Allow authenticated (admin) to select all sessions
CREATE POLICY "authenticated_select_all_chat_sessions"
ON chat_sessions
FOR SELECT
USING (auth.role() IN ('authenticated', 'service_role'));

-- 4. Allow service role to update sessions
CREATE POLICY "service_role_update_chat_sessions"
ON chat_sessions
FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
```

### Table 3: chatbot_knowledge
**Purpose:** Knowledge base for chatbot system prompts  
**Access Model:**
- Public: Can SELECT active items only
- Authenticated (Admin): Can SELECT, INSERT, UPDATE, DELETE all
- Service Role: Full access

```sql
-- 1. Allow public to select only active knowledge items
CREATE POLICY "public_select_active_knowledge"
ON chatbot_knowledge
FOR SELECT
USING (is_active = true);

-- 2. Allow authenticated users to select all knowledge items
CREATE POLICY "authenticated_select_all_knowledge"
ON chatbot_knowledge
FOR SELECT
USING (auth.role() IN ('authenticated', 'service_role'));

-- 3. Allow authenticated users to insert knowledge items
CREATE POLICY "authenticated_insert_knowledge"
ON chatbot_knowledge
FOR INSERT
WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

-- 4. Allow authenticated users to update knowledge items
CREATE POLICY "authenticated_update_knowledge"
ON chatbot_knowledge
FOR UPDATE
USING (auth.role() IN ('authenticated', 'service_role'))
WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

-- 5. Allow authenticated users to delete knowledge items
CREATE POLICY "authenticated_delete_knowledge"
ON chatbot_knowledge
FOR DELETE
USING (auth.role() IN ('authenticated', 'service_role'));
```

### Table 4: blogs
**Purpose:** Blog posts with SEO metadata  
**Access Model:**
- Public: Can SELECT published posts only
- Authenticated (Admin): Can SELECT all, INSERT, UPDATE, DELETE
- Service Role: Full access

```sql
-- 1. Allow public to select only published blogs
CREATE POLICY "public_select_published_blogs"
ON blogs
FOR SELECT
USING (status = 'published' OR auth.role() = 'service_role');

-- 2. Allow authenticated users to select all blogs
CREATE POLICY "authenticated_select_all_blogs"
ON blogs
FOR SELECT
USING (auth.role() IN ('authenticated', 'service_role'));

-- 3. Allow authenticated users to insert blogs
CREATE POLICY "authenticated_insert_blogs"
ON blogs
FOR INSERT
WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

-- 4. Allow authenticated users to update blogs
CREATE POLICY "authenticated_update_blogs"
ON blogs
FOR UPDATE
USING (auth.role() IN ('authenticated', 'service_role'))
WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

-- 5. Allow authenticated users to delete blogs
CREATE POLICY "authenticated_delete_blogs"
ON blogs
FOR DELETE
USING (auth.role() IN ('authenticated', 'service_role'));
```

### Table 5: contacts
**Purpose:** Contact information (if using)

```sql
-- 1. Allow public to insert contacts
CREATE POLICY "public_insert_contacts"
ON contacts
FOR INSERT
WITH CHECK (true);

-- 2. Allow authenticated users full access
CREATE POLICY "authenticated_select_contacts"
ON contacts
FOR SELECT
USING (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "authenticated_update_contacts"
ON contacts
FOR UPDATE
USING (auth.role() IN ('authenticated', 'service_role'))
WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "authenticated_delete_contacts"
ON contacts
FOR DELETE
USING (auth.role() IN ('authenticated', 'service_role'));
```

### Table 6: submissions
**Purpose:** Form submission tracking (if using)

```sql
-- Follow same pattern as form_submissions
CREATE POLICY "public_insert_submissions"
ON submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "authenticated_select_submissions"
ON submissions
FOR SELECT
USING (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "authenticated_update_submissions"
ON submissions
FOR UPDATE
USING (auth.role() IN ('authenticated', 'service_role'))
WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "authenticated_delete_submissions"
ON submissions
FOR DELETE
USING (auth.role() IN ('authenticated', 'service_role'));
```

---

## Implementation Steps in Supabase Dashboard

### Via Supabase Dashboard (UI)

1. **Enable RLS per table:**
   - Go to `SQL Editor`
   - Run the `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` commands above
   - OR: Go to each table in `Table Editor` → `RLS` toggle → Enable

2. **Create Policies:**
   - For each table, click `Create policy` button
   - Copy the policy SQL from the sections above
   - Paste into the SQL editor and execute

3. **Verify Policies:**
   - Table Editor → Select table → Policies tab
   - Should see all policies listed with their conditions

### Via SQL Editor (Recommended)

Create a single SQL file with all policies:

```sql
-- Enable RLS
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- form_submissions policies
CREATE POLICY "public_insert_form_submissions"
ON form_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "authenticated_select_form_submissions"
ON form_submissions FOR SELECT USING (auth.role() IN ('authenticated', 'service_role'));

-- [... rest of policies ...]
```

Then execute in SQL Editor.

---

## Testing RLS Policies

### Test 1: Public User Can Insert Submission

```bash
# As anonymous user (public)
curl -X POST https://your-project.supabase.co/rest/v1/form_submissions \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "problem_statement": "Career guidance needed"
  }'
# Expected: ✅ 201 Created
```

### Test 2: Public User Cannot Select Submissions

```bash
# As anonymous user
curl -X GET 'https://your-project.supabase.co/rest/v1/form_submissions' \
  -H "apikey: $SUPABASE_ANON_KEY"
# Expected: ❌ 0 rows (no access)
```

### Test 3: Admin Can Select All Submissions

```bash
# As authenticated user (with session JWT)
curl -X GET 'https://your-project.supabase.co/rest/v1/form_submissions' \
  -H "Authorization: Bearer $ADMIN_JWT"
# Expected: ✅ All submissions returned
```

### Test 4: Only Published Blogs Visible to Public

```bash
# As anonymous user
curl -X GET 'https://your-project.supabase.co/rest/v1/blogs?status=eq.published' \
  -H "apikey: $SUPABASE_ANON_KEY"
# Expected: ✅ Only published blogs returned

curl -X GET 'https://your-project.supabase.co/rest/v1/blogs?status=eq.draft' \
  -H "apikey: $SUPABASE_ANON_KEY"
# Expected: ❌ 0 rows (no access to drafts)
```

---

## API Route Security Integration

### How API Routes Use Service Role Key

The API routes in this application use `SUPABASE_SERVICE_ROLE_KEY` which:
- ✅ Bypasses RLS policies (intentional for admin operations)
- ✅ Never exposed to frontend (server-only)
- ✅ Used only in Next.js API routes
- ✅ Can access all data regardless of RLS

**Example:**
```typescript
// src/app/api/admin/blogs/route.ts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Grants full access
)

// This query will:
// 1. Pass input validation (server-side)
// 2. Execute with service_role (bypasses RLS)
// 3. Return results securely to admin
const { data } = await supabase.from('blogs').select('*')
```

---

## Security Best Practices

### ✅ DO:
- [x] Enable RLS on all tables
- [x] Create explicit policies for each role (public, authenticated, service)
- [x] Use service_role key ONLY in server-side API routes
- [x] Validate input on API routes before database operations
- [x] Log admin actions (update audit_log table)
- [x] Rotate service_role key periodically
- [x] Review policies after schema changes

### ❌ DON'T:
- [x] Expose service_role key to frontend
- [x] Use `WITH CHECK (true)` for sensitive operations
- [x] Rely solely on RLS for API authentication
- [x] Share admin JWT tokens
- [x] Store passwords in plaintext
- [x] Grant authenticated role to public users
- [x] Skip input validation assuming RLS protects you

---

## Audit Logging (Optional)

Create an audit log table for tracking admin actions:

```sql
CREATE TABLE audit_log (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action VARCHAR(50),
  table_name VARCHAR(100),
  record_id BIGINT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can select audit logs
CREATE POLICY "authenticated_select_audit_log"
ON audit_log FOR SELECT
USING (auth.role() IN ('authenticated', 'service_role'));

-- Trigger to log updates
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (user_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers on admin tables
CREATE TRIGGER audit_blogs_trigger
AFTER UPDATE ON blogs
FOR EACH ROW
EXECUTE FUNCTION log_audit();
```

---

## Troubleshooting

### Issue: "PGRST301 - not authenticated"
**Cause:** RLS policy requires authenticated user but request is anonymous
**Solution:** Check policy conditions - use `auth.role() = 'service_role'` for API routes

### Issue: "ERROR: new row violates row-level security policy"
**Cause:** INSERT/UPDATE violates RLS WITH CHECK condition
**Solution:** Verify policy's WITH CHECK clause matches your data

### Issue: "Missing required auth token"
**Cause:** Client-side code using anon key to access protected tables
**Solution:** Use service_role key in server-side code only

### Issue: Admin cannot see data
**Cause:** Policy accidentally excludes authenticated users
**Solution:** Verify `auth.role() IN ('authenticated', 'service_role')`

---

## Reference: Supabase Auth Roles

| Role | Access | Use Case |
|------|--------|----------|
| `anon` | Public/unauthenticated | Website visitors, form submissions |
| `authenticated` | Logged-in users | Admin dashboard users |
| `service_role` | Server-side only | Next.js API routes |

**Key:** Each role type can have different RLS policies!

---

## Verification Checklist

After implementing RLS:

- [ ] All 6 tables have RLS enabled
- [ ] Each table has appropriate policies
- [ ] Public users can INSERT but not SELECT submissions
- [ ] Admins can SELECT/UPDATE all tables
- [ ] Service role can bypass RLS for API operations
- [ ] Published blogs visible to public, drafts hidden
- [ ] Chat sessions accessible only to creator or admin
- [ ] Knowledge base items active=true visible to public
- [ ] No unauthorized data leaks in testing
- [ ] Authentication flows work end-to-end

---

## Summary

RLS provides the **final layer of security**:
1. API routes validate input (application layer)
2. Middleware checks authentication (server layer)
3. RLS policies enforce data access (database layer)

This defense-in-depth approach ensures that **even if one layer is compromised, others prevent unauthorized access**.

---

**Status:** Ready for implementation  
**Estimated Setup Time:** 30 minutes  
**Complexity:** Medium (SQL knowledge helpful)

For questions, refer to [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
