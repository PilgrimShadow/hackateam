'use strict';

function UserList(elementId, entries) {


    // The element Id containing the list
    this.elementId = elementId;

    // The list of journal entries
    this.entries = entries;

    this.resultSet = entries;

    // Display the entry list in its current state
    this.display = function () {

        let container = document.getElementById(elementId);

        container.innerHTML = "";

        // Create and append all elements
        this.resultSet.forEach((user) => {

            let d = document.createElement('div');
            d.classList.add('partial-border', 'center-text-content');

            let username = document.createElement('div');
            username.classList.add("user-search-username");
            username.textContent = user['username'];

            let about = document.createElement('div');
            about.classList.add('user-search-about');
            about.textContent = user['about'];

            let skills = document.createElement('div');
            skills.classList.add("user-search-skill-list");
            skills.innerHTML = user['skills'].map(function (skill) {
                return "<span class='user-search-skill'>" + skill['name'] + "</span>";
            }).join("");

            let profiles = document.createElement('div');
            profiles.classList.add("user-search-profile");
            profiles.innerHTML = "<a class='user-profile-link' href='https://github.com' target='_blank'><i class='fa fa-lg fa-github'></i></a>";
            profiles.innerHTML += "<a class='user-profile-link' href='https://devpost.com' target='_blank'><i class='fa fa-lg fa-code'></i></a>";
            profiles.innerHTML += "<a class='user-profile-link' href='https://linkedin.com' target='_blank'><i class='fa fa-lg fa-linkedin'></i></a>";

            let joined = document.createElement('div');
            joined.classList.add('user-search-info');
            joined.textContent = "Joined: " + moment(user.joined).format('YYYY-MM-DD');


            // Assemble the element
            d.append(username);
            d.append(about);
            d.append(skills);
            d.append(profiles);
            d.append(joined);

            // Add element to page
            container.append(d);
        });
    };

    //
    this.sort = function (oldestFirst = false) {

        const factor = (oldestFirst === true) ? -1 : 1;

        this.resultSet.sort((a, b) => {

            return factor * Math.sign(b.timestamp - a.timestamp);
        });
    };

    // Find all entries containing a search term
    this.aboutSearch = function (rawSearchTerm) {

        // Ignore case when searching
        const searchTerm = rawSearchTerm.toLowerCase();

        this.resultSet = this.entries.filter(function (user) {
            return user.about.includes(searchTerm);
        });
    };

    // Search for users with certain skills
    this.skillSearch = function (searchTerm) {

        // Null searches
        if (searchTerm.length === 0) {
            this.resultSet = this.entries.slice();
            return
        }

        let searchSkills = new Set(searchTerm.toLowerCase().split(",").map((rawTerm) => {
            return rawTerm.trim();
        }));

        console.log(searchSkills);

        this.resultSet = this.entries.filter(function (user) {

            let skillNames = user['skills'].map(function (skill) {
                return skill.name.toLowerCase();
            });

            console.log(skillNames);

            let intersection = skillNames.filter((x) => searchSkills.has(x));

            return intersection.length > 0;
        });

    };

    // Find all entries near the given coordinates
    this.near = function (coords, radius) {

        this.resultSet = this.entries.filter(function (elem) {

            // TODO: call haversine function
            return 0;
        });

    };

}