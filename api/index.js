/**
 * Vercel Serverless Function Entrypoint
 * Bridges Vercel serverless requests into the Express application.
 */
const app = require('../server');

module.exports = app;
