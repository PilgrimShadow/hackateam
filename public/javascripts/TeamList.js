'use strict';

function TeamList(elementId, teams) {

    // The element Id containing the list
    this.elementId = elementId;

    // The list of journal entries
    this.entries = teams;

    this.resultSet = teams;

    // Display the entry list in its current state
    this.display = function () {

        let container = document.getElementById(elementId);

        // Clear the container before displaying
        container.innerHTML = "";

        let makeSkillBubble = (skillName) => {

            let elem = document.createElement('span');
            elem.classList.add("skill-bubble");
            elem.textContent = skillName.toLowerCase();

            return elem;
        };

        // Create and append all elements
        this.resultSet.forEach((team) => {

            let d = document.createElement('div');
            d.classList.add('partial-border', 'center-text-content');

            let teamname = document.createElement('div');
            teamname.classList.add("search-result-title");
            teamname.textContent = team['name'];

            let about = document.createElement('div');
            about.classList.add('search-result-text');
            about.textContent = team['description'];

            let skills = document.createElement('div');
            skills.classList.add("search-result-skills");
            skills.innerHTML = team['skills'].map(function (skill) {
                return "<span class='skill-bubble'>" + skill['name'].toLowerCase() + "</span>";
            }).join("");

            let addSkill = document.createElement('form');
            addSkill.classList.add('add-team-skill-form');
            addSkill.innerHTML = '<input type="text" name="skillName"><input type="text" name="teamName" value="' +
                team['name'] + '" hidden><button type="submit" hidden></button>';

            let joined = document.createElement('div');
            joined.classList.add('search-result-info');
            joined.textContent = "Formed: " + moment(team['formed']).format('YYYY-MM-DD');

            // Handler for adding team skills
            submitInBackground(addSkill, "/teams/addSkill", function (responseData, formData) {
                console.log(responseData);
                console.log(formData);

                if (responseData['success'] === true) {

                    document.createElement('div');

                    // Add the new skill to the page
                    formData.forEach((field) => {
                        if (field['name'] === 'skillName') {
                            skills.append(makeSkillBubble(field['value']));
                        }
                    });
                } else {

                }

                // Reset the form
                addSkill.reset();
            });

            // Assemble the element
            d.append(teamname);
            d.append(about);
            d.append(skills);
            d.append(addSkill);
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
    this.descriptionSearch = function (rawSearchTerm) {

        // Ignore case when searching
        const searchTerm = rawSearchTerm.toLowerCase();

        this.resultSet = this.entries.filter(function (user) {
            return user['description'].includes(searchTerm);
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

        this.resultSet = this.entries.filter(function (team) {

            let skillNames = team['skills'].map(function (skill) {
                return skill['name'].toLowerCase();
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