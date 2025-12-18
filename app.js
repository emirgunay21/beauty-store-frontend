// ---------- helpers ----------
async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} -> ${url}`);
  return res.json();
}

function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;

  const cart = readCart();
  const totalQty = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? "inline-block" : "none";
}

// ---------- login modal ----------
function setupLoginModal() {
  const navUser = document.getElementById("navUser");
  const modal = document.getElementById("loginModal");
  const emailEl = document.getElementById("loginEmail");
  const passEl = document.getElementById("loginPass");
  const btn = document.getElementById("loginBtn");
  const msg = document.getElementById("loginMsg");

  if (!navUser || !modal) return;

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    msg && (msg.textContent = "");
    if (emailEl) emailEl.value = "";
    if (passEl) passEl.value = "";
    setTimeout(() => emailEl?.focus(), 0);
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  function getUser() {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  }

  function renderUser() {
    const user = getUser();
    if (user?.email) {
      navUser.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;">
          <img src="User.png" style="width:24px;height:24px;" alt="User">
          <span style="font-size:14px;color:#111;">${user.email}</span>
        </span>
      `;
    } else {
      navUser.innerHTML = `<img src="User.png" style="width:24px;height:24px;cursor:pointer;" alt="User">`;
    }
  }

  // icon click
  navUser.addEventListener("click", () => {
    const user = getUser();
    if (!user) openModal();
    else {
      if (confirm("Çıkış yapmak ister misin?")) {
        localStorage.removeItem("user");
        renderUser();
      }
    }
  });

  // close click
  modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // login btn
  btn?.addEventListener("click", () => {
    const email = (emailEl?.value || "").trim();
    const pass = (passEl?.value || "").trim();

    if (!email || !pass) {
      if (msg) msg.textContent = "Email ve şifre boş olamaz.";
      return;
    }

    localStorage.setItem("user", JSON.stringify({ email }));
    if (msg) msg.textContent = "Giriş başarılı ✅";
    renderUser();
    setTimeout(closeModal, 250);
  });

  renderUser();
}

