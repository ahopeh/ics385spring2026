/*
 * course-catalog.js - Course Catalog Manager
 * ICS 385 - Week 8 Intermediate Assignment
 * Author: April Hope
 * 
 * Description: Loads course data from a JSON file and displays it,
 * creating a course catalog searchable via department, course code,
 * title, instructor, and topics. Enhanced for dashboard integration
 * with statistics helper methods.
 * 
 * Note: ChatGPT and Claude AI facilitated coding this project
 */

class CourseCatalogManager {
    constructor() {
        this.allCourses = [];
        this.filteredCourses = [];
        this.departments = [];      // NEW: store department list for the filter dropdown
    }

    /**
     * Initialize event listeners separately from constructor.
     * This lets the dashboard control WHEN listeners are attached,
     * since the DOM elements might not exist yet when the class is created.
     */
    setupEventListeners() {
        const searchInput = document.getElementById("searchInput");
        const deptFilter = document.getElementById("departmentFilter");

        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.searchCourses(e.target.value);
            });
        }

        if (deptFilter) {
            deptFilter.addEventListener("change", (e) => {
                this.filterByDepartment(e.target.value);
            });
        }
    }

    // Load JSON course data from file
    async loadCourseData() {
        try {
            const response = await fetch("sample-data.json");
            const data = await response.json();

            this.allCourses = [];
            this.departments = data.departments;    // NEW: save departments

            data.departments.forEach((department) => {
                department.courses.forEach((course) => {
                    this.allCourses.push({
                        ...course,
                        departmentCode: department.code,
                        departmentName: department.name
                    });
                });
            });

            this.filteredCourses = [...this.allCourses];
            this.populateDepartmentFilter();    // NEW: fill the dropdown
            this.displayAllCourses();

            return this.allCourses;             // NEW: return data so dashboard can use it

        } catch (error) {
            console.error("Error loading JSON:", error);
            document.getElementById("coursesContainer").innerHTML =
                "<p>Could not load course data.</p>";
            return [];
        }
    }

    /**
     * NEW: Populates the department dropdown from the actual data
     * instead of hardcoding options in HTML.
     */
    populateDepartmentFilter() {
        const select = document.getElementById("departmentFilter");
        if (!select) return;

        // Keep the "All Departments" option, clear the rest
        select.innerHTML = '<option value="all">All Departments</option>';

        this.departments.forEach(dept => {
            const option = document.createElement("option");
            option.value = dept.code;
            option.textContent = dept.name;
            select.appendChild(option);
        });
    }

    displayAllCourses() {
        const container = document.getElementById("coursesContainer");
        if (!container) return;
        container.innerHTML = "";

        if (this.filteredCourses.length === 0) {
            container.innerHTML = "<p>No courses found.</p>";
            return;
        }

        this.filteredCourses.forEach((course) => {
            const card = document.createElement("div");
            card.className = "course-card";

            // UPDATED: Added enrolled/capacity display
            const capacityPercent = Math.round(
                (course.enrolled / course.maxCapacity) * 100
            );

            card.innerHTML = `
                <h2>${course.courseCode}</h2>
                <h3>${course.title}</h3>
                <p><strong>Department:</strong> ${course.departmentName}</p>
                <p><strong>Credits:</strong> ${course.credits}</p>
                <p><strong>Instructor:</strong> ${course.instructor.name}</p>
                <p><strong>Enrollment:</strong> ${course.enrolled}/${course.maxCapacity} (${capacityPercent}%)</p>
                <p><strong>Topics:</strong> ${course.topics.join(", ")}</p>
            `;

            container.appendChild(card);
        });
    }

    // Your original search method — unchanged
    searchCourses(query) {
        const term = query.trim().toLowerCase();

        if (term === "") {
            this.filteredCourses = [...this.allCourses];
            this.displayAllCourses();
            return;
        }

        this.filteredCourses = this.allCourses.filter((course) => {
            return (
                course.courseCode.toLowerCase().includes(term) ||
                course.title.toLowerCase().includes(term) ||
                course.departmentName.toLowerCase().includes(term) ||
                course.instructor.name.toLowerCase().includes(term) ||
                course.topics.join(" ").toLowerCase().includes(term)
            );
        });

        this.displayAllCourses();
    }

    // Your original filter method — unchanged
    filterByDepartment(departmentCode) {
        const searchInput = document.getElementById("searchInput");
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

        let results = [...this.allCourses];

        if (departmentCode !== "all") {
            results = results.filter((course) => course.departmentCode === departmentCode);
        }

        if (searchTerm !== "") {
            results = results.filter((course) => {
                return (
                    course.courseCode.toLowerCase().includes(searchTerm) ||
                    course.title.toLowerCase().includes(searchTerm) ||
                    course.departmentName.toLowerCase().includes(searchTerm) ||
                    course.instructor.name.toLowerCase().includes(searchTerm) ||
                    course.topics.join(" ").toLowerCase().includes(searchTerm)
                );
            });
        }

        this.filteredCourses = results;
        this.displayAllCourses();
    }

    // ===== NEW: STATISTICS METHODS FOR DASHBOARD =====

    /** Returns all courses (used by dashboard stats) */
    getAllCourses() {
        return this.allCourses;
    }

    /** Adds up all enrolled students across every course */
    calculateTotalEnrollment() {
        return this.allCourses.reduce(
            (total, course) => total + (course.enrolled || 0), 0
        );
    }

    /** Calculates average enrollment percentage across all courses */
    calculateAverageCapacity() {
        if (this.allCourses.length === 0) return 0;

        const totalPercent = this.allCourses.reduce((sum, course) => {
            if (course.maxCapacity && course.maxCapacity > 0) {
                return sum + (course.enrolled / course.maxCapacity) * 100;
            }
            return sum;
        }, 0);

        return Math.round(totalPercent / this.allCourses.length);
    }

    /**
     * Exports all course data as a JSON object.
     * Used by the dashboard's "Export Data" feature.
     */
    exportCourseData() {
        return {
            exportDate: new Date().toISOString(),
            totalCourses: this.allCourses.length,
            totalEnrollment: this.calculateTotalEnrollment(),
            averageCapacity: this.calculateAverageCapacity(),
            courses: this.allCourses
        };
    }
}