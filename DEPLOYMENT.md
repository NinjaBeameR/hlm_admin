# Deployment Checklist for HLM Admin

## Environment Variables Check
Ensure these are set in Netlify:

```
VITE_SUPABASE_URL=https://kvzhuiwqrvckfaweikhq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2emh1aXdxcnZja2Zhd2Vpa2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzExMzMsImV4cCI6MjA3MjY0NzEzM30.v2bWSKIAuHq4fSpaM4f7EXclefcoeWLFzOvAoJtzAbI
```

## Deployment Steps

1. **Check Environment Variables**
   - Go to Netlify Dashboard
   - Site Settings > Environment Variables
   - Verify the correct Supabase URL is set

2. **Database Setup**
   - Run the complete_database_setup.sql in Supabase SQL Editor
   - Verify tables are created correctly

3. **Deploy**
   - Trigger new deployment in Netlify
   - Check build logs for any environment variable issues

4. **Test Production**
   - Visit https://hlmadmin.netlify.app
   - Check browser console for errors
   - Test form submission
   - Test admin login

## Quick Debug Commands

Check if environment variables are loading correctly by temporarily adding this to your app:

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

## Common Issues

- **ERR_NAME_NOT_RESOLVED**: Wrong Supabase URL in environment variables
- **400 Bad Request**: Database tables don't exist or wrong schema
- **403 Forbidden**: RLS policies not set correctly
- **CORS Errors**: Site URL not configured in Supabase Auth settings
