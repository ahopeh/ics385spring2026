/*
 * dashboard.js - Main Dashboard Controller
 * ICS 385 - Week 8 Intermediate Assignment
 * Author: April Hope
 * 
 * Purpose: Orchestrates all dashboard components. Coordinates the
 * CourseCatalogManager, UnifiedApiClient, weather widget, humor widget,
 * and statistics display. Handles initialization, auto-refresh, 
 * API key setup, and data export. It's like a stage manager who tells actors when to enter, their blocking, and what to do, but it doesn't actually perform the scenes itself. 
 * 
 * Note: ChatGPT and Claude AI facilitated coding this project
 */

class CampusDashboard {
    constructor() {
        // appConfig comes from config.js (loaded before this file)
        this.config = appConfig;

        // The API client handles all external requests
        this.apiClient = new UnifiedApiClient(this.config.config);

        // Course catalog manager from our previous assignment
        this.courseCatalog = new CourseCatalogManager();

        // Track auto-refresh timers so we can clean them up if needed
        this.refreshTimers = new Map();

        // Track when each widget was last updated (for "5 min ago" display)
        this.lastUpdated = new Map();

        // Kick everything off
        this.initialize();
    }

    async initialize() {
        try {
            // Step 1: Check if API keys are configured
            this.initializeApiKeySetup();

            // Step 2: Wire up button clicks and other UI events
            this.setupEventListeners();

            // Step 3: Load all data (courses + APIs)
            await this.loadInitialData();

            // Step 4: Start automatic weather refresh
            this.startAutoRefresh();

            // Step 5: Show a welcome toast notification
            this.showToast('Dashboard loaded successfully!', 'success');

        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    // ===== API KEY MANAGEMENT =====

    /**
     * Checks for missing API keys and shows the setup modal if needed.
     * Uses SecureConfig's validateConfiguration() to see what's missing.
     */
    initializeApiKeySetup() {
        const missing = this.config.validateConfiguration();
        if (missing.length > 0) {
            this.showApiKeySetupModal();
        }
    }

    showApiKeySetupModal() {
        const modal = document.getElementById('apiKeyModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    /**
     * Saves API keys from the modal inputs into localStorage,
     * then reloads the page so SecureConfig picks them up fresh.
     */
    saveApiKeys() {
        const openWeatherKey = document.getElementById('openWeatherKey').value.trim();
        const rapidApiKey = document.getElementById('rapidApiKey').value.trim();

        if (openWeatherKey) {
            localStorage.setItem('openweather_api_key', openWeatherKey);
        }
        if (rapidApiKey) {
            localStorage.setItem('rapidapi_api_key', rapidApiKey);
        }

        document.getElementById('apiKeyModal').style.display = 'none';
        this.showToast('API keys saved! Reloading...', 'success');

        // Short delay so the user sees the toast, then reload
        setTimeout(() => window.location.reload(), 1000);
    }

    // ===== EVENT LISTENERS =====

    /**
     * Wiring up all the buttons! 
     */

    setupEventListeners() {
        // Settings button opens the API key modal
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showApiKeySetupModal());
        }

        // Refresh All button reloads everything
        const refreshAllBtn = document.getElementById('refreshAllBtn');
        if (refreshAllBtn) {
            refreshAllBtn.addEventListener('click', () => this.refreshAll());
        }

        // Save keys button in the modal
        const saveKeysBtn = document.getElementById('saveKeysBtn');
        if (saveKeysBtn) {
            saveKeysBtn.addEventListener('click', () => this.saveApiKeys());
        }

        // Skip button closes the modal without saving
        const skipKeysBtn = document.getElementById('skipKeysBtn');
        if (skipKeysBtn) {
            skipKeysBtn.addEventListener('click', () => {
                document.getElementById('apiKeyModal').style.display = 'none';
            });
        }

        // Set up the course catalog's search and filter listeners
        this.courseCatalog.setupEventListeners();
    }

    // ===== DATA LOADING =====

    /**
     * Loads all dashboard data on startup.
     * Course data loads first (it's local, so fast),
     * then API data loads (network calls, might be slow).
     * 
     * This is where everything comes together
     */
    async loadInitialData() {
        this.showLoadingState();

        try {
            // Load local course data first
            await this.courseCatalog.loadCourseData();

            // Load API data concurrently — don't wait for weather 
            // to finish before starting jokes
            await Promise.allSettled([
                this.loadWeatherData(),
                this.loadHumorData()
            ]);

            // Update the stats bar with combined data
            this.updateDashboardStats();

        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showToast('Some dashboard data failed to load', 'error');
        } finally {
            // Always hide loading, even if something failed
            this.hideLoadingState();
        }
    }

    async loadWeatherData() {
        try {
            const weatherData = await this.apiClient.getWeather();
            this.displayWeatherWidget(weatherData);
            this.lastUpdated.set('weather', Date.now());
        } catch (error) {
            console.error('Weather loading failed:', error);
            this.displayWeatherWidget({
                name: 'Kahului',
                main: { temp: '--', humidity: '--' },
                weather: [{ description: 'unavailable', icon: '02d' }],
                wind: { speed: '--' },
                error: true,
                message: 'Could not load weather data'
            });
        }
    }

    async loadHumorData() {
        try {
            const jokes = await this.apiClient.getAllJokes();
            this.displayHumorWidget(jokes);
            this.lastUpdated.set('humor', Date.now());
        } catch (error) {
            console.error('Humor loading failed:', error);
            this.displayHumorWidget({ chuck: null, programming: null });
        }
    }

    // ===== WIDGET DISPLAY =====

    displayWeatherWidget(data) {
        const container = document.getElementById('weather-widget');
        if (!container) return;

        const isError = data.error;
        const temp = typeof data.main.temp === 'number' ? Math.round(data.main.temp) + '°F' : '--';

        container.innerHTML =
            '<div class="widget-header">' +
                '<h3>Campus Weather</h3>' +
            '<span class="last-updated">' + this.getTimeAgo('weather') + '</span>' +
            '</div>' +
            '<div class="weather-content ' + (isError ? 'error-state' : '') + '">' +
            '<div class="weather-main">' +
            '<div class="temperature">' + temp + '</div>' +
            '<div class="location">' + (data.name || 'Kahului') + '</div>' +
            '<div class="description">' + data.weather[0].description + '</div>' +
            '</div>' +
            '<div class="weather-details">' +
            '<span>Humidity: ' + data.main.humidity + '%</span>' +
            '<span>Wind: ' + data.wind.speed + ' mph</span>' +
            '</div>' +
            (isError ? '<div class="error-badge">' + data.message + '</div>' : '') +
            '</div>';
    }

    displayHumorWidget(jokes) {
        const container = document.getElementById('humor-widget');
        if (!container) return;

        const chuckJoke = jokes.chuck
            ? (jokes.chuck.value || 'Chuck Norris joke unavailable')
            : 'Chuck Norris joke unavailable';

        const progJoke = jokes.programming
            ? (jokes.programming.joke ||
                (jokes.programming.setup + ' ... ' + jokes.programming.delivery) ||
                'Programming joke unavailable')
            : 'Programming joke unavailable';

        container.innerHTML =
            '<div class="widget-header">' +
            '<h3>Campus Humor</h3>' +
            '<button class="refresh-btn" id="refreshHumorBtn">New Jokes</button>' +
            '</div>' +
            '<div class="humor-content">' +
            '<div class="joke-section">' +
            '<h4>Chuck Norris Fact</h4>' +
            '<p class="joke-text">' + chuckJoke + '</p>' +
            '</div>' +
            '<div class="joke-section">' +
            '<h4>Programming Humor</h4>' +
            '<p class="joke-text">' + progJoke + '</p>' +
            '</div>' +
            '</div>';

        const btn = document.getElementById('refreshHumorBtn');
        if (btn) {
            btn.addEventListener('click', () => this.refreshHumor());
        }
    }

    // ===== STATISTICS =====

    updateDashboardStats() {
        const courses = this.courseCatalog.getAllCourses();
        const totalCourses = courses.length;
        const totalStudents = this.courseCatalog.calculateTotalEnrollment();
        const avgCapacity = this.courseCatalog.calculateAverageCapacity();
        const apiStatus = this.lastUpdated.has('weather') ? 'Connected' : 'Disconnected';

        this.setStatValue('total-courses', totalCourses);
        this.setStatValue('total-students', totalStudents);
        this.setStatValue('avg-capacity', avgCapacity + '%');
        this.setStatValue('api-status', apiStatus);
    }

    /** Helper to safely set text content of stat elements */
    setStatValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // ===== AUTO REFRESH =====

    startAutoRefresh() {
        // Refresh weather every 10 minutes
        this.refreshTimers.set('weather', setInterval(() => {
            this.loadWeatherData();
            this.updateDashboardStats();
        }, this.config.getAppConfig().refreshInterval));

        // Update "last updated" displays every minute
        this.refreshTimers.set('time', setInterval(() => {
            this.updateTimeDisplays();
        }, 60 * 1000));
    }

    updateTimeDisplays() {
        const weatherUpdated = document.querySelector('#weather-widget .last-updated');
        if (weatherUpdated) {
            weatherUpdated.textContent = this.getTimeAgo('weather');
        }
    }

    // ===== USER ACTIONS =====

    async refreshHumor() {
        const btn = document.getElementById('refreshHumorBtn');
        if (btn) {
            btn.textContent = 'Loading...';
            btn.disabled = true;
        }

        try {
            // Clear the cache so we get fresh jokes
            this.apiClient.cache.clear();
            await this.loadHumorData();
        } finally {
            if (btn) {
                btn.textContent = 'New Jokes';
                btn.disabled = false;
            }
        }
    }

    async refreshWeather() {
        this.showToast('Refreshing weather...', 'info');
        this.apiClient.cache.clear();
        await this.loadWeatherData();
        this.updateDashboardStats();
    }

    async refreshAll() {
        this.showToast('Refreshing all data...', 'info');
        this.apiClient.cache.clear();
        await this.loadInitialData();
    }

    /**
     * Exports all dashboard data as a downloadable JSON file.
     * Combines course data with the last known weather and API status.
     */
    exportData() {
        const exportPayload = {
            exportDate: new Date().toISOString(),
            dashboard: {
                courses: this.courseCatalog.exportCourseData(),
                apiStatus: {
                    weather: this.lastUpdated.has('weather') ? 'connected' : 'disconnected',
                    lastWeatherUpdate: this.lastUpdated.get('weather') || null,
                    lastHumorUpdate: this.lastUpdated.get('humor') || null
                }
            }
        };

        // Create a downloadable JSON file
        const blob = new Blob(
            [JSON.stringify(exportPayload, null, 2)],
            { type: 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'dashboard-export-' + Date.now() + '.json';
        link.click();
        URL.revokeObjectURL(url);

        this.showToast('Data exported successfully!', 'success');
    }

    // ===== UI HELPERS =====

    showLoadingState() {
        const container = document.getElementById('dashboard-container');
        if (container) container.classList.add('loading-state');
    }

    hideLoadingState() {
        const container = document.getElementById('dashboard-container');
        if (container) container.classList.remove('loading-state');
    }

    /**
     * Shows a temporary toast notification.
     * Types: 'success', 'error', 'info'
     */
    showToast(message, type = 'info') {
        // Remove any existing toast
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('toast-visible'), 10);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove('toast-visible');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    /** Returns human-readable time since last update */
    getTimeAgo(service) {
        if (!this.lastUpdated.has(service)) return 'Never';
        const minutes = Math.floor(
            (Date.now() - this.lastUpdated.get(service)) / 60000
        );
        if (minutes === 0) return 'Just now';
        if (minutes === 1) return '1 min ago';
        return minutes + ' min ago';
    }

    handleInitializationError(error) {
        console.error('Dashboard initialization failed:', error);
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML =
                '<div class="initialization-error">' +
                '<h2>Dashboard Initialization Failed</h2>' +
                '<p>' + error.message + '</p>' +
                '<button onclick="location.reload()">Retry</button>' +
                '</div>';
        }
    }
}

// ===== START THE DASHBOARD =====
// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new CampusDashboard();
});