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

        let entryHtml = this.resultSet.forEach((user) => {

            let d = document.createElement('div');
            d.classList.add('partial-border');

            let username = document.createElement('div');
            username.textContent = user['username'];

            let about = document.createElement('div');
            about.classList.add('journal-entry-text', 'center-text-content');
            about.textContent = user['about'];

            let skills = document.createElement('div');
            skills.textContent = user['skills'].map(function (skill) {
                return skill.name;
            }).join(", ");

            let joined = document.createElement('div');
            joined.classList.add('journal-entry-info');
            joined.textContent = moment(user.joined).format('YYYY-MM-DD HH:mm');


            // Assemble the element
            d.append(username);
            d.append(about);
            d.append(skills);
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
    this.filter = function (rawSearchTerm) {

        // Ignore case when searching
        const searchTerm = rawSearchTerm.toLowerCase();

        this.resultSet = this.entries.filter(function (elem) {
            return elem.text.includes(searchTerm);
        });
    };

    this.skillSearch = function (searchTerm) {

        let searchSkills = new Set(searchTerm.split(","));

        this.resultSet = this.entries.filter(function (user) {

            let skillNames = user['skills'].map(function (skill) {
                return skill.name;
            });

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