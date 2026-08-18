# Architecture Decisions

## React instead of Next.js

React was selected for the frontend because the application is primarily an interactive estimator and admin dashboard.

## Express

Express provides a simple REST API layer between the React frontend and MongoDB.

## MongoDB

MongoDB was selected because estimator configuration and question structures are naturally represented as nested documents.

## Configuration-Driven Design

Questions, options and pricing modifiers are stored in MongoDB rather than hardcoded into React.

This allows an administrator to modify the estimator without changing frontend source code.

## Server-Side Calculation

The estimate is calculated on the backend so pricing logic is not trusted from the browser.

## JWT Authentication

JWT is used to protect admin endpoints.

## MongoDB Versioning

Configuration changes increment the configuration version so estimates can be associated with the configuration used at calculation time.