# Release Notes

## Event Registration Update (March 11, 2026)

This release improves event registration clarity and usability for both students and admins.

### Highlights
- Replaced RSVP wording with clearer Registration wording across student and admin views.
- Simplified registration confirmation language and success/error messaging.
- Improved registration modal action button layout and alignment.
- Standardized backend responses to use Registration terminology.
- Added frontend message normalization to keep wording consistent even if older API text appears.

### Result
- Easier registration flow for students.
- More consistent terminology across UI and admin panel.
- Cleaner, more reliable registration experience overall.

## Blog / Comments Update (March 13, 2026)

This release improves the blog post experience, focusing on comments and interaction reliability.

### Highlights
- Backend: prevent duplicate likes by storing a `likedBy` identifier per comment and returning the updated comment on like/unlike.
- Backend: ensure `createdAt` is stored for comments so timestamps can be displayed in the UI.
- Frontend: send a stable `clientId` (or authenticated `userId`) with like requests and update the UI from the server response.
- Frontend: compact single-line comment layout with avatar, name, message, timestamp and a persistent Like button.
- UI: tightened blog cards (smaller images, reduced padding/gaps) and subtle hover states for a magazine-style look.

### Developer notes
- Endpoints updated/added: comment creation, comment list, and comment like toggle (server enforces one-like-per-user).
- If the app has no auth, the client should generate and persist a `clientId` in `localStorage` to identify likers.
- To test locally:

```bash
cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

### Result
- More reliable comment interactions: users cannot like a comment multiple times and like counts reflect server state.
- Clear comment timestamps improve conversation context.

