// Preloader Hiding Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      // Optional: Remove the preloader from the DOM after the transition
      preloader.addEventListener('transitionend', () => {
        if (preloader.classList.contains('hidden')) { // Double check it's still hidden
          preloader.style.display = 'none';
        }
      }, { once: true }); // Ensure the event listener runs only once
    }
  });
  
  // Mobile menu toggle
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');
  
  function toggleMobileMenu() {
      const isActive = mobileMenu.classList.toggle('active');
      if (hamburger) {
          hamburger.setAttribute('aria-expanded', isActive);
      }
  }
  
  function closeMobileMenu() {
      mobileMenu.classList.remove('active');
      if (hamburger) {
          hamburger.setAttribute('aria-expanded', 'false');
      }
  }
  
  // Program tabs functionality
  let currentDay = 0;
  // const programDaysWrapper = document.querySelector('.program-days-wrapper'); // No longer needed for swipe
  const programTabsContainer = document.querySelector('.program-tabs'); // Added for tab scroll
  
  function showDay(dayIndex) {
      const tabButtons = document.querySelectorAll('.program-tabs .tab-button');
      const days = document.querySelectorAll('.program-day');
  
      // Update active state for tab buttons
      tabButtons.forEach((tab, index) => {
          if (index === dayIndex) {
              tab.classList.add('active');
              tab.setAttribute('aria-selected', 'true');
              // Scroll active tab into view if tabs are scrollable
              if (programTabsContainer && programTabsContainer.scrollWidth > programTabsContainer.clientWidth) {
                  tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }
          } else {
              tab.classList.remove('active');
              tab.setAttribute('aria-selected', 'false');
          }
      });
  
      // Show the selected day and hide others by toggling 'active' class
      days.forEach((day, index) => {
          if (index === dayIndex) {
              day.classList.add('active');
          } else {
              day.classList.remove('active');
          }
      });
      currentDay = dayIndex;
  }
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (this.closest('.mobile-menu')) {
              closeMobileMenu();
          }
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80; // Default to 80 if navbar not found or height is 0
              const offsetTop = targetElement.offsetTop - navbarHeight;
              window.scrollTo({
                  top: offsetTop,
                  behavior: 'smooth'
              });
  
              // Manually update the URL hash, but only if it's different
              if (window.location.hash !== targetId) {
                  history.pushState(null, null, targetId);
              }
          }
      });
  });
  
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
          if (window.scrollY > 50) {
              navbar.classList.add('scrolled');
          } else {
              navbar.classList.remove('scrolled');
          }
      }
  });
  
  // Intersection Observer for animations
  const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => { 
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              // Stop observing the element after it has become visible
              observer.unobserve(entry.target);
          }
      });
  }, observerOptions);
  
  // Initialize animations and event listeners on page load
  function scrollToHash() {
      if (window.location.hash) {
          const targetId = window.location.hash;
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              // Timeout to ensure all elements are rendered and heights are calculated
              setTimeout(() => {
                  const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                  const offsetTop = targetElement.offsetTop - navbarHeight;
                  window.scrollTo({
                      top: offsetTop,
                      behavior: 'smooth' // Optional: make initial scroll smooth too
                  });
              }, 100); // Small delay
          }
      }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
      const fadeElements = document.querySelectorAll('.fade-in');
      fadeElements.forEach(element => observer.observe(element));
  
      const hostCards = document.querySelectorAll('.host-card.fade-in');
      hostCards.forEach((card, index) => {
          card.style.transitionDelay = `${index * 0.1}s`;
      });
  
      if (hamburger && mobileMenu) { // Ensure mobileMenu is also defined
          hamburger.addEventListener('click', toggleMobileMenu);
          hamburger.addEventListener('keydown', (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                  toggleMobileMenu();
              }
          });
      }
  
      const tabButtons = document.querySelectorAll('.program-tabs .tab-button');
      tabButtons.forEach((button, index) => {
          button.addEventListener('click', () => showDay(index));
          button.setAttribute('role', 'tab');
          button.setAttribute('aria-controls', `day-${index}`);
          button.id = `tab-button-${index}`;
          if (index === 0) {
              button.setAttribute('aria-selected', 'true');
          } else {
              button.setAttribute('aria-selected', 'false');
          }
      });
  
      document.querySelectorAll('.program-day').forEach((panel, index) => {
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', `tab-button-${index}`);
      });
  
      const timelineItems = document.querySelectorAll('.timeline-item');
      timelineItems.forEach((item, index) => {
          item.style.transitionDelay = `${index * 0.05}s`;
          observer.observe(item);
          item.classList.add('visible'); //Make the items visible by default
      });
  
      // Scroll to hash if present in URL
      scrollToHash();
  
  
      // Donation Amount Selection
      const donationAmountRadios = document.querySelectorAll('input[name="donationAmountSelection"]');
      const customAmountInputGroup = document.getElementById('customAmountInputGroup');
      const customDonationAmountInput = document.getElementById('customDonationAmount');
      const predefinedAmountOptions = document.querySelectorAll('.predefined-amount-option'); // Select the containers
      const paymeLinkButton = document.querySelector('.donation-pay-button'); // Target the Payme button
  
      // Base Payme link structure
      const basePaymeLink = "https://payme.sk/";
      // --- Static payment details ---
      const iban = "SK5211000000002943045043";
      const variableSymbol = "20259999";
      const messageForRecipient = "Prispevok na cinnost. Festival radosti";
  
      function updatePaymeLink() {
          if (!paymeLinkButton) return;
  
          let amount = 0;
          const selectedAmountRadio = document.querySelector('input[name="donationAmountSelection"]:checked');
  
          if (selectedAmountRadio) {
              if (selectedAmountRadio.value === 'custom') {
                  amount = parseFloat(customDonationAmountInput.value) || 0; // Get custom amount
              } else {
                  amount = parseFloat(selectedAmountRadio.value) || 0; // Get predefined amount
              }
          }
          
          // Default to 10 if amount is 0 or invalid (e.g. custom field empty)
          if (amount <= 0) {
              amount = 10;
          }
  
          // 1. Construct the Payme WEB LINK (for the button)
          const paymeLinkParams = new URLSearchParams();
          paymeLinkParams.append('V', '1');
          paymeLinkParams.append('IBAN', iban);
          paymeLinkParams.append('AM', amount.toFixed(2));
          paymeLinkParams.append('CC', 'EUR');
          paymeLinkParams.append('PI', `/VS${variableSymbol}/SS/KS`);
          paymeLinkParams.append('MSG', messageForRecipient);
          
          const finalPaymeLinkForButton = `${basePaymeLink}?${paymeLinkParams.toString()}`;
          paymeLinkButton.href = finalPaymeLinkForButton;
      }
  
      if (donationAmountRadios.length > 0 && customAmountInputGroup && customDonationAmountInput && predefinedAmountOptions.length > 0) {
          donationAmountRadios.forEach(radio => {
              radio.addEventListener('change', function() {
                  if (this.value === 'custom') {
                      customAmountInputGroup.style.display = 'flex'; // Or 'block' depending on your styling
                      customDonationAmountInput.focus();
                      // customDonationAmountInput.value = ''; // Optionally clear previous custom value
                  } else {
                      customAmountInputGroup.style.display = 'none';
                  }
                  updatePaymeLink(); // Update link when predefined amount or custom option changes
              });
          });
  
          // Make entire predefined-amount-option div clickable
          predefinedAmountOptions.forEach(optionDiv => {
              optionDiv.addEventListener('click', function() {
                  const radioInput = this.querySelector('input[type="radio"]');
                  if (radioInput && !radioInput.checked) {
                      radioInput.checked = true;
                      // Manually dispatch a 'change' event to trigger other listeners
                      const changeEvent = new Event('change', { bubbles: true });
                      radioInput.dispatchEvent(changeEvent);
                  }
              });
          });
  
          customDonationAmountInput.addEventListener('input', updatePaymeLink); // Update link on custom amount input
  
          // Initial update on page load
          updatePaymeLink();
      }
  
      // Donations Section - Payment Method Toggle
      const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
      const paymentInfoDivs = {
          link: document.getElementById('linkDisplay'),
          manual: document.getElementById('manualDisplay')
      };
  
      if (paymentMethodRadios.length > 0 && paymentInfoDivs.link && paymentInfoDivs.manual) {
          paymentMethodRadios.forEach(radio => {
              radio.addEventListener('change', function() {
                  // Hide all payment info divs
                  for (const key in paymentInfoDivs) {
                      if (paymentInfoDivs[key]) { // Check if the element exists
                          paymentInfoDivs[key].classList.remove('active');
                      }
                  }
                  // Show the selected one
                  if (paymentInfoDivs[this.value]) { // Check if the element for this.value exists
                      paymentInfoDivs[this.value].classList.add('active');
                  }
              });
          });
      }
          // ... (your existing DOMContentLoaded code) ...
      
          const faqQuestions = document.querySelectorAll('.faq-question');
      
        faqQuestions.forEach(button => {
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                    const answerId = button.getAttribute('aria-controls');
                const answerPanel = document.getElementById(answerId);
    
                // Accordion behavior: If we are about to open this panel, close others.
                if (!isExpanded) {
                    faqQuestions.forEach(otherButton => {
                        if (otherButton !== button && otherButton.getAttribute('aria-expanded') === 'true') {
                            otherButton.setAttribute('aria-expanded', 'false');
                            const otherAnswerId = otherButton.getAttribute('aria-controls');
                            const otherAnswerPanel = document.getElementById(otherAnswerId);
                            if (otherAnswerPanel) {
                                otherAnswerPanel.style.maxHeight = "0";
                                otherAnswerPanel.style.paddingTop = "0";
                                otherAnswerPanel.style.paddingBottom = "0";
                                otherAnswerPanel.addEventListener('transitionend', () => {
                                    if (otherButton.getAttribute('aria-expanded') === 'false') { // Check again
                                        otherAnswerPanel.classList.remove('active');
                                    }
                                }, { once: true });
                            }
                        }
                    });
                }
    
                // Toggle the current button's state
                button.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) { // Panel is opening
                    answerPanel.classList.add('active');

                    // 1. Calculate the target scrollHeight the panel WILL HAVE with its final padding.
                    // Temporarily remove transitions to measure accurately.
                    const originalInlineTransition = answerPanel.style.transition;
                    answerPanel.style.transition = 'none';

                    // Define final padding values
                    const finalPaddingTop = "0.5rem";
                    const finalPaddingBottom = "1.5rem";

                    // Apply final padding to measure.
                    answerPanel.style.paddingTop = finalPaddingTop;
                    answerPanel.style.paddingBottom = finalPaddingBottom;

                    const targetScrollHeight = answerPanel.scrollHeight;

                    // Reset padding to initial state (0) BEFORE restoring transitions,
                    // so that padding can animate from 0 up to finalPaddingTop/Bottom.
                    answerPanel.style.paddingTop = '0px';
                    answerPanel.style.paddingBottom = '0px';

                    // Restore transitions. Clears the inline 'none' and reverts to stylesheet.
                    answerPanel.style.transition = ''; // Revert to CSS-defined transitions
                    // If originalInlineTransition was specific and needs to be restored:
                    // answerPanel.style.transition = originalInlineTransition;

                    // 2. Now, apply final styles that should be animated.
                    // Use rAF to ensure transition restoration and padding reset have taken effect.
                    requestAnimationFrame(() => {
                        // Check if still expanding, in case of rapid clicks
                        if (button.getAttribute('aria-expanded') === 'true') {
                            answerPanel.style.paddingTop = finalPaddingTop;
                            answerPanel.style.paddingBottom = finalPaddingBottom;
                            answerPanel.style.maxHeight = targetScrollHeight + "px";
                        }
                    });

                } else { // Panel is closing
                    answerPanel.style.maxHeight = "0"; // Set to "0" for transition to work correctly
                    answerPanel.style.paddingTop = "0"; // Remove padding when closing
                    answerPanel.style.paddingBottom = "0";
                    answerPanel.addEventListener('transitionend', () => {
                        if (button.getAttribute('aria-expanded') === 'false') { // Check again in case of rapid clicks
                            answerPanel.classList.remove('active');
                        }
                    }, { once: true });
                }
            });
        });
      
  
  });
  
  // Keyboard navigation for program tabs
  document.addEventListener('keydown', function(e) {
      const activeProgramTab = document.activeElement;
      if (activeProgramTab && activeProgramTab.classList.contains('tab-button') && activeProgramTab.closest('.program-tabs')) {
          const tabs = Array.from(document.querySelectorAll('.program-tabs .tab-button'));
          let newIndex = currentDay;
  
          if (e.key === 'ArrowLeft') {
              newIndex = currentDay > 0 ? currentDay - 1 : tabs.length - 1;
          } else if (e.key === 'ArrowRight') {
              newIndex = currentDay < tabs.length - 1 ? currentDay + 1 : 0;
          }
  
          if (newIndex !== currentDay) {
              showDay(newIndex);
              tabs[newIndex].focus();
          }
      }
  });
  