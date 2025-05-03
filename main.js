// import emailjs from '@emailjs/browser';

/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 

/// Listen for the click event on the 'Send' button
document.getElementById('send-button').addEventListener('click', function(e) {
    // Prevent the default behavior (not strictly necessary since we're using type="button")
    e.preventDefault(); 

    // Capture the email and message from the form inputs
    const userEmail = document.getElementById('user_email').value;
    const message = document.getElementById('user_message').value;


    // Check if the email and message are not empty
    if (userEmail && message) {
        // Send the email using EmailJS
        emailjs.send("service_d6aif56", "template_4a19hb5", {
            email: userEmail, // Pass the captured email
            message: message  // Pass the captured message
        }).then(() => {
            alert("Message sent successfully!");
            console.log("Mail sent")
            document.getElementById('contact-form').reset(); // Reset the form
        }, (error) => {
            console.error("Failed to send message:", error);
            alert("Oops! Something went wrong.");
        });
    }
    else {
        alert("Please fill in the fields.");
    }
});
