# Deployment Checklist for HLM Admin

## Environment Variables Check
Ensure these are set in Netlify:

## Deployment Steps

1. **Check Environment Variables**
   - Go to Netlify Dashboard
   - Site Settings > Environment Variables
   - Verify the correct Supabase URL is set

2. **Database Setup**
   - Run the complete_database_setup.sql in Supabase SQL Editor
   - Verify tables are created correctly

3. **Deploy**
   - Commit any changes: `git add . && git commit -m "Update"`
   - Push to GitHub: `git push origin main`
   - Netlify automatically builds and deploys

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
