/*
* api-client.js - Unified API Client
* ICS 385 - Week 8 Intermediate Assignment
* Author: April Hope
*
* Purpose: Single interface for all API calls. Handles three different auth 
* methods, caching, rate limiting, and error fallbacks. The dashboard never 
* calls fetch() directly - it always goes through here. 
*
* Note: ChatGPT and Claude AI facilitated coding this project
*/

class UnifiedApiClient {
    constructor(config) {
        this.config = config;

        // Cache stores API responses so we don't re-fetch data we already have 
        // Structure: Map of "cacheKey" => { data: {...}, timestamp: 1234567890 }
        this.cache = new Map();

        // Rate limiters track how many requests we've made per API per time window
        //This will prevent hitting API limits and getting blocked 
        this.rateLimiters = new Map();

        this.initializeRateLimiters();
    }

    /**
     * Sets up a rate limiter for each API service. 
     * Each limiter tracks an array of request timestamps
     * so we can count how many happened within the time window.
     * 
     * This is the foundation! 
     */
    initializeRateLimiters() {
        Object.keys(this.config.apis).forEach(service => {
            this.rateLimiters.set(service, {
                requests: [],
                limit: this.config.apis[service].rateLimit.requests,
                perido: this.config.apis[service].rateLimit.period 
            });
        });
    }
    
    /**
     * Central method for all API requests.
     * Flow: Check rate limit → Check cache → Build request → Fetch → Cache result
     * If anything fails, return fallback data instead of crashing.
     * 
     * This is the core method 
     */

