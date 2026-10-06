# fimolabs.com

The Fimo Labs company site. Plain HTML, CSS and JavaScript, deployed by Vercel on every push to main.

- `index.html`: the company homepage
- `contact.html`, `privacy.html`, `terms.html`, `refunds.html`: contact and legal pages
- `site.css`: all styles
- `site.js`: the year grid and engine animations, plus the Oyesun link (set `OYESUN_URL` at the top)
- `checkin/`: the Checkin product landing page (`index.html`, `checkin.css`, `checkin.js`),
  served at both `fimolabs.com/checkin` and `checkin.fimolabs.com`
- `vercel.json`: clean URLs, so `/privacy` serves `privacy.html`, plus a host rewrite that
  maps the root of `checkin.fimolabs.com` to `checkin/index.html`

Contact email everywhere: pm.ferozmd@gmail.com
