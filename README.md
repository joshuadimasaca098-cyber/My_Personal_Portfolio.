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

## Contact form (Formspree)

1. Create a form at https://formspree.io and copy its ID (the part after `/f/`).
2. In `index.html`, replace `YOUR_FORM_ID` in the form's `action` with it.
3. In Formspree, add your GitHub Pages domain under the form's allowed domains if you enabled that setting.

Until the ID is set, the form opens the visitor's email app instead.
