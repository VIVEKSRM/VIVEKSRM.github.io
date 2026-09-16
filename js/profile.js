document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

  document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    document.querySelectorAll('.filters button').forEach(item => item.classList.toggle('active', item === button));
    document.querySelectorAll('.portfolio-card').forEach(card => card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category));
  }));
  document.getElementById('year').textContent = new Date().getFullYear();
});
