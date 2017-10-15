'use strict';

function TeamList(elementId, teams, username = "") {

    // The element Id containing the list
    this.elementId = elementId;

    this.username = username;

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
            teamname.innerHTML = '<span>' + team['name'] + '</span><a class="team-repo-link" href="' + team['repoLink'] + '" target="_blank"><i class="fa fa-external-link" aria-hidden="true"></i></a>';

            let hackathon = document.createElement('div');
            hackathon.classList.add('search-result-hackathon');
            hackathon.textContent = team['hackathon'];

            let about = document.createElement('div');
            about.classList.add('search-result-text');
            about.textContent = team['description'];

            // The row of waiting users
            let waiting = document.createElement('div');
            team['waiting'].forEach((waiter) => {

                let f = document.createElement('form');

                f.innerHTML = '<input type="text" name="waiter" value="' + waiter + '" hidden><input type="text" name="teamname" value="' + team['name'] + '" hidden><button type="submit" class="btn btn-default">' + waiter + '</button>';
                submitInBackground(f, "/teams/accept", (responseData, formData) => {
                    console.log(responseData);

                    if (responseData['success'] === true) {
                        f.remove();
                    } else {

                    }
                });

                waiting.append(f);
            });

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

            let messageHeader = document.createElement('div');
            messageHeader.classList.add('message-list-header');
            messageHeader.innerHTML = '<i class="fa fa-caret-down" aria-hidden="true"></i><span class="message-list-header-text">Messages</span>';

            // List of team messages
            let messageList = document.createElement('div');
            messageList.classList.add('team-message-list');
            team['messages'].forEach((message) => {

                let m = document.createElement('div');
                m.innerHTML = '<span class="team-message-sender">' + message['username'] + '</span><span class="team-message-text">' + message['text'] + '</span>'

                messageList.append(m);
            });

            // Form to leave a message on the team chat board
            let messageField = document.createElement('form');
            messageField.classList.add('message-entry-form');
            messageField.innerHTML = '<input type="text" class="team-message-input" name="text" placeholder="Leave a message..."><input type="text" name="teamname" value="' + team['name'] + '" hidden><button type="submit" hidden></button>';

            // Handler for adding team messages
            submitInBackground(messageField, "/teams/addMessage", (responseData, formData) => {
                console.log(formData);
                console.log(responseData);

                if (responseData['success'] === true) {

                    // Reset the form on success
                    messageField.reset();

                    let mText;

                    formData.forEach((field) => {

                        if (field['name'] === 'text') {
                            mText = field['value'];
                        }

                    });

                    let m = document.createElement('div');
                    m.innerHTML = '<span class="team-message-sender">' + this.username + '</span><span class="team-message-text">' + mText + '</span>'
                    messageList.append(m);

                } else {

                }
            });

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

            let top = document.createElement('div');
            top.append(teamname);
            top.append(hackathon);
            top.append(about);

            let messaging = document.createElement('div');
            $(messaging).attr('hidden', true);
            messaging.append(messageList);
            messaging.append(messageField);

            messageHeader.onclick = () => {
                const elem = $(messaging);

                elem.attr("hidden", !elem.attr("hidden"));
            };

            d.append(top);
            d.append(skills);
            d.append(addSkill);
            d.append(joined);
            d.append(waiting);
            d.append(messageHeader);
            d.append(messaging);

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