// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Select all question and answer elements
    const questions = document.querySelectorAll(".question");
    const answers = document.querySelectorAll(".answer");

    // Add click event listeners to each question
    questions.forEach((question, index) => {
        question.addEventListener("click", () => {
            // Remove 'active' class from all questions and answers
            questions.forEach((q) => q.classList.remove("active"));
            answers.forEach((a) => a.classList.remove("active"));

            // Add 'active' class to the clicked question and corresponding answer
            question.classList.add("active");
            answers[index].classList.add("active");
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const sections = document.querySelectorAll(".tab-content section");

    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            // Remove 'active' class from all tabs and hide all sections
            tabs.forEach((tab) => tab.classList.remove("active"));
            sections.forEach((section) => {
                section.classList.remove("active-tab");
                section.classList.add("inactive-tab");
            });

            // Add 'active' class to the clicked tab and show the corresponding section
            this.classList.add("active");
            const target = document.querySelector(this.dataset.target);
            target.classList.add("active-tab");
            target.classList.remove("inactive-tab");
        });
    });
});

const hamburger = document.getElementById('hamburger');
const navbarMenu = document.getElementById('navbar-menu');
const closeButton = document.getElementById('close-button');

hamburger.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
});

closeButton.addEventListener('click', () => {
navbarMenu.classList.remove('active');
});

document.querySelectorAll(".navbar a").forEach(link => {
if (link.href === window.location.origin + window.location.pathname) {
link.classList.add("active");
}
});


// stories slider
const slider = document.querySelector('.slider');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');

let currentIndex = 0;

const updateSliderPosition = () => {
  slider.style.transform = `translateX(-${currentIndex * 33.33}%)`;
};

leftArrow.addEventListener('click', () => {
  currentIndex = Math.max(currentIndex - 1, 0); // Prevent going past the first slide
  updateSliderPosition();
});

rightArrow.addEventListener('click', () => {
  currentIndex = Math.min(currentIndex + 1, slider.children.length - 3); // Prevent showing empty space
  updateSliderPosition();
});


