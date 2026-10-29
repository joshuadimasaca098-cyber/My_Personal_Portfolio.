# Joshua P. Dimasaca | Portfolio

[![Live site](https://img.shields.io/badge/live-visit%20the%20site-2ea44f)](https://joshuadimasaca098-cyber.github.io/My_Personal_Portfolio./)
[![Repository](https://img.shields.io/badge/github-view%20the%20repository-181717)](https://github.com/joshuadimasaca098-cyber/My_Personal_Portfolio.)

Personal portfolio of **Joshua P. Dimasaca**, a 2nd year BSIT student learning web
development. Built with plain HTML, CSS and JavaScript, and hosted for free on
GitHub Pages.

| | |
| --- | --- |
| **Live site** | [joshuadimasaca098-cyber.github.io/My_Personal_Portfolio./](https://joshuadimasaca098-cyber.github.io/My_Personal_Portfolio./) |
| **Repository** | [github.com/joshuadimasaca098-cyber/My_Personal_Portfolio.](https://github.com/joshuadimasaca098-cyber/My_Personal_Portfolio.) |
| **Project 1** | [joshuadimasaca098-cyber.github.io/My_Personal_Portfolio./projects/live-message-preview.html](https://joshuadimasaca098-cyber.github.io/My_Personal_Portfolio./projects/live-message-preview.html) |
| **Contact** | [joshuadimasaca098@gmail.com](mailto:joshuadimasaca098@gmail.com) |

## Sections

| Section | Anchor | What is there |
| --- | --- | --- |
| Home / Introduction | `#top` | Name, role line, short intro, portrait and call-to-action buttons |
| About me | `#about` | Short bio plus a "right now" facts panel |
| Skills | `#skills` | Tools I use and the ones I am learning next |
| Projects | `#work` | Three project cards (two link to live pages or source) |
| Education & achievements | `#education` | Timeline of study and a list of achievements |
| Contact | `#contact` | Email, GitHub, phone, live site and a working message form |
| Footer | — | Copyright, links to the live site, the repository and email |

## Features

- Summer (sunny) and storm (rainy) themes, switched with a button and remembered
  on the next visit. Follows the system theme by default.
- Lightning drawn live on a canvas around the portrait, with rain and a flash.
- Typing role line, cursor glow, tilting cards and scroll reveal animations.
- Rain, thunder, ocean waves and bird sounds generated with the Web Audio API
  (no audio files), with a sound on/off toggle.
- Contact form that sends a real email without leaving the page.
- Responsive layout with a mobile navigation menu below 900px: an accessible
  toggle (`aria-expanded`, `aria-controls`), closes on link click, outside click
  or <kbd>Esc</kbd>, and refocuses the button.
- Accessibility: skip link to the main content, semantic landmarks, visible focus
  rings, labelled form fields, live status messages and a 44px menu target.
- Respects `prefers-reduced-motion` and pauses animations that are off screen.

## Tech

- **HTML5** for structure and semantics
- **CSS3** for custom properties, grid, flexbox and view transitions
- **Vanilla JavaScript** for canvas, IntersectionObserver, Web Audio and Fetch
- **GitHub Pages** for hosting
- **Formspree** for delivering contact-form messages

## Structure

```
index.html                  # the whole page: all seven sections
assets/
  css/style.css             # layout, both themes, mobile menu and animations
  js/script.js              # mobile menu, theme, canvas, sound, form
  images/portrait.jpg       # portrait used in the hero
projects/
  live-message-preview.html # Project 1: live message preview demo
README.md
LICENSE                     # The Unlicense
```

## Run it locally

Open `index.html` in a browser to see the design, but use a local web server to
test the contact form: browsers refuse form requests from `file://` pages.

```bash
# from this folder
python -m http.server 8000
# then open http://localhost:8000
```

Or use the **Live Server** extension in VS Code.

## Deploy (GitHub Pages)

The live site is published straight from the `main` branch, so every push goes
live in about a minute. No workflow file is needed.

1. Open the repository and go to **Settings > Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**, then click **Save**.

The site is served at
<https://joshuadimasaca098-cyber.github.io/My_Personal_Portfolio./>

> The old `.github/workflows/main.yml` file is not used by this setup and fails on
> every push. It can be deleted from the repository.

## Contact form (Formspree)

The form posts to [Formspree](https://formspree.io) in the background, so
visitors stay on the page and never need an email app. The endpoint is already
configured in `index.html`:

```html
<form action="https://formspree.io/f/meaakvbg" method="POST">
```

Messages are delivered to the email address set on that Formspree form. To send
them somewhere else, create a form at <https://formspree.io> and replace the
`action` with its endpoint, `https://formspree.io/f/<form id>`.

The free plan includes 50 submissions per month. Every submission, the
destination address and the allowed domains are managed in the Formspree
dashboard.

### If the form reports an error

- **Form not allowed / 403:** in Formspree open the form, go to **Settings** and
  add `joshuadimasaca098-cyber.github.io` to the allowed domains (or turn the
  domain restriction off).
- **Anything else:** the page always shows the email address as a fallback, so a
  visitor can still reach you.

The script validates the fields, blocks bots with two hidden honeypot fields,
disables the button while sending, gives up after 12 seconds, and shows a clear
success or error message. A FormSubmit endpoint is also supported: if the
`action` is a `formsubmit.co` URL the script posts there instead.

## License

Released under **The Unlicense**. See [LICENSE](LICENSE).
