'use strict';

/**
 * A class to manage and control subject list widgets.
 *
 * @param elementId
 * @param subjects
 * @constructor
 */
function SubjectList(elementId, subjects) {


    // The element Id containing the subject list
    this.elementId = elementId;

    // The list of subjects
    this.subjects = subjects;

    /**
     * Display the subject list
     *
     * @param subTotalMap
     */
    this.display = function () {

        const subjectName = (subject) => "<div class='subject-list-name'>" + subject['name'] + "</div>";

        const subjectDescription = (subject) => "<div class='subject-list-description'>" + subject['description'] + "</div>";

        const subjectOptions = "<td class='subject-list-options'>" + "<span><u>&middot;&middot;&middot;</u></span>" + "</td>";

        // Populate the subject list
        const subjectListHTML = this.subjects.map(function (subject, i, arr) {

            return "<tr><td class='subject-list-element'>" + subjectName(subject) + subjectDescription(subject) + "</td>" + subjectOptions + "</tr>"
        });

        document.getElementById(this.elementId).innerHTML = "<table><colgroup><col><col></colgroup>" + subjectListHTML.join("") + "</table>";
    };

}
