import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { useForm, ValidationError } from '@formspree/react'

gsap.registerPlugin(ScrollTrigger)

// Portfolio data - Mixes, Events, Gallery
const projects = [
  {
    id: 1,
    title: 'Afrobeat Beach Mix',
    subtitle: 'Toronto, Canada',
    image: '/10.jpg',
    num: '01',
    type: 'mix',
    youtubeId: '4dDCG5MPgQg'
  },
  {
    id: 2,
    title: 'Lagos Live Set',
    subtitle: 'Afrobeat & Amapiano',
    image: '/5.jpg',
    num: '02',
    type: 'event',
    youtubeId: 'JU9wq_zFIAk'
  },
  {
    id: 3,
    title: 'Melbourne Sessions',
    subtitle: '3RRR Radio Show',
    image: '/8EDITEDD.jpg',
    num: '03',
    type: 'event'
  },
  {
    id: 4,
    title: 'Festival Vibes',
    subtitle: 'Summer 2024',
    image: '/15a.jpg',
    num: '04',
    type: 'gallery'
  }
]

// Services data
const services = [
  {
    id: 1,
    title: 'Private Events',
    description: 'From intimate gatherings to grand celebrations, I bring the perfect soundtrack to your special moments. Birthday parties, anniversaries, house parties — every event gets a custom-curated experience that keeps your guests dancing all night long.'
  },
  {
    id: 2,
    title: 'Club & Festival Sets',
    description: 'High-energy performances that command the dance floor. With a signature blend of Afrobeats, Amapiano, R&B, and Dancehall, I create unforgettable nights that leave crowds wanting more. Ready to take your venue to the next level.'
  },
  {
    id: 3,
    title: 'Weddings',
    description: 'Your love story deserves the perfect musical backdrop. From the ceremony to the last dance, I craft seamless transitions and read the room to ensure every moment is magical. Specializing in multicultural celebrations that honor diverse traditions.'
  },
  {
    id: 4,
    title: 'Corporate Events',
    description: 'Professional entertainment that elevates your brand. Product launches, company parties, networking events — I deliver sophisticated sets that match your corporate vision while keeping the energy exactly where you need it.'
  },
  {
    id: 5,
    title: 'Radio & Podcast',
    description: 'Experienced radio host and podcast co-host. Former DJ at 3RRR Radio Melbourne and co-host of Yarns x Vibes podcast. Available for guest appearances, mix features, and collaborative content that amplifies diverse voices and sounds.'
  }
]

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openServiceId, setOpenServiceId] = useState(null)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [navDark, setNavDark] = useState(false)
  const [formState, handleFormSubmit] = useForm("xlgroykg")
  const lenisRef = useRef(null)
  const menuTlRef = useRef(null)
  const menuBtnRef = useRef(null)
  const navRef = useRef(null)

  // Initialize Lenis and GSAP animations
  useEffect(() => {
    // Smooth Scroll Setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis
    window.lenis = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Loading Animation
    const tlLoader = gsap.timeline()

    tlLoader.to('.loader-bar', {
      width: '100%',
      duration: 1.5,
      ease: "power2.inOut"
    })
    .to('.loader', {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut"
    })
    .from('.hero-img', {
      scale: 1.2,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out"
    }, "-=0.4")
    .to('.hero-line span', {
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power4.out"
    }, "-=1")

    // Menu Timeline
    menuTlRef.current = gsap.timeline({ paused: true })

    menuTlRef.current.to('.menu-overlay', {
      visibility: 'visible',
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: 0.8,
      ease: 'power4.inOut'
    })
    .to('.menu-link span', {
      y: 0, 
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.4")

    // Parallax Effect for Hero Image
    gsap.to('.hero-img', {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: '.hero',
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    })

    // Marquee Animation
    let currentScroll = 0
    let isScrollingDown = true
    
    const tween = gsap.to(".marquee-track", {
      xPercent: -25, 
      repeat: -1, 
      duration: 20, 
      ease: "none"
    })

    const handleScroll = () => {
      if(window.pageYOffset > currentScroll) {
        isScrollingDown = true
      } else {
        isScrollingDown = false
      }
      gsap.to(tween, {timeScale: isScrollingDown ? 1 : -1, duration: 0.5})
      currentScroll = window.pageYOffset

      // Detect if nav is over dark sections (work section or footer)
      const workSection = document.querySelector('.work')
      const footerSection = document.querySelector('footer')
      const navHeight = 80
      const scrollY = window.scrollY

      let isDark = false
      if (workSection) {
        const workRect = workSection.getBoundingClientRect()
        if (workRect.top <= navHeight && workRect.bottom >= 0) {
          isDark = true
        }
      }
      if (footerSection) {
        const footerRect = footerSection.getBoundingClientRect()
        if (footerRect.top <= navHeight && footerRect.bottom >= 0) {
          isDark = true
        }
      }
      setNavDark(isDark)
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    // Reveal Text on Scroll (About Section)
    const revealTexts = document.querySelectorAll('.reveal-text')
    revealTexts.forEach(text => {
      gsap.fromTo(text, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: text,
            start: "top 85%",
          }
        }
      )
    })

    // Image Reveal in About
    gsap.fromTo('.reveal-image-wrapper img',
      { scale: 1.4 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: '.reveal-image-wrapper',
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    )

    // Horizontal Scroll for Work Section (Desktop only)
    const mm = gsap.matchMedia()

    mm.add("(min-width: 769px)", () => {
      const sections = gsap.utils.toArray(".project-card")
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".work",
          pin: true,
          scrub: 1,
          end: "+=3000",
        }
      })
    })

    // Footer Reveal Animation - using fromTo for reliable animation
    gsap.fromTo('.footer-cta span', 
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        immediateRender: false,
        scrollTrigger: {
          trigger: '.footer-top',
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    )
    
    gsap.fromTo('.footer-col', 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        immediateRender: false,
        scrollTrigger: {
          trigger: '.footer-grid',
          start: "top 90%",
        }
      }
    )

    // Magnetic Button Effect
    const menuBtn = menuBtnRef.current
    
    const handleMouseMove = (e) => {
      const rect = menuBtn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      gsap.to(menuBtn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3
      })
    }

    const handleMouseLeave = () => {
      gsap.to(menuBtn, { x: 0, y: 0, duration: 0.3 })
    }

    menuBtn.addEventListener('mousemove', handleMouseMove)
    menuBtn.addEventListener('mouseleave', handleMouseLeave)

    // Cleanup
    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(st => st.kill())
      window.removeEventListener("scroll", handleScroll)
      menuBtn.removeEventListener('mousemove', handleMouseMove)
      menuBtn.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Toggle menu
  const toggleMenu = () => {
    if (!isMenuOpen) {
      menuTlRef.current.play()
      lenisRef.current.stop()
    } else {
      menuTlRef.current.reverse()
      lenisRef.current.start()
    }
    setIsMenuOpen(!isMenuOpen)
  }

  // Handle menu link click
  const handleMenuLinkClick = (e, targetId) => {
    e.preventDefault()
    const targetSection = document.querySelector(targetId)
    
    if (isMenuOpen) {
      toggleMenu()
    }
    
    if (targetSection) {
      setTimeout(() => {
        lenisRef.current.scrollTo(targetSection)
      }, 500)
    }
  }

  // Handle smooth scroll link click
  const handleSmoothScrollClick = (e, targetId) => {
    e.preventDefault()
    const targetSection = document.querySelector(targetId)
    if (targetSection) {
      lenisRef.current.scrollTo(targetSection)
    }
  }

  // Handle service accordion
  const handleServiceClick = (serviceId) => {
    const details = document.querySelector(`#service-details-${serviceId}`)
    const icon = document.querySelector(`#service-icon-${serviceId}`)
    
    // Close other services
    services.forEach(s => {
      if (s.id !== serviceId && openServiceId === s.id) {
        const otherDetails = document.querySelector(`#service-details-${s.id}`)
        const otherIcon = document.querySelector(`#service-icon-${s.id}`)
        gsap.to(otherDetails, { height: 0, opacity: 0, duration: 0.4, ease: "power2.out" })
        gsap.to(otherIcon, { rotation: 0, duration: 0.4 })
      }
    })

    if (openServiceId !== serviceId) {
      gsap.to(details, { 
        height: 'auto', 
        opacity: 1, 
        duration: 0.5, 
        ease: "power2.out" 
      })
      gsap.to(icon, { rotation: 45, duration: 0.4 })
      setOpenServiceId(serviceId)
    } else {
      gsap.to(details, { 
        height: 0, 
        opacity: 0, 
        duration: 0.4, 
        ease: "power2.out" 
      })
      gsap.to(icon, { rotation: 0, duration: 0.4 })
      setOpenServiceId(null)
    }
  }

  // Handle back to top
  const handleBackToTop = () => {
    lenisRef.current.scrollTo(0)
  }

  // Handle newsletter form
  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <>
      {/* Loader */}
      <div className="loader">
        <div className="loader-text">DAMZTHEDJ</div>
        <div className="loader-bar"></div>
      </div>

      {/* Nav */}
      <nav ref={navRef} className={`${navDark ? 'nav-dark' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="logo">DAMZTHEDJ.</div>
        <div className="nav-right">
          <button className="book-btn" onClick={() => setIsContactOpen(true)}>Book Now</button>
          <button className="menu-btn menu-btn-text" ref={menuBtnRef} onClick={toggleMenu}>
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
          <div className="hamburger" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Contact Modal */}
      {isContactOpen && (
        <div className="contact-modal-overlay" onClick={() => setIsContactOpen(false)}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsContactOpen(false)}>×</button>
            <h2>Let's <span className="serif-italic">Connect</span></h2>
            <p className="modal-subtitle">Ready to make your event unforgettable? Drop me a line.</p>
            
            {formState.succeeded ? (
              <div className="form-success">
                <p>Thanks for reaching out! I'll get back to you soon. 🎧</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="your@email.com" required />
                  <ValidationError prefix="Email" field="email" errors={formState.errors} />
                </div>
                <div className="form-group">
                  <label htmlFor="event-type">Event Type</label>
                  <select id="event-type" name="event-type">
                    <option value="">Select event type...</option>
                    <option value="private-event">Private Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="club-festival">Club / Festival</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" placeholder="Tell me about your event..." rows="4" required />
                  <ValidationError prefix="Message" field="message" errors={formState.errors} />
                </div>
                <button type="submit" className="submit-btn" disabled={formState.submitting}>
                  {formState.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      <div className="menu-overlay">
        <div className="menu-links">
          <a href="#hero" className="menu-link" onClick={(e) => handleMenuLinkClick(e, '#hero')}>
            <span>Home</span>
          </a>
          <a href="#work" className="menu-link" onClick={(e) => handleMenuLinkClick(e, '#work')}>
            <span>Mixes</span>
          </a>
          <a href="#about" className="menu-link" onClick={(e) => handleMenuLinkClick(e, '#about')}>
            <span>About</span>
          </a>
          <a href="#contact" className="menu-link" onClick={(e) => handleMenuLinkClick(e, '#contact')}>
            <span>Book</span>
          </a>
        </div>
        <div className="menu-info">
          <p>Melbourne, Australia</p>
          <p>est. 2021</p>
        </div>
      </div>

      {/* Main Content */}
      <main id="smooth-wrapper">
        <div id="smooth-content">
          
          {/* Hero */}
          <section className="hero" id="hero">
            <img 
              src="/3.jpg" 
              alt="Damz the DJ" 
              className="hero-img"
            />
            <h1 className="hero-title">
              <span className="hero-line"><span>The Only</span></span>
              <span className="hero-line"><span>DJ <span className="serif-italic">with a</span></span></span>
              <span className="hero-line"><span>PhD</span></span>
            </h1>
            <button className="hero-book-btn" onClick={() => setIsContactOpen(true)}>Book Now</button>
            <div className="scroll-indicator">
              <div className="scroll-line"></div>
              <span>Scroll to vibe</span>
            </div>
          </section>

          {/* Marquee */}
          <section className="marquee-section">
            <div className="marquee-track">
              <span>Afrobeats</span> • <span>Amapiano</span> • <span>R&B</span> • <span>Dancehall</span> • <span>Highlife</span> • <span>Fuji</span> • <span>Afrobeats</span> • <span>Amapiano</span> • <span>R&B</span> • <span>Dancehall</span> • <span>Highlife</span> • <span>Fuji</span> • <span>Afrobeats</span> • <span>Amapiano</span> • <span>R&B</span> • <span>Dancehall</span> • <span>Highlife</span> • <span>Fuji</span> • <span>Afrobeats</span> • <span>Amapiano</span> • <span>R&B</span> • <span>Dancehall</span> • <span>Highlife</span> • <span>Fuji</span>
            </div>
          </section>

          {/* About */}
          <section className="about" id="about">
            <div className="about-sticky">
              <span className="section-label">Meet Damz</span>
              <p className="big-text">I don't just play music.<br />I craft <span className="serif-italic">experiences</span>.</p>
            </div>
            <div>
              <p className="about-desc reveal-text">
                Damz, fondly called Big DAMZ, is a Nigerian-born DJ who started her career in Melbourne, Australia. Since 2021, she's been making waves locally and internationally under the brand "Damzthedj" — known for her infectious energy and impeccable music curation.
              </p>
              <p className="about-desc reveal-text">
                Beyond the decks, Damz has co-hosted the Yarns x Vibes podcast and hosted at 3RRR Radio in Melbourne. For her, DJing isn't just about playing music — it's about crafting immersive experiences that take audiences through eras and genres that evoke emotion and nostalgia.
              </p>
              <p className="about-desc reveal-text">
                Her Nigerian heritage remains a cornerstone of her craft, influencing sets that seamlessly blend 2000s R&B, Afrobeats, Amapiano, Highlife, Fuji, Dancehall, and a rich array of African rhythms. Recognized by Audio-Technica worldwide and SheDJs Global in Canada, Damz is a dynamic force pushing boundaries and sharing her love for music globally.
              </p>
              <div 
                className="reveal-image-wrapper"
                style={{ marginTop: '4rem', height: '550px', background: '#ccc', overflow: 'hidden' }}
              >
                <img 
                  src="/1.jpg" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} 
                  alt="Damz the DJ"
                />
              </div>
            </div>
          </section>

          {/* Work (Horizontal Scroll) */}
          <section className="work" id="work">
            <div className="work-header">
              <span className="section-label">Mixes & Events</span>
              <h2>Recent <span className="serif-italic">Sessions</span></h2>
            </div>
            <div className="horizontal-container">
              <div className="horizontal-wrapper">
                {projects.map((project) => (
                  <div key={project.id} className="project-card">
                    {project.youtubeId ? (
                      <a href={`https://youtu.be/${project.youtubeId}`} target="_blank" rel="noopener noreferrer">
                        <img src={project.image} alt={project.title} />
                      </a>
                    ) : (
                      <img src={project.image} alt={project.title} />
                    )}
                    <div className="project-info">
                      <div>
                        <span>{project.title}</span>
                        {project.subtitle && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginTop: '0.25rem' }}>{project.subtitle}</span>}
                      </div>
                      <span className="project-num">{project.num}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services / Capabilities */}
          <section className="services" id="services">
            <span className="section-label">What I Do</span>
            
            {services.map((service) => (
              <div 
                key={service.id} 
                className={`service-item ${openServiceId === service.id ? 'open' : ''}`}
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="service-header">
                  <h3>{service.title}</h3>
                  <div id={`service-icon-${service.id}`} className="service-icon">+</div>
                </div>
                <div id={`service-details-${service.id}`} className="service-details">
                  <div className="service-text-wrapper">
                    <p>{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Footer */}
          <footer id="contact">
            <div className="footer-top">
              <div className="section-label" style={{ marginBottom: '1rem' }}>Let's Work</div>
              <div className="footer-cta">
                <span>Let's Make</span>
                <span className="serif-italic" style={{ color: 'var(--accent-color)', display: 'block' }}>Magic</span>
              </div>
            </div>

            <div className="footer-grid">
              <div className="footer-col">
                <h4>Booking</h4>
                <div style={{ fontSize: '1.1rem', lineHeight: 1.5, color: 'var(--secondary-color)' }}>
                  Based in Melbourne, Australia<br />
                  Available Worldwide
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <a href="mailto:damzthedj@gmail.com" style={{ textDecoration: 'underline' }}>damzthedj@gmail.com</a>
                </div>
              </div>

              <div className="footer-col">
                <h4>Socials</h4>
                <div className="footer-links">
                  <a href="https://www.instagram.com/damzthedj/" target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href="https://youtube.com/@damzthedj" target="_blank" rel="noopener noreferrer">YouTube</a>
                  <a href="https://on.soundcloud.com/nHP4s9SjQJeqfVdN6" target="_blank" rel="noopener noreferrer">SoundCloud</a>
                  <a href="https://audiomack.com/itsdamzthedj" target="_blank" rel="noopener noreferrer">Audiomack</a>
                </div>
              </div>

              <div className="footer-col">
                <h4>Navigate</h4>
                <div className="footer-links">
                  <a href="#hero" className="smooth-scroll-link" onClick={(e) => handleSmoothScrollClick(e, '#hero')}>Home</a>
                  <a href="#about" className="smooth-scroll-link" onClick={(e) => handleSmoothScrollClick(e, '#about')}>About</a>
                  <a href="#work" className="smooth-scroll-link" onClick={(e) => handleSmoothScrollClick(e, '#work')}>Mixes</a>
                  <a href="#services" className="smooth-scroll-link" onClick={(e) => handleSmoothScrollClick(e, '#services')}>Services</a>
                </div>
              </div>

              <div className="footer-col">
                <h4>Stay Connected</h4>
                <p style={{ marginBottom: '1.5rem', color: 'var(--secondary-color)', fontSize: '0.9rem' }}>
                  For bookings and collaborations, drop me a line.
                </p>
                <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <input type="email" placeholder="Your Email" />
                  <button type="submit">→</button>
                </form>
              </div>
            </div>

            <div className="footer-bottom">
              <div>
                © 2025 Damzthedj. All Rights Reserved.
              </div>
              <div>
                <a href="https://linktr.ee/DamztheDj" target="_blank" rel="noopener noreferrer">Linktree</a> &nbsp; / &nbsp; <a href="https://www.tiktok.com/@bigdamzz" target="_blank" rel="noopener noreferrer">TikTok</a>
              </div>
              <button className="back-to-top" onClick={handleBackToTop}>
                Back to Top ↑
              </button>
            </div>
          </footer>
        </div>
      </main>
    </>
  )
}

export default App

