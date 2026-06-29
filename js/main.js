/**
 * 漂浮洞杂志网站 — 交互逻辑
 * 零依赖，纯原生 JavaScript
 */

;(function () {
  'use strict'

  // ── DOM 引用 ──────────────────────────────────────────
  const html = document.documentElement
  const header = document.getElementById('header')
  const navMenu = document.getElementById('nav-menu')
  const navHamburger = document.getElementById('nav-hamburger')
  const themeToggle = document.getElementById('theme-toggle')
  const themeIcon = document.getElementById('theme-icon')
  const navLinks = document.querySelectorAll('.nav__link')
  const sections = document.querySelectorAll('section[id]')

  // ── 暗色 / 亮色模式 ──────────────────────────────────

  const getTheme = () => localStorage.getItem('theme') || 'light'
  const setTheme = (t) => {
    html.setAttribute('data-theme', t)
    localStorage.setItem('theme', t)
    themeIcon.textContent = t === 'dark' ? '☀️' : '🌙'
  }

  setTheme(getTheme())

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    setTheme(next)
  })

  // ── 移动端汉堡菜单 ────────────────────────────────────

  navHamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open')
    navHamburger.classList.toggle('active', isOpen)
  })

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open')
      navHamburger.classList.remove('active')
    })
  })

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      navMenu.classList.remove('open')
      navHamburger.classList.remove('active')
    }
  })

  // ── 当前章节高亮导航链接 ──────────────────────────────

  function updateActiveLink() {
    const scrollY = window.scrollY + 120

    let current = ''
    sections.forEach(section => {
      const top = section.offsetTop
      const height = section.offsetHeight
      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute('id')
      }
    })

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current)
    })
  }

  // ── 滚动显示动画 (Intersection Observer) ───────────────

  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        revealObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // 给需要渐入的元素加上 .reveal
  document.querySelectorAll(
    '.about__text p, .about__tags, .feature-card, .issue-card, .subscribe-card, .subscribe__intro, .social-link'
  ).forEach(el => el.classList.add('reveal'))

  // 启动观察
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))

  // ── 滚动事件监听 ──────────────────────────────────────

  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveLink()
        ticking = false
      })
      ticking = true
    }
  }, { passive: true })

  updateActiveLink()
})()
