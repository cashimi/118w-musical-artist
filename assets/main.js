document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const header = document.querySelector('header');
    if (menuBtn) { menuBtn.addEventListener('click', () => header.classList.toggle('nav-open')); }
    const form = document.querySelector('#newsletter-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value.trim();
            if (!email) return alert('Please enter your email.');
            alert(`Thanks! ${email} has been added (demo).`);
            form.reset();
        });
    }
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            logo.classList.toggle('spin');
        });
    }
});

// ====== MERCH MODAL (resilient wiring) ======
const PRODUCTS = {
    vinyl: {
      id: 'vinyl',
      title: 'Signed Vinyl',
      price: 29.0,
      image: 'images/malcVinyl.png',
      desc: 'Limited run 12" vinyl. Full-color sleeve, signed by Malcolm. Includes digital download card.',
      optionsLabel: null,
      options: null
    },
    tshirt: {
      id: 'tshirt',
      title: 'Logo T-Shirt',
      price: 24.0,
      image: 'images/malcTee.png',
      desc: 'Soft-wash unisex tee. 100% cotton, classic fit. Printed front logo.',
      optionsLabel: 'Size',
      options: ['XS','S','M','L','XL','XXL']
    },
    poster: {
      id: 'poster',
      title: 'Tour Poster',
      price: 12.0,
      image: 'images/malcPoster.jpg',
      desc: '18"×24" matte poster from the Summer Tour. Ships rolled in a tube.',
      optionsLabel: null,
      options: null
    }
  };
  
  (function merchModal() {
    const modal = document.getElementById('productModal');
    if (!modal) {
      console.warn('[Merch] No #productModal found in the DOM.');
      return;
    }
  
    // Cache modal elements
    const img = document.getElementById('modalImage');
    const titleEl = document.getElementById('modalTitle');
    const priceEl = document.getElementById('modalPrice');
    const descEl = document.getElementById('modalDesc');
    const optionGroup = document.getElementById('optionGroup');
    const optionSelect = document.getElementById('modalOption');
    const optionLabel = document.getElementById('optionLabel');
    const qtyInput = document.getElementById('modalQty');
    const closeBtn = modal.querySelector('.modal-close');
    const hasDialog = typeof modal.showModal === 'function';
  
    function openProduct(id) {
      const data = PRODUCTS[id];
      if (!data) {
        console.warn('[Merch] Unknown product id:', id);
        return;
      }
      img.src = data.image;
      img.alt = data.title;
      titleEl.textContent = data.title;
      priceEl.textContent = `$${data.price.toFixed(2)}`;
      descEl.textContent = data.desc;
  
      if (data.options && data.options.length) {
        optionGroup.hidden = false;
        optionLabel.textContent = data.optionsLabel || 'Option';
        optionSelect.innerHTML = data.options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
      } else {
        optionGroup.hidden = true;
        optionSelect.innerHTML = '';
      }
      qtyInput.value = '1';
  
      if (hasDialog) modal.showModal();
      else {
        modal.setAttribute('open', '');
        document.documentElement.style.overflow = 'hidden';
      }
    }
  
    function closeModal() {
      if (hasDialog) modal.close();
      else {
        modal.removeAttribute('open');
        document.documentElement.style.overflow = '';
      }
    }
  
    closeBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  
    // Backdrop click to close (works with <dialog>, soft-fallback otherwise)
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) closeModal();
    });
  
    // Form submit (Add to Cart / Close)
    modal.querySelector('form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitter = e.submitter;
      if (submitter?.value === 'cancel') return closeModal();
  
      const item = {
        id: titleEl.textContent.toLowerCase().replace(/\s+/g, '-'),
        title: titleEl.textContent,
        price: Number(priceEl.textContent.replace('$', '')),
        qty: Math.max(1, parseInt(qtyInput.value || '1', 10)),
        option: optionGroup.hidden ? null : optionSelect.value
      };
      console.log('Add to Cart:', item);
  
      submitter.disabled = true;
      const old = submitter.textContent;
      submitter.textContent = 'Added!';
      setTimeout(() => { submitter.disabled = false; submitter.textContent = old; closeModal(); }, 650);
    });
  
    // ——— Wiring clicks ———
    // 1) Best: buttons with data-product
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-product]');
      if (trigger) {
        e.preventDefault();
        openProduct(trigger.dataset.product);
      }
    });
  
    // 2) Auto-upgrade existing .card .btn if data-product missing
    const fallbacks = document.querySelectorAll('.card .btn:not([data-product])');
    if (fallbacks.length) {
      fallbacks.forEach(btn => {
        // Try to infer product id from nearby title or image alt
        let id = btn.closest('.card')?.querySelector('h3')?.textContent.toLowerCase()
          .replace(/[^a-z]+/g, '');
        if (!id) {
          const alt = btn.closest('.card')?.querySelector('img')?.alt?.toLowerCase() || '';
          if (alt.includes('vinyl')) id = 'vinyl';
          else if (alt.includes('shirt') || alt.includes('t-shirt')) id = 'tshirt';
          else if (alt.includes('poster')) id = 'poster';
        }
        if (id && PRODUCTS[id]) {
          btn.setAttribute('data-product', id);
          btn.classList.add('details-btn');
        }
      });
    }
  
    console.log('[Merch] Wired buttons:', document.querySelectorAll('[data-product]').length);
  })();