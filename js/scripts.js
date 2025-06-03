function loadSection(sectionId, file) {
    fetch('resources/' + file)
        .then(response => response.text())
        .then(data => document.getElementById(sectionId).innerHTML = data)
        .catch(error => console.error('Error loading', file, error));
}

loadSection("about", "about.html");
loadSection("education", "education.html");
loadSection("experience", "experience.html");
loadSection("internships", "internships.html");
loadSection("publications", "publications.html");
loadSection("certifications", "certifications.html");
loadSection("achievements", "achievements.html");
loadSection("volunteer", "volunteer.html");
loadSection("contact", "contact.html");
