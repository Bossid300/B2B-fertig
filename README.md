# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Media Library Phase 1

Before deploying the media library, apply `api/migrations/001_create_media_library.sql`
to the MariaDB database. This migration is intentionally not run by the application.

Set `GIGSDA_MEDIA_STORAGE_PATH` in the PHP runtime to a writable directory outside
the public web root. If unset, the API uses a `gigsda-media-storage` directory
beside the repository and rejects it if it resolves inside the configured document
root. The PHP runtime also needs the Fileinfo extension and upload limits large
enough for the supported media limits (25 MB images, 50 MB documents, 100 MB audio,
250 MB video).

The authenticated `api/media.php` endpoint lists the current user's uploaded media,
accepts new uploads, and streams authorized downloads. Phase 1 does not migrate or
modify profile and event media fields.
