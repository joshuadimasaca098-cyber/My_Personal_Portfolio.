# Joshua P. Dimasaca | Portfolio

Static portfolio built with HTML, CSS and JavaScript.

## Structure

```
index.html
assets/
  css/style.css
  js/script.js
  images/portrait.jpg
.github/workflows/deploy.yml   # auto deploy to GitHub Pages
```

## Auto deploy (GitHub Pages)

1. Push this folder to a GitHub repository (branch `main`).
2. In the repo go to **Settings > Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` now deploys automatically. Progress shows in the **Actions** tab.

Your site will be at `https://<username>.github.io/<repo>/`.

## Contact form (FormSubmit, no account needed)

The form posts to [FormSubmit](https://formsubmit.co) in the background, so visitors
never leave the page and never need an email app. Everything is configured already:

```html
<form action="https://formsubmit.co/joshuadimasaca098@gmail.com" method="POST">
```

Messages are emailed to the address in the `action`. To send them somewhere else,
change that address in `index.html`.

### One-time activation (do this once after deploying)

1. Open the live site and send yourself a test message through the form.
2. Check `joshuadimasaca098@gmail.com` for a **FormSubmit confirmation email** and
   click the activation link. (Check the spam folder too.)
3. Send one more test message to confirm it arrives.

Submissions made before activation are kept by FormSubmit for 30 days, so no
visitor messages are lost while the form is inactive. Until the address is
confirmed, FormSubmit emails an activation link for each new submission.

### Using Formspree instead (optional)

If you would rather use Formspree, create a form at https://formspree.io, then set
the form's `action` in `index.html` to `https://formspree.io/f/YOUR_FORM_ID`. The
script detects Formspree URLs automatically and posts there instead.

The script validates the fields, blocks bots with two hidden honeypot fields,
disables the button while sending, and shows a clear success or error message
(always with a direct email fallback).