    async makeRequest(service, endpoint, params = {}, options = {}) {
        try {
            // Step 1: Are we sending too many requests to this API?
            if (!this.checkRateLimit(service)) {
                throw new Error('Rate limit exceeded for ' + service + '. Please wait.');
            }

            // Step 2: Do we already have fresh data for this exact request?
            const cacheKey = this.getCacheKey(service, endpoint, params);
            if (this.isValidCache(cacheKey)) {
                console.log('Cache hit for', service, endpoint);
                return this.cache.get(cacheKey).data;
            }

            // Step 3: Build the request (URL, headers, auth) based on which API
            const requestConfig = this.buildRequest(service, endpoint, params, options);

            // Step 4: Make the fetch call with a timeout
            // AbortController lets us cancel the request if it takes too long
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                this.config.apis[service].timeout
            );

            const response = await fetch(requestConfig.url, {
                ...requestConfig.options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Step 5: Check if the API returned an error status
            if (!response.ok) {
                throw new Error(
                    service + ' API error: ' + response.status + ' - ' + response.statusText
                );
            }

            const data = await response.json();

            // Step 6: Save this response in cache for next time
            this.cacheResponse(cacheKey, data);

            // Step 7: Record this request for rate limiting
            this.updateRateLimit(service);

            return data;

        } catch (error) {
            console.error('API request failed:', error);
            // Instead of crashing, return fallback data
            return this.handleApiError(service, endpoint, error);
        }
    }

    /**
     * Builds the URL and headers for each API's specific requirements.
     * This is where the three different auth methods are handled:
     * - OpenWeather: API key goes in the URL as a query parameter
     * - RapidAPI: API key goes in custom request headers
     * - JokeAPI: No auth needed at all
     * 
     * This is where al lthe different auth styles get handled. Basically it's the translator part. 
     */

    buildRequest(service, endpoint, params, options) {
        const apiConfig = this.config.apis[service];
        let url = apiConfig.baseUrl + endpoint;
        const headers = { 'Content-Type': 'application/json', ...options.headers };

        switch (service) {
            case 'openWeather':
                // OpenWeather wants the key as "appid" in the query string
                const weatherParams = new URLSearchParams({
                    ...params,
                    appid: apiConfig.key,
                    units: 'imperial'       // Fahrenheit for Hawaii!
                });
                url += '?' + weatherParams.toString();
                break;

            case 'rapidApi':
                // RapidAPI uses custom headers for authentication
                headers['X-RapidAPI-Key'] = apiConfig.key;
                headers['X-RapidAPI-Host'] = apiConfig.host;
                break;

            case 'jokeApi':
                // JokeAPI needs no auth — just append any params to URL
                if (Object.keys(params).length > 0) {
                    url += '?' + new URLSearchParams(params).toString();
                }
                break;
        }

        return {
            url: url,
            options: {
                method: 'GET',
                headers: headers
            }
        };
    }

    // ===== RATE LIMITING =====

    /**
     * Checks if we're still under the rate limit for a given API.
     * Filters out old timestamps that are outside the time window,
     * then checks if we have room for another request.
     */
    checkRateLimit(service) {
        const limiter = this.rateLimiters.get(service);
        const now = Date.now();

        // Remove timestamps older than the rate limit window
        limiter.requests = limiter.requests.filter(
            time => now - time < limiter.period
        );

        return limiter.requests.length < limiter.limit;
    }

    /** Records that we just made a request to this service */
    updateRateLimit(service) {
        this.rateLimiters.get(service).requests.push(Date.now());
    }

    // ===== CACHING =====

    /** Creates a unique key for each unique API request */
    getCacheKey(service, endpoint, params) {
        return service + ':' + endpoint + ':' + JSON.stringify(params);
    }

    /** Checks if we have cached data that hasn't expired yet */
    isValidCache(cacheKey) {
        if (!this.cache.has(cacheKey)) return false;
        const cached = this.cache.get(cacheKey);
        return Date.now() - cached.timestamp < this.config.app.cacheExpiry;
    }

    /** Stores API response data with a timestamp */
    cacheResponse(cacheKey, data) {
        this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });
    }

    // ===== ERROR HANDLING =====

    /**
     * Returns realistic-looking fallback data when an API call fails.
     * The "error: true" flag tells the UI to show a warning message.
     * This is "graceful degradation" — the dashboard keeps working
     * even when individual APIs are down.
     */

    handleApiError(service, endpoint, error) {
        console.error('API Error Details:', {
            service: service,
            endpoint: endpoint,
            error: error.message,
            timestamp: new Date().toISOString()
        });

        switch (service) {
            case 'openWeather':
                return {
                    name: 'Kahului',
                    main: { temp: 78, humidity: 65 },
                    weather: [{ description: 'partly cloudy', icon: '02d' }],
                    wind: { speed: 12 },
                    error: true,
                    message: 'Weather data temporarily unavailable'
                };

            case 'rapidApi':
                return {
                    value: "Chuck Norris doesn't need the internet. The internet needs Chuck Norris.",
                    error: true,
                    message: 'Chuck Norris jokes temporarily unavailable'
                };

            case 'jokeApi':
                return {
                    joke: 'Why do programmers prefer dark mode? Because light attracts bugs!',
                    error: true,
                    message: 'Programming jokes temporarily unavailable'
                };

            default:
                throw error;
        }
    }

    // ===== CONVENIENCE METHODS =====
    // These are what the dashboard actually calls.
    // They hide the details of endpoints and parameters.

    async getWeather(city = 'Kahului') {
        return this.makeRequest('openWeather', '/weather', { q: city + ',US' });
    }

    async getChuckNorrisJoke() {
        return this.makeRequest('rapidApi', '/jokes/random');
    }

    async getProgrammingJoke() {
        return this.makeRequest('jokeApi', '/joke/Programming', { type: 'single' });
    }

    /**
     * Fetches both jokes at the same time using Promise.allSettled.
     * "allSettled" is key here — unlike Promise.all, it doesn't fail
     * if one promise rejects. We get results from whichever APIs work.
     */
    async getAllJokes() {
        try {
            const [chuck, programming] = await Promise.allSettled([
                this.getChuckNorrisJoke(),
                this.getProgrammingJoke()
            ]);

            return {
                chuck: chuck.status === 'fulfilled' ? chuck.value : null,
                programming: programming.status === 'fulfilled' ? programming.value : null
            };
        } catch (error) {
            console.error('Failed to fetch jokes:', error);
            return { chuck: null, programming: null };
        }
    }
}