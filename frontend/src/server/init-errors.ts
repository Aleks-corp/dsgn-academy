import { NextApiResponse } from 'next';

/**
 * Initializes global error handlers for Next.js server.
 */


export function initServerErrors() {
    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        // Optionally: process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason) => {
        console.error('Unhandled Rejection:', reason);
        // Optionally: process.exit(1);
    });
}

// Example API error handler middleware
export function apiErrorHandler(
    err: unknown,
    res: NextApiResponse
) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
}