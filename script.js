document.addEventListener("DOMContentLoaded", async function () {
  function centerTitle() {
    var titleContainer = document.querySelector('.title-container');
    var titleSpan = document.querySelector('.title-container span');

    if (titleContainer && titleSpan) {
      var containerHeight = titleContainer.clientHeight;
      var spanHeight = titleSpan.clientHeight;
      var topPosition = (containerHeight - spanHeight) / 0.45;
      titleSpan.style.top = topPosition + 'px';
    }
  }

function showSection(sectionId) {
  var sections = document.querySelectorAll('section');
  sections.forEach(function (section) {
    section.style.display = 'none';
  });

  var selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = 'block';
    history.pushState(null, null, sectionId !== 'title' ? window.location.pathname + '#' + sectionId : window.location.pathname);
  }
}

  function redirectToSectionFromHash() {
    var hash = window.location.hash.substring(1);

    if (hash) {
      showSection(hash);
    } else {
      showSection('title');
    }
  }

  var profileImage = document.querySelector('.profile-image');
  if (profileImage) {
    profileImage.addEventListener('click', function (event) {
      showSection('title');
      event.preventDefault();
    });
  }

  var navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var sectionId = link.getAttribute('href').substring(1) || link.getAttribute('data-section-id');
      showSection(sectionId);
      event.preventDefault();
    });
  });

  // Function to get the thumbnail image URL for a project
  const getThumbnailImageUrl = async (projectTitle) => {
    const jpgPath = `images/${projectTitle}.jpg`;
    const pngPath = `images/${projectTitle}.png`;
    const jpegPath = `images/${projectTitle}.jpeg`;

    if (await fileExists(jpgPath)) return jpgPath;
    if (await fileExists(pngPath)) return pngPath;
    if (await fileExists(jpegPath)) return jpegPath;

    return `images/unknown.png`;
  };

  // Function to check if a file exists
  const fileExists = async (path) => {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Function to create a project HTML element
  const createProjectElement = async (projectFileName) => {
    var projectContainer = document.querySelector('#projects .project-container');

    var projectId = projectFileName.replace('.html', ''); // Extract project ID from file name
    var projectTitle = projectId.replace(/_/g, ' '); // Replace underscores with spaces

    var projectDiv = document.createElement('div');
    projectDiv.className = 'project thumbnail';
    projectDiv.dataset.filename = projectId;

    var projectLink = document.createElement('a');
    projectLink.href = `projects/${projectFileName}`;
    projectLink.target = '_blank';

    var thumbnailImageDiv = document.createElement('div');
    thumbnailImageDiv.className = 'thumbnail-image';

    var thumbnailImage = document.createElement('img');
    thumbnailImage.src = await getThumbnailImageUrl(projectTitle);
    thumbnailImage.alt = `${projectTitle} Thumbnail`;

    var projectDetailsDiv = document.createElement('div');
    projectDetailsDiv.className = 'project-details';

    var h3Title = document.createElement('h3');
    h3Title.textContent = projectTitle;

    // Appending elements
    thumbnailImageDiv.appendChild(thumbnailImage);
    projectDetailsDiv.appendChild(h3Title);
    projectLink.appendChild(thumbnailImageDiv);
    projectLink.appendChild(projectDetailsDiv);
    projectDiv.appendChild(projectLink);
    projectContainer.appendChild(projectDiv);
  };

  // List of project HTML files
  const projectFiles = ['project-1.html', 'project-2.html', 'project-3.html', 'project-4.html', 'summer-project.html'];
  // Add more project file names as needed

  // Check if each file in the projectFiles array exists in the "projects" folder
  const existingProjects = await Promise.all(projectFiles.map(async (projectFileName) => {
    const exists = await fileExists(`projects/${projectFileName}`);
    return exists ? projectFileName : null;
  }));

  // Filter out null values (non-existing files) from the array
  const validProjectFiles = existingProjects.filter((projectFileName) => projectFileName !== null);

  // Create project elements or show the "No Projects at the moment" message
  if (validProjectFiles.length > 0) {
    validProjectFiles.forEach((projectFileName) => createProjectElement(projectFileName));
  } else {
    var projectContainer = document.querySelector('#projects .project-container');
    var noProjectsMessage = document.createElement('p');
    noProjectsMessage.id = 'no-projects-message';
    noProjectsMessage.textContent = 'No Projects at the moment';
    projectContainer.appendChild(noProjectsMessage);
  }

  redirectToSectionFromHash();
  window.addEventListener('hashchange', redirectToSectionFromHash);
  window.addEventListener('resize', centerTitle);
  centerTitle();
});

// Assign showSection to the window object
window.showSection = showSection;
