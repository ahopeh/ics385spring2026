/*
 * config.js - Secure Configuration Management
 * ICS 385 - Week 8 Intermediate Assignment
 * Author: April Hope
 * 
 * Purpose: Centralizes all API configuration, credentials, and app settings.
 * Uses localStorage for client-side key storage (in production, this would
 * be server-side environment variables). No other file should access
 * API keys directly — everything goes through this class.
 * 
 * Note: ChatGPT and Claude AI facilitated coding this project
 */

class SecureConfig {
    constructor() {
        // Load all config first, then validate that required keys exist
        this.config = this.loadConfiguration();
        // We don't validate on construction anymore — 
        // the dashboard will handle showing the API key modal if keys are missing
    }

    loadConfiguration() {
        return {
            apis: {
                // OpenWeatherMap — uses API key as a URL query parameter
                openWeather: {
                    key: this.getSecureApiKey('openweather'),
                    baseUrl: 'https://api.openweathermap.org/data/2.5',
                    endpoints: {
                        current: '/weather',
                        forecast: '/forecast'
                    },
                    rateLimit: {
                        requests: 60,       // Max 60 requests...
                        period: 60000       // ...per 60 seconds (1 minute)
                    },
                    timeout: 5000           // 5 second timeout
                },

                // RapidAPI (Chuck Norris) — uses API key in custom headers
                rapidApi: {
                    key: this.getSecureApiKey('rapidapi'),
                    host: 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
                    baseUrl: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
                    endpoints: {
                        random: '/jokes/random',
                        categories: '/jokes/categories'
                    },
                    rateLimit: {
                        requests: 100,
                        period: 60000
                    },
                    timeout: 3000
                },

                // JokeAPI — no authentication needed at all
                jokeApi: {
                    baseUrl: 'https://sv443.net/jokeapi/v2',
                    endpoints: {
                        joke: '/joke/Programming',
                        categories: '/categories'
                    },
                    rateLimit: {
                        requests: 120,
                        period: 60000
                    },
                    timeout: 3000
                }
            },

            app: {
                name: 'UH Maui Campus Dashboard',
                version: '1.0.0',
                defaultCity: 'Kahului',
                refreshInterval: 10 * 60 * 1000,   // 10 minutes in milliseconds
                cacheExpiry: 10 * 60 * 1000,        // Cache lives for 10 minutes
                maxRetries: 3,
                retryDelay: 1000                     // 1 second between retries
            },

            ui: {
                animationDuration: 300,     // CSS transition timing (ms)
                toastDuration: 5000,        // How long notifications stay visible
                modalTimeout: 10000,        // Auto-close modals after 10 seconds
                loadingDelay: 500           // Delay before showing loading spinner
            }
        };
    }

    /**
     * Retrieves an API key from localStorage.
     * Returns null instead of throwing — this lets the app start up
     * and show the API key setup modal rather than crashing immediately.
     */
    getSecureApiKey(service) {
        const key = localStorage.getItem(service + '_api_key');
        if (!key) {
            console.warn('API key for ' + service + ' not configured.');
            return null;
        }
        return key;
    }

    /**
     * Checks which API keys are missing.
     * Returns an array of missing key names (empty array = all good).
     * The dashboard uses this to decide whether to show the setup modal.
     */
    validateConfiguration() {
        const required = [
            { key: 'openweather_api_key', label: 'OpenWeatherMap' },
            { key: 'rapidapi_api_key', label: 'RapidAPI' }
        ];

        const missing = required.filter(
            item => !localStorage.getItem(item.key)
        );

        return missing;
    }

    /**
     * Returns the full config object for a specific API service.
     * Usage: appConfig.getApiConfig('openWeather')
     */
    getApiConfig(service) {
        if (!this.config.apis[service]) {
            throw new Error('Unknown API service: ' + service);
        }
        return this.config.apis[service];
    }

    getAppConfig() {
        return this.config.app;
    }

    getUiConfig() {
        return this.config.ui;
    }
}

// Create a single global instance that all other files will use
const appConfig = new SecureConfig();