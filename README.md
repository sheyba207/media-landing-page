# LocalWire.news Media Landing Page

A lightweight static landing page for media, SEO, and outreach lead capture on [LocalWire.news](https://www.localwire.news/). The project uses plain HTML, CSS, and minimal JavaScript, so it can be deployed for free on Vercel without a backend.

## Local Setup

Open the project folder and run a simple static server:

```bash
npx serve .
```

You can also open `index.html` directly in a browser because there is no build step.

## GitHub Workflow

```bash
git status
git add .
git commit -m "Build static media landing page"
git push origin main
```

Keep production changes on `main` unless you prefer feature branches and pull requests.

## Vercel Deployment

1. Go to [Vercel](https://vercel.com/) and sign in.
2. Choose **Add New Project**.
3. Import this GitHub repository.
4. Leave framework preset as **Other** or **Static**.
5. Use the default project settings. No build command is required.
6. Deploy.

Vercel will serve `index.html` as the landing page.

## Assets

Logo files live in `assets/` using URL-safe filenames:

| File | Partner |
| --- | --- |
| `localwire-news-logo.svg` | Site header logo |
| `ocnjdaily-com.png` | OCNJDaily.com |
| `sea-isle-news.jpg` | Sea Isle News |
| `breakingac.jpg` | BreakingAC |
| `somers-point-news.jpg` | Somers Point News |
| `ocean-city.jpg` | Ocean City |
| `philly-daily.jpg` | Philly Daily |
| `delco-now.jpg` | Delco Now |
| `broad-liberty.jpg` | Broad + Liberty |
| `downbeach.jpg` | Downbeach |
| `wbcb-sports.jpg` | WBCB Sports |
| `LocalWire-Media-Kit-2026.pdf` | Downloadable media kit PDF |
| `favicon.svg` | Browser favicon |

Original uploads with spaces in the filename are kept in `assets/` for reference. The site uses the URL-safe copies listed above.

## Web3Forms Setup

The contact form submits to the Web3Forms endpoint:

```html
https://api.web3forms.com/submit
```

The form includes the project access key:

```html
<input type="hidden" name="access_key" value="350863e5-6368-47df-a6b2-18a434739c1e">
```

Web3Forms uses this public access key to route submissions to the email address connected to that key. It is not a secret server API key and can be embedded in static HTML.

Dashboard: [https://app.web3forms.com/](https://app.web3forms.com/)

Documentation: [https://docs.web3forms.com/](https://docs.web3forms.com/)

## Web3Forms Hidden Fields

The form includes:

```html
<input type="hidden" name="access_key" value="350863e5-6368-47df-a6b2-18a434739c1e">
<input type="hidden" name="subject" value="New LocalWire Lead">
<input type="hidden" name="from_name" value="LocalWire Media Landing Page">
<input type="checkbox" name="botcheck" class="visually-hidden" tabindex="-1" autocomplete="off">
```

The `botcheck` field is a hidden anti-spam checkbox. Real users will not see it, but automated bots may fill it.

## Rotate or Regenerate the Access Key

1. Sign in to the Web3Forms dashboard.
2. Open the form or access key settings.
3. Regenerate or create a new access key.
4. Replace the `access_key` value in `index.html` with the new key.
5. Commit and redeploy the change through GitHub and Vercel.

## Test Submissions

1. Deploy the page or run it locally.
2. Submit a test lead through the contact form.
3. The page should stay in place and show an inline success message.
4. Confirm the lead arrives in the email inbox connected to the Web3Forms access key.
5. Check the Web3Forms dashboard if the email does not appear.

No backend, server, database, authentication, or dashboard code is required in this repository. Web3Forms handles the email delivery from the static form submission.

## Inline Success Handling

The `script.js` file intercepts form submissions with `fetch`, posts the data to Web3Forms, resets the form after a successful response, and displays an inline message. This avoids sending visitors to an external success page.

## SEO Files

- `robots.txt` allows indexing and points to the sitemap.
- `sitemap.xml` lists the homepage URL.

Production domain: `https://www.localwire.news/`

## Dynadot Custom Domain Setup

1. In Vercel, open the project.
2. Go to **Settings** then **Domains**.
3. Add your custom domain, such as `example.com` or `www.example.com`.
4. Vercel will show the DNS records required for that domain.
5. Log in to Dynadot.
6. Open **My Domains** then **Manage Domains**.
7. Select the domain and choose **DNS Settings**.
8. Add the Vercel DNS records shown in the Vercel dashboard.

## DNS Instructions for Vercel and Dynadot

Common Vercel records are:

```text
Type: A
Name: @
Value: 76.76.21.21
```

```text
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Use the exact records Vercel shows for your project if they differ.

## SSL

SSL is automatic through Vercel. After DNS propagation completes, Vercel provisions and renews the HTTPS certificate for the connected domain.
