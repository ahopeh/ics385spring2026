/*
ICS 385 - Week 8 JSON Assignment
Author: April Hope 
Description: Loads course data from a JSON file and displays it, creating a course catalog that is searchably via department, course code, title, instructor, and topics. 
Note: ChatGPT and Claude AI facilitated coding this project
*/

class CourseCatalogManager {
    constructor() {
        this.allCourses = [];
        this.filteredCourses = [];

        this.loadCourseData();

        document.getElementById("searchInput").addEventListener("input", (e) => {
            this.searchCourses(e.target.value);
        });

        document.getElementById("departmentFilter").addEventListener("change", (e) => {
            this.filterByDepartment(e.target.value);
        });
    }

   // Load JSON course data from file
    async loadCourseData() {
        try {
            const response = await fetch("sample-data.json");
            const data = await response.json();

            this.allCourses = [];

            data.departments.forEach((department) => {
                department.courses.forEach((course) => {
                    this.allCourses.push({
                        ...course,
                        departmentCode: department.code,
                        departmentName: department.name
                    });
                });
            });

            // This will display all courses before any filtering is applied
            this.filteredCourses = [...this.allCourses];
            this.displayAllCourses();
        } catch (error) {
            console.error("Error loading JSON:", error);
            document.getElementById("coursesContainer").innerHTML =
                "<p>Could not load course data.</p>";
        }
    }

    displayAllCourses() {
        const container = document.getElementById("coursesContainer");
        container.innerHTML = "";

        if (this.filteredCourses.length === 0) {
            container.innerHTML = "<p>No courses found.</p>";
            return;
        }

        this.filteredCourses.forEach((course) => {
            const card = document.createElement("div");
            card.className = "course-card";

            card.innerHTML = `
          <h2>${course.courseCode}</h2>
          <h3>${course.title}</h3>
          <p><strong>Department:</strong> ${course.departmentName}</p>
          <p><strong>Credits:</strong> ${course.credits}</p>
          <p><strong>Instructor:</strong> ${course.instructor.name}</p>
          <p><strong>Topics:</strong> ${course.topics.join(", ")}</p>
        `;

            container.appendChild(card);
        });
    }

    // Filters the courses based on the input given by the user in the search bar. 
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

    filterByDepartment(departmentCode) {
        const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();

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
}

document.addEventListener("DOMContentLoaded", () => {
    new CourseCatalogManager();
});