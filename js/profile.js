document.addEventListener('DOMContentLoaded',function(){
  // animate skill bars when visible using IntersectionObserver
  const bars = document.querySelectorAll('.bar');
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries,observer)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const b = e.target;
          const val = b.getAttribute('data-value') || 80;
          b.querySelector('.bar-fill').style.width = val + '%';
          observer.unobserve(b);
        }
      })
    },{threshold:0.25});
    bars.forEach(b=>obs.observe(b));
  } else {
    // fallback
    bars.forEach(b=>{const val=b.getAttribute('data-value')||80;b.querySelector('.bar-fill').style.width = val + '%'});
  }

  // accessible alt text for profile images
  const photos = document.querySelectorAll('.profile-photo');
  photos.forEach(p=>{ if(!p.getAttribute('alt')) p.setAttribute('alt','Profile photo of Vivek Ranjan')});

  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('mainNav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
});
