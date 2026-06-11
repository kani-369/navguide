# Setup and Architecture

This file contains documentation regarding the frontend and potential integrations.

## Environment Configurations

The frontend consumes mock data directly in the browser through React Context (`AuthContext`). In production, configure the client `api.js` service to target the Node server endpoint defined in `.env`.

## Key Technologies

- **React v19 (or v18)**: Component rendering.
- **Tailwind CSS v4**: Zero-config compilation utilizing CSS variable injections.
- **Framer Motion**: Directional slide transitions for multi-step signup pages.
- **Lucide React**: Line icons for inputs and navigation buttons.
