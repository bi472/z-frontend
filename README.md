# z-frontend

## Demo link:

Coming soon

## Documentation

Coming soon

## Table of Content:

- About The App
- Technologies
- Screenshots
- Setup
- Environment Variables
- To-Do
- Documentation
- Status
- Related Projects

## About The App

z-frontend is the frontend application for a Twitter-like platform, designed to implement a tree-like structure for message replies.

## Technologies

This project uses:

- **React**
- **TypeScript**
- **Axios** for API requests
- **Jest** for testing

## Screenshots

### Home Page
[![Home Page](https://i.postimg.cc/G8NFrnkF/IMG-20240608-123643-204.jpg)](https://postimg.cc/G8NFrnkF)

### Notifications
[![Notifications](https://i.postimg.cc/JDtN9zB7/IMG-20240608-123646-570.jpg)](https://postimg.cc/JDtN9zB7)

### Bookmarks
[![Bookmarks](https://i.postimg.cc/xk6Gxz8F/IMG-20240608-123653-511.jpg)](https://postimg.cc/xk6Gxz8F)

## Setup

```bash
git clone https://github.com/bi472/z-frontend.git
cd z-frontend

# Install dependencies
npm install

# Create .env file based on .env-example
cp .env-example .env
nano .env

# Start the application
npm start
```

Done!

## Environment Variables

```plaintext
REACT_APP_API_URL=http://localhost:4000
```

## To-Do

- Add form validation.
- Improve component testing.
- Optimize for production.
- Implement pagination.
- Implement multi-line text hiding.
- Complete Axios service.

## Status

z-frontend works stably. Main features are implemented.

## Related Projects

- [z-backend](https://github.com/bi472/z-backend)
