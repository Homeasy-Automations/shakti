// ============ Mobile nav toggle ============
(function(){
  const header = document.querySelector('.site-header');
  const burger = document.querySelector('.hamburger');
  if(!burger) return;
  burger.addEventListener('click', function(){
    const open = header.classList.toggle('nav-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.mobile-panel a').forEach(a=>{
    a.addEventListener('click', ()=>{
      header.classList.remove('nav-open');
      burger.classList.remove('is-open');
    });
  });
})();

// ============ Animated counters ============
(function(){
  const counters = document.querySelectorAll('[data-count]');
  if(!counters.length) return;
  const animate = (el)=>{
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const dur = 1400;
    const start = performance.now();
    const step = (now)=>{
      const p = Math.min((now-start)/dur, 1);
      const eased = 1 - Math.pow(1-p, 3);
      const val = Math.floor(eased * target);
      el.textContent = val.toLocaleString('en-IN') + suffix;
      if(p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-IN') + suffix;
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); }
    });
  }, {threshold:.5});
  counters.forEach(c=>io.observe(c));
})();

// ============ Generic tab groups (data-tabgroup) ============
(function(){
  document.querySelectorAll('[data-tabgroup]').forEach(group=>{
    const name = group.getAttribute('data-tabgroup');
    const buttons = group.querySelectorAll('.tabbtn');
    const panels = document.querySelectorAll(`[data-tabpanel="${name}"]`);
    buttons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        buttons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-tab');
        panels.forEach(p=>{
          p.style.display = (p.getAttribute('data-key') === key || key === 'all') ? '' : 'none';
        });
      });
    });
  });
})();

// ============ Gallery filter ============
(function(){
  const filterBar = document.querySelector('[data-gallery-filter]');
  if(!filterBar) return;
  const buttons = filterBar.querySelectorAll('.tabbtn');
  const items = document.querySelectorAll('.gallery-item');
  buttons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      buttons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      items.forEach(item=>{
        const match = cat === 'all' || item.getAttribute('data-cat') === cat;
        item.classList.toggle('hide', !match);
      });
    });
  });
})();

// ============ Forms: prevent default, show success ============
(function(){
  document.querySelectorAll('form[data-demo-form]').forEach(form=>{
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const success = form.parentElement.querySelector('.form-success') || form.querySelector('.form-success');
      if(success){
        success.classList.add('show');
        setTimeout(()=>{ form.reset(); }, 200);
      }
    });
  });
})();

// ============ Reveal on scroll ============
(function(){
  const revealEls = document.querySelectorAll(
    '.card, .timeline-item, .tier, .stat-card, .photo:not(.hero-grid .photo), .photo-ph, .gallery-item, .section-head:not(.page-hero .section-head), .clip-card, .form-card, .social-embed-card'
  );
  if(!revealEls.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.style.opacity = 1;
        e.target.style.transform = 'none';
        io.unobserve(e.target);
      }
    });
  }, {threshold:.12});
  // Group siblings so items within the same parent stagger in sequence
  const groups = new Map();
  revealEls.forEach(el=>{
    const key = el.parentElement;
    const list = groups.get(key) || [];
    list.push(el);
    groups.set(key, list);
  });
  groups.forEach(list=>{
    list.forEach((el, i)=>{
      el.style.opacity = 0;
      el.style.transform = 'translateY(18px)';
      el.style.transition = `opacity .6s cubic-bezier(.16,1,.3,1) ${Math.min(i*0.08,.4)}s, transform .6s cubic-bezier(.16,1,.3,1) ${Math.min(i*0.08,.4)}s`;
      io.observe(el);
    });
  });
})();

// ============ Header shrink on scroll ============
(function(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  const onScroll = ()=> header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
})();
