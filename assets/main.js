document.addEventListener('DOMContentLoaded', () => {

  const menuBtn = document.querySelector('.menu-btn');
  const header = document.querySelector('header');
  if (menuBtn) {
      menuBtn.addEventListener('click', () => header.classList.toggle('nav-open'));
  }

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

  const PRODUCTS = {
      vinyl: {
          id: 'vinyl',
          title: 'Signed Vinyl',
          price: 29.0,
          image: 'images/malcVinyl.png',
          desc: 'Limited run 12\\" vinyl. Full-color sleeve, signed by Malcolm. Includes digital download card.',
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
          options: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      poster: {
          id: 'poster',
          title: 'Tour Poster',
          price: 12.0,
          image: 'images/malcPoster.jpg',
          desc: '18\\"×24\\" matte poster from the Summer Tour. Ships rolled in a tube.',
          optionsLabel: null,
          options: null
      }
  };

  (function merchModal() {
      const modal = document.getElementById('productModal');
      if (!modal) return;

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
          if (!data) return;

          img.src = data.image;
          img.alt = data.title;
          titleEl.textContent = data.title;
          priceEl.textContent = `$${data.price.toFixed(2)}`;
          descEl.textContent = data.desc;

          if (data.options) {
              optionGroup.hidden = false;
              optionLabel.textContent = data.optionsLabel || 'Option';
              optionSelect.innerHTML = data.options.map(o => `<option>${o}</option>`).join('');
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

      closeBtn?.addEventListener('click', closeModal);

      modal.addEventListener('click', e => {
          const rect = modal.getBoundingClientRect();
          const inside = e.clientX >= rect.left &&
                         e.clientX <= rect.right &&
                         e.clientY >= rect.top &&
                         e.clientY <= rect.bottom;
          if (!inside) closeModal();
      });

      modal.querySelector('form')?.addEventListener('submit', e => {
          e.preventDefault();
          const submitter = e.submitter;
          if (submitter?.value === 'cancel') return closeModal();

          submitter.textContent = 'Added!';
          submitter.disabled = true;
          setTimeout(() => {
              submitter.disabled = false;
              submitter.textContent = 'Add to Cart';
              closeModal();
          }, 650);
      });

      document.addEventListener('click', e => {
          const btn = e.target.closest('[data-product]');
          if (btn) {
              e.preventDefault();
              openProduct(btn.dataset.product);
          }
      });
  })();

  const ticketModal = document.getElementById("ticket-modal");
  const closeTicketBtn = document.getElementById("close-modal-btn");
  const sectionSelect = document.getElementById("section");
  const quantitySelect = document.getElementById("quantity");
  const totalDisplay = document.getElementById("total-display");
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const toast = document.getElementById("toast");

  let selectedShow = null;

  function updateTotal() {
      const price = parseInt(sectionSelect.selectedOptions[0].dataset.price);
      const quantity = parseInt(quantitySelect.value);
      totalDisplay.textContent = `Total: $${price * quantity}`;
  }

  document.querySelectorAll(".ticket-btn").forEach(btn => {
      btn.addEventListener("click", () => {
          selectedShow = btn.dataset.showId;
          updateTotal();
          ticketModal.classList.remove("hidden");
      });
  });

  closeTicketBtn?.addEventListener("click", () => {
      ticketModal.classList.add("hidden");
  });

  sectionSelect?.addEventListener("change", updateTotal);
  quantitySelect?.addEventListener("change", updateTotal);

  function showToast(message) {
      toast.textContent = message;
      toast.classList.remove("hidden");

      void toast.offsetWidth;
      toast.classList.add("show");

      setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => toast.classList.add("hidden"), 400);
      }, 2500);
  }

  addToCartBtn?.addEventListener("click", async () => {
      const price = parseInt(sectionSelect.selectedOptions[0].dataset.price);
      const quantity = parseInt(quantitySelect.value);

      await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              show_id: selectedShow,
              section: sectionSelect.value,
              quantity,
              price
          })
      });

      showToast("✔ Successfully added to cart!");
      ticketModal.classList.add("hidden");
  });

}); 