// ---------- fetch render ----------
async function renderAll() {
  updateCartBadge();

  const productsGrid = document.getElementById("productsGrid");
  const discountGrid = document.getElementById("discountGrid");
  const bannerBottomGrid = document.getElementById("bannerBottomGrid");
  const categoriesGrid = document.getElementById("CategoriesGrid");
  const bigBannerWrapperGrid = document.getElementById("bigBannerWrapperGrid");
  const mainBanner = document.getElementById("mainBanner");

  // products
  if (productsGrid) {
    const data = await getJSON("https://dummyjson.com/products?limit=8");
    productsGrid.innerHTML = data.products.map(p => `
      <div class="productItems">
        <div class="productItemiphone14Pro">
          <img src="${p.thumbnail}" style="width:104px;height:104px;" alt="${p.title}">
          <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">
            ${p.title}
          </h2>
          <p style="font-size:24px;color:black;margin:0px;">
            $${p.price}
          </p>
          <button data-product-id="${p.id}"
            style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
            Buy Now
          </button>
        </div>
      </div>
    `).join("");
  }

  // discount
  if (discountGrid) {
    const data2 = await getJSON("https://dummyjson.com/products?limit=4&skip=8");
    discountGrid.innerHTML = data2.products.map(p => `
      <div class="DiscountitemTopiphoneGold">
        <img src="${p.thumbnail}" style="width:104px;height:104px;" alt="${p.title}">
        <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">
          ${p.title}
        </h2>
        <p style="font-size:24px;color:black;margin:0px;">
          $${p.price}
        </p>
        <button data-product-id="${p.id}"
          style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
          Buy Now
        </button>
      </div>
    `).join("");
  }

  // banner bottom
  if (bannerBottomGrid) {
    const data = await getJSON("https://dummyjson.com/products/category/beauty?limit=4");
    const p = data.products || [];
    bannerBottomGrid.innerHTML = `
      <div class="bannerBottomAirPodsMax">
        <img src="${p[0]?.thumbnail || ""}" style="width:192px;height:200px;margin-top:40px">
        <h2 style="font-size:36px;margin:24px;color:black">${p[0]?.title || "Product"}</h2>
        <p style="font-size:19px;color:gray">${p[0]?.description || ""}</p>
      </div>

      <div class="bannerAppleVisionPro">
        <img src="${p[1]?.thumbnail || ""}" style="width:325px;height:192px;margin-top:40px">
        <h2 style="font-size:36px;margin:24px;color:white">${p[1]?.title || "Product"}</h2>
        <p style="font-size:19px;color:gray">${p[1]?.description || ""}</p>
      </div>

      <div class="bannerPlaystation5">
        <img src="${p[2]?.thumbnail || ""}" style="width:200px;height:200px">
        <h2 style="font-size:36px;margin:24px;color:black">${p[2]?.title || "Product"}</h2>
        <p style="font-size:19px;color:gray">${p[2]?.description || ""}</p>
      </div>

      <div class="MacbookAir">
        <img src="${p[3]?.thumbnail || ""}" style="width:330px;height:200px;margin-top:40px">
        <h2 style="font-size:36px;margin:24px;color:black">${p[3]?.title || "Product"}</h2>
        <p style="font-size:19px;color:gray">${p[3]?.description || ""}</p>
        <button style="width:343px;height:56px;border:2px solid black">Shop Now</button>
      </div>
    `;
  }

  // categories
  if (categoriesGrid) {
    const data3 = await getJSON("https://dummyjson.com/products/categories");
    const normalize = (c) => (typeof c === "string" ? { slug: c, name: c } : { slug: c.slug || c.name || "", name: c.name || c.slug || "" });
    const all = data3.map(normalize);

    const wantedSlugs = ["beauty","fragrances","skin-care","sunglasses","womens-bags","womens-jewellery"];

    async function getCategoryIcon(slug) {
      try {
        const d = await getJSON(`https://dummyjson.com/products/category/${slug}?limit=1`);
        return d.products?.[0]?.thumbnail || "phoneicon.png";
      } catch {
        return "phoneicon.png";
      }
    }

    const list = wantedSlugs.map(slug => all.find(c => c.slug === slug) || { slug, name: slug });
    categoriesGrid.innerHTML = "";

    for (let i = 0; i < list.length; i += 2) {
      const left = list[i];
      const right = list[i + 1];
      const leftIcon = await getCategoryIcon(left.slug);
      const rightIcon = await getCategoryIcon(right.slug);

      categoriesGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".category-card");
  if (!card) return;

  const slug = card.dataset.cat;
  if (!slug) return;

  window.location.href = `ProductPage.html?category=${encodeURIComponent(slug)}`;
});
     categoriesGrid.innerHTML += `
  <div class="CategoryItem">
    <div class="CategoryItemTop category-card" data-cat="${left.slug}">
      <img src="${leftIcon}" style="width:48px;height:48px;" alt="${left.name}">
      <h1 style="font-size:16px;margin:0;color:black">${String(left.name).split("-").join(" ")}</h1>
    </div>

    <div class="CategoryItemTop category-card" data-cat="${right.slug}">
      <img src="${rightIcon}" style="width:48px;height:48px;" alt="${right.name}">
      <h1 style="font-size:16px;margin:0;color:black">${String(right.name).split("-").join(" ")}</h1>
    </div>
  </div>
`;
    }
  }

  // big banners
  if (bigBannerWrapperGrid) {
    const data = await getJSON("https://dummyjson.com/products/category/beauty?limit=4");
    const p = data.products || [];
    while (p.length < 4) p.push({ title: "Product", description: "", thumbnail: "" });

    bigBannerWrapperGrid.innerHTML = `
      <div class="bigBanner bigBanner-mobile-visible">
        <div class="Halfimage"><img src="${p[0].thumbnail}" style="width:360px; height:366px;" alt="${p[0].title}"></div>
        <div class="bigBannerText">
          <p style="font-size:49px;margin:0;color:black">${p[0].title}</p>
          <p style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[0].description}</p>
          <button style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">Shop Now</button>
        </div>
      </div>

      <div class="bigBanner bigBanner-desktop-only">
        <div class="Halfimage"><img src="${p[0].thumbnail}" style="width:360px; height:327px;" alt="${p[0].title}"></div>
        <div class="bigBannerText">
          <p style="font-size:49px;margin:0;color:black">${p[0].title}</p>
          <p style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[0].description}</p>
          <button style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">Shop Now</button>
        </div>
      </div>

      <div class="bigBanner bigBanner-desktop-only">
        <div class="Halfimage"><img src="${p[1].thumbnail}" style="width:360px; height:360px;" alt="${p[1].title}"></div>
        <div class="bigBannerText">
          <p style="font-size:49px;margin:0;color:black">${p[1].title}</p>
          <p style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[1].description}</p>
          <button style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">Shop Now</button>
        </div>
      </div>

      <div class="bigBanner bigBanner-desktop-only">
        <div class="Halfimage"><img src="${p[2].thumbnail}" style="width:360px; height:360px;" alt="${p[2].title}"></div>
        <div class="bigBannerText">
          <p style="font-size:49px;margin:0;color:black">${p[2].title}</p>
          <p style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[2].description}</p>
          <button style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">Shop Now</button>
        </div>
      </div>

      <div class="bigBanner bigBanner-desktop-only bigBanner-dark">
        <div class="Halfimage"><img src="${p[3].thumbnail}" style="width:340px; height:356px;" alt="${p[3].title}"></div>
        <div class="bigBannerText">
          <p style="font-size:49px;margin:0;color:white">${p[3].title}</p>
          <p style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[3].description}</p>
          <button style="width:184px;height:56px;background:#2C2C2C;border:2px solid white;color:white;border-radius:8px;">Shop Now</button>
        </div>
      </div>
    `;
  }

  // main banner
  if (mainBanner) {
    const data = await getJSON("https://dummyjson.com/products/category/beauty?limit=1");
    const p = data.products?.[0];

    mainBanner.innerHTML = `
      <div class="bannerTop">
        <p style="font-size:25px;color:gray;margin:0;">Beauty Collection</p>
        <h1 style="font-size:72px;margin:0;color:#FFFFFF">Discover</h1>
        <h2 style="font-size:72px;margin:0;color:#FFFFFF">${p?.title || "Beauty Essentials"}</h2>
        <p style="font-size:19px;color:gray;margin:0;">${p?.description || ""}</p>
        <button style="width:184px;height:56px;background-color:#211C24;border:2px solid white;color:white;margin-top:48px;border-radius:8px;">
          Shop Now
        </button>
      </div>

      <div class="bannerTopimage">
        <picture>
          <source media="(min-width:1024px)" srcset="${p?.images?.[0] || p?.thumbnail || ""}">
          <img src="${p?.thumbnail || ""}" alt="${p?.title || "Beauty product"}">
        </picture>
      </div>
    `;
  }
}

// ---------- global click handlers ----------
function setupClicks() {
  // all buttons should show hand
  document.body.style.cursor = "default";

  // add-to-cart
  document.body.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-product-id]");
    if (!button) return;

    const productId = Number(button.dataset.productId);
    if (!Number.isFinite(productId)) return;

    const cart = readCart();
    const existing = cart.find(i => Number(i.id) === productId);

    if (existing) existing.qty = (existing.qty || 0) + 1;
    else cart.push({ id: productId, qty: 1 });

    writeCart(cart);
    updateCartBadge();
  });
}

// ---------- init ----------
document.addEventListener("DOMContentLoaded", async () => {
  setupLoginModal();
  setupClicks();
  try { await renderAll(); } catch (e) { console.error(e); }
});
