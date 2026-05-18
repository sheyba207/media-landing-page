# Media Landing Page

A lightweight static landing page for media, SEO, and outreach lead capture. The project uses plain HTML, CSS, and minimal JavaScript, so it can be deployed for free on Vercel without a backend.

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

## Replace Email in FormSubmit

In `index.html`, replace both instances of:

```html
https://formsubmit.co/YOUR_EMAIL_HERE
```

with your email address:

```html
https://formsubmit.co/you@example.com
```

The form includes these hidden fields:

```html
_subject = New Landing Page Lead
_template = table
_captcha = false
```

## Verify FormSubmit Email

1. Deploy the page or run it locally.
2. Submit a test lead through the form.
3. FormSubmit will send a verification email to the address used in the form action.
4. Open the verification email and confirm the address.
5. Submit another test lead and verify that it arrives in your inbox.

## Success Redirect

The page includes a redirect-ready success message. After deployment, uncomment the optional `_next` field in each form and replace the domain:

```html
<input type="hidden" name="_next" value="https://your-domain.com/?submitted=true#contact" />
```

When FormSubmit redirects back to that URL, the page displays the success message in the contact section.

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
