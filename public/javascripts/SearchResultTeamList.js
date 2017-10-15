'use strict';

function SearchResultTeamList(elementId, teams) {

    // The element Id containing the list
    this.elementId = elementId;

    // The list of journal entries
    this.entries = teams.slice();

    // The results of the most recent search
    this.resultSet = this.entries.slice();

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

            let hackathon = document.createElement('div');
            hackathon.classList.add('search-result-hackathon');
            hackathon.textContent = team['hackathon'];

            let request = document.createElement('form');
            request.classList.add('search-result-join');
            request.innerHTML = '<input type="text" name="teamname" value="' + team['name'] + '" hidden><button type="submit" class="btn btn-default">Request to Join</button>';

            let about = document.createElement('div');
            about.classList.add('search-result-text');
            about.textContent = team['description'];

            let skills = document.createElement('div');
            skills.classList.add("search-result-skills");
            skills.innerHTML = team['skills'].map(function (skill) {
                return "<span class='skill-bubble'>" + skill['name'].toLowerCase() + "</span>";
            }).join("");

            let joined = document.createElement('div');
            joined.classList.add('search-result-info');
            joined.textContent = "Formed: " + moment(team['formed']).format('YYYY-MM-DD');

            // Handler for the membership request form
            submitInBackground(request, "/teams/request", (responseData, formData) => {
                console.log(responseData);
            });

            // Assemble the element
            let top = document.createElement('div');

            top.append(teamname);
            top.append(hackathon);
            top.append(about);

            d.append(top);
            d.append(skills);
            d.append(joined);
            d.append(request);

            // Add element to page
            container.append(d);
        });
    };

    // Add a team to the list
    this.addTeam = function (teamInfo) {

        this.entries.push(teamInfo);
    };

    // Sort the teams by their formation date
    this.sort = function (oldestFirst = false) {

        const factor = (oldestFirst === true) ? -1 : 1;

        this.resultSet.sort((a, b) => {

            return factor * Math.sign(b['formed'] - a['formed']);
        });
    };

    //
    this.search = (formData) => {

        console.log(formData);

        // Start with the full entry list
        this.resultSet = this.entries.slice();

        formData.forEach((field) => {

            if (field['name'] === 'team-hackathon-search-input') {
                this.resultSet = this.resultSet.filter((team) => {
                    return team['hackathon'].toLowerCase().includes(field['value'].trim().toLowerCase());
                })
            } else if (field['name'] === 'team-description-search-input') {
                this.resultSet = this.resultSet.filter((team) => {
                    return team['description'].toLowerCase().includes(field['value'].trim().toLowerCase());
                });
            } else if (field['name'] === 'team-skill-search-input') {

                // Null searches
                if (field['value'].length === 0) {
                    return
                }

                let searchSkills = new Set(field['value'].toLowerCase().split(",").map((rawTerm) => {
                    return rawTerm.trim();
                }));

                this.resultSet = this.resultSet.filter(function (team) {

                    let skillNames = team['skills'].map(function (skill) {
                        return skill['name'].toLowerCase();
                    });

                    let intersection = skillNames.filter((x) => searchSkills.has(x));

                    return intersection.length > 0;
                });
            }

        });

    };

    // Find all entries containing a search term
    this.descriptionSearch = function (rawSearchTerm) {

        // Ignore case when searching
        const searchTerm = rawSearchTerm.toLowerCase();

        this.resultSet = this.entries.filter(function (team) {
            return team['description'].includes(searchTerm);
        });
    };

    this.hackathonSearch = function (searchTerm) {

        this.resultSet = this.entries.filter((team) => {
            return team['hackathon'].toLowerCase().includes(searchTerm.trim().toLowerCase());
        })

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