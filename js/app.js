let cart = JSON.parse(localStorage.getItem('kalamayi_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('kalamayi_wishlist')) || [];

function updateBadges() {
  document.querySelectorAll('.cart-badge-count').forEach(b => b.textContent = cart.reduce((t, i) => t + (i.qty || 1), 0));
  document.querySelectorAll('.fav-badge-count').forEach(b => b.textContent = wishlist.length);
}

function openDrawer(id) {
  const b = document.getElementById('drawerBackdrop');
  const d = document.getElementById(id);
  if (b && d) { b.classList.add('open'); d.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeAllDrawers() {
  const b = document.getElementById('drawerBackdrop');
  document.querySelectorAll('.side-drawer').forEach(d => d.classList.remove('open'));
  if (b) b.classList.remove('open');
  document.body.style.overflow = '';
}

function addToCart(p) {
  const ex = cart.find(i => i.id === p.id);
  if (ex) ex.qty = (ex.qty || 1) + 1;
  else cart.push({ ...p, qty: 1 });
  localStorage.setItem('kalamayi_cart', JSON.stringify(cart));
  updateBadges();
  renderCart();
  openDrawer('cartDrawer');
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem('kalamayi_cart', JSON.stringify(cart));
  updateBadges();
  renderCart();
}

function renderCart() {
  const c = document.getElementById('cartDrawerItems');
  const s = document.getElementById('cartDrawerSubtotal');
  if (!c) return;
  if (cart.length === 0) {
    c.innerHTML = '<div style="text-align:center; padding: 40px 10px; color:#888;">Your cart is empty.</div>';
    if (s) s.textContent = '₹0';
    return;
  }
  let sub = 0;
  c.innerHTML = cart.map(i => {
    sub += i.price * i.qty;
    return `<div style="display:flex; gap:12px; margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid #f0ece4;">
      <img src="${i.img}" style="width:60px; height:60px; border-radius:8px; object-fit:cover;">
      <div style="flex-grow:1;">
        <h4 style="font-size:0.88rem; font-weight:600;">${i.name}</h4>
        <p style="font-size:0.78rem; color:#777;">Qty: ${i.qty} × ₹${i.price}</p>
        <button onclick="removeFromCart('${i.id}')" style="background:none; color:#C2410C; font-size:0.75rem; cursor:pointer; padding:0;">Remove</button>
      </div>
    </div>`;
  }).join('');
  if (s) s.textContent = `₹${sub.toLocaleString('en-IN')}`;
}

function toggleWishlist(p, btn) {
  const idx = wishlist.findIndex(i => i.id === p.id);
  if (idx > -1) { wishlist.splice(idx, 1); if (btn) btn.classList.remove('active'); }
  else { wishlist.push(p); if (btn) btn.classList.add('active'); }
  localStorage.setItem('kalamayi_wishlist', JSON.stringify(wishlist));
  updateBadges();
}

function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const icon = btn.querySelector('.faq-icon');
  if (ans.style.display === 'block') {
    ans.style.display = 'none';
    if (icon) icon.textContent = '+';
  } else {
    ans.style.display = 'block';
    if (icon) icon.textContent = '−';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  renderCart();
  const b = document.getElementById('drawerBackdrop');
  if (b) b.addEventListener('click', closeAllDrawers);
});
