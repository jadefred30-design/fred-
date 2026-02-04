# Fred - ViralLoop Landing Page

A static website landing page for ViralLoop, a growth workspace for creators and brands.

## Local Development

### Option 1: Direct Browser View
Open `index.html` in your browser to view the site.

### Option 2: Local HTTP Server
Run a local server for proper asset loading:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Container Build

This project includes a Dockerfile for containerization.

### Build the Image
```bash
docker build -t fred-static .
```

### Run the Container
```bash
docker run -p 8080:80 fred-static
```

Then visit `http://localhost:8080`.

## Deployment

The repository includes a GitHub Actions workflow for OpenShift deployment. Push to the main branch to trigger CI/CD.

## Project Structure

- `index.html` - Main landing page
- `styles.css` - Stylesheet
- `Dockerfile` - Container build configuration
- `.github/workflows/openshift.yml` - OpenShift deployment workflow
