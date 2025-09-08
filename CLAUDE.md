# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains the official website for AI Safety Mexico, an organization dedicated to promoting research, education, and policies on AI safety and alignment in Mexico. The website is built using standard HTML, CSS, and JavaScript and is hosted using GitHub Pages.

## Architecture

### Site Structure

- `index.html`: Main landing page with sections for About, Programs, Research, Members, and Contact
- `about.html`: Detailed page about the organization's mission and vision
- `css/style.css`: Centralized stylesheet (308 lines) with responsive design and a formal academic look
- `js/main.js`: JavaScript file (162 lines) containing interactive elements including smooth scrolling, active navigation, fade-in animations, and carousel functionality

### Asset Directories

- `images/`: Contains the organization logo (`aisafetymx_logo.png`) and other image assets
- `images/carousel/`: Contains 9 carousel images (carousel-image-1.jpeg through carousel-image-9.jpeg) showcasing the organization's activities
- `pictures_aisafetymx/`: Additional image assets including WhatsApp images and the organization logo

### Key Components

1. **Navigation System**: The site uses a single-page design with smooth scrolling to section anchors, along with active state highlighting based on scroll position.

2. **Image Carousel**: A responsive carousel on the main page showcases the organization's activities with auto-advancing slides, navigation buttons, and indicator dots. The carousel displays 9 different activity images.

3. **Responsive Design**: The website is fully responsive with mobile-specific styles defined in media queries.

## Development Workflow

### Local Development

To view the website locally:

```bash
# Using Python's built-in HTTP server
python -m http.server

# OR using Node.js http-server (if installed)
npx http-server
```

### Making Changes

1. Make changes to HTML, CSS, or JavaScript files as needed
2. Test changes locally using a local server
3. Commit changes following the existing commit message style 
4. Push to GitHub to automatically deploy via GitHub Pages

### Dependencies

The project has a `package.json` file with dependencies:
- `astro`: Indicating a potential plan to migrate to the Astro framework in the future
- `pako`: A compression library (present in node_modules)

Currently, the site uses vanilla HTML/CSS/JavaScript without requiring a build process for deployment.

## Branch Strategy

When contributing to this project:

1. Create a new feature branch from main: `git checkout -b feature/your-feature-name`
2. Make changes and test locally
3. Submit a pull request to the main branch