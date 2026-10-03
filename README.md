# Parent Check In website

A static site: index.html, styles.css, script.js. No build step needed.

## 1. Fill in your details
Open `script.js` and edit the settings at the top:
- `FOUNDER_WHATSAPP`: your number with country code, digits only, e.g. `919845012345`
- `INVITE_CODES`: the codes you hand out, e.g. `FAMILY2026`
- `FORM_ENDPOINT` (optional): a Formspree URL. Leave empty and requests come to your WhatsApp.

## 2. Put it on GitHub
1. github.com > New repository > name it `parent-check-in` > Create
2. Click "uploading an existing file"
3. Drag in index.html, styles.css, script.js and README.md (the files, not the folder)
4. Commit changes

## 3. Deploy on Vercel
1. vercel.com > sign in with GitHub
2. Add New > Project > Import `parent-check-in`
3. Framework Preset: Other. Leave build settings empty.
4. Deploy. Your site is live on a vercel.app link.

Every time you edit a file on GitHub, Vercel redeploys automatically.

## 4. Custom domain (later)
Vercel > your project > Settings > Domains > add e.g. checkin.yourbrand.in, then add the DNS record Vercel shows you at your domain provider.

Notes
- Invite codes are visible in the page source, so they're a gentle gate, not security.
