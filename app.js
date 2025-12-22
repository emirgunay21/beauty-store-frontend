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
  const badgeDesktop = document.getElementById("cartCount");
  const badgeMobile = document.getElementById("cartCountMobile");

  const cart = readCart();
  const totalQty = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  // Desktop badge
  if (badgeDesktop) {
    badgeDesktop.textContent = totalQty;
    badgeDesktop.style.display = totalQty > 0 ? "inline-block" : "none";
  }


  if (badgeMobile) {
    badgeMobile.textContent = totalQty;
    badgeMobile.style.display = totalQty > 0 ? "inline-block" : "none";
  }
}

function setupBurgerMenu() {
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("menuOverlay");
  const closeBtn = document.getElementById("menuCloseBtn");

  
  if (!burgerBtn || !mobileMenu || !overlay || !closeBtn) return;

  function openMenu() {
    mobileMenu.classList.add("open");
    overlay.classList.add("open");
    burgerBtn.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("open");
    burgerBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  burgerBtn.addEventListener("click", () => {
    mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);
  closeBtn.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  mobileMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeMenu();
  });
}

function readComments(productId) {
  try {
    const all = JSON.parse(localStorage.getItem("commentsByProduct")) || {};
    return Array.isArray(all[productId]) ? all[productId] : [];
  } catch {
    return [];
  }
}

function writeComments(productId, list) {
  const all = (() => {
    try { return JSON.parse(localStorage.getItem("commentsByProduct")) || {}; }
    catch { return {}; }
  })();

  all[productId] = list;
  localStorage.setItem("commentsByProduct", JSON.stringify(all));
}
function setupLoginModal() {
  const navUser = document.getElementById("navUser");
  const mobileUserBtn = document.getElementById("mobileUserBtn");
  const navCart = document.getElementById("navCart");
  const mobileCartBtn = document.getElementById("mobileCartBtn");
  const modal = document.getElementById("loginModal");
  const emailEl = document.getElementById("loginEmail");
  const passEl = document.getElementById("loginPass");
  const btn = document.getElementById("loginBtn");
  const msg = document.getElementById("loginMsg");
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("menuOverlay");
  const closeBtn = document.getElementById("menuCloseBtn");

  if (!navUser || !modal) return;

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    if (msg) msg.textContent = "";
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

  // Desktop user click => modal / logout
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

  
  if (mobileUserBtn) {
  mobileUserBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    
    if (mobileMenu && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      overlay?.classList.remove("show");  
      burgerBtn?.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    
    navUser.click();
  });
}


  if (navCart) navCart.addEventListener("click", () => window.location.href = "ShoppingCardMobile.html");
  if (mobileCartBtn) mobileCartBtn.addEventListener("click", () => window.location.href = "ShoppingCardMobile.html");

 
  // ---------- modal close handlers ----------
  modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

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
  const productPageGrid = document.getElementById("productPageGrid");

  // products (Home)
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
          <button data-go-detail="1" data-product-id="${p.id}"
            style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
            Buy Now
          </button>
        </div>
      </div>
    `).join("");
  }

  // discount (Home)
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
        <button data-go-detail="1" data-product-id="${p.id}" 
          style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
          Buy Now
        </button>
      </div>
    `).join("");
  }

  // banner bottom (Home)
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

  // categories (Home)
  if (categoriesGrid) {
    // ✅ click eventi sadece 1 kere ekle
    if (!categoriesGrid.dataset.bound) {
      categoriesGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".category-card");
        if (!card) return;

        const slug = card.dataset.cat;
        if (!slug) return;

        window.location.href = `ProductPage.html?category=${encodeURIComponent(slug)}`;
      });
      categoriesGrid.dataset.bound = "1";
    }

    const data3 = await getJSON("https://dummyjson.com/products/categories");
    const normalize = (c) =>
      (typeof c === "string")
        ? { slug: c, name: c }
        : { slug: c.slug || c.name || "", name: c.name || c.slug || "" };

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
      const rightIcon = right ? await getCategoryIcon(right.slug) : "";

      categoriesGrid.innerHTML += `
        <div class="CategoryItem">
          <div class="CategoryItemTop category-card" data-cat="${left.slug}">
            <img src="${leftIcon}" style="width:48px;height:48px;" alt="${left.name}">
            <h1 style="font-size:16px;margin:0;color:black">${String(left.name).split("-").join(" ")}</h1>
          </div>

          ${right ? `
          <div class="CategoryItemTop category-card" data-cat="${right.slug}">
            <img src="${rightIcon}" style="width:48px;height:48px;" alt="${right.name}">
            <h1 style="font-size:16px;margin:0;color:black">${String(right.name).split("-").join(" ")}</h1>
          </div>
          ` : ""}
        </div>
      `;
    }
  }

  // big banners (Home)
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

  // main banner (Home)
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

  // ✅ ProductPage ürünleri (ProductPage.html)
  if (productPageGrid) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get("category") || "Beauty";

      const data = await getJSON(`https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=12`);
      const products = data.products || [];
       buildBrandFilters(products);
       PRODUCTPAGE_ALL = products;
PRODUCTPAGE_VIEW = products;

buildBrandListDesktop(PRODUCTPAGE_ALL);
setupBrandSearchDesktop();
      let html = "";
      for (let i = 0; i < products.length; i += 2) {
        const left = products[i];
        const right = products[i + 1];

        html += `
          <div class="ProductResultItems">
            <div class="productResultItemIphone">
              <img src="${left.thumbnail}" style="width:104px;height:104px;" alt="${left.title}">
              <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">${left.title}</h2>
              <p style="font-size:24px;color:black;margin:0;">$${left.price}</p>
              <button data-go-detail="1" data-product-id="${left.id}"
                style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
                Buy Now
              </button>
            </div>

            ${right ? `
            <div class="productResultItemIphone">
              <img src="${right.thumbnail}" style="width:104px;height:104px;" alt="${right.title}">
              <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">${right.title}</h2>
              <p style="font-size:24px;color:black;margin:0;">$${right.price}</p>
              <button data-go-detail="1" data-product-id="${right.id}"
                style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
                Buy Now
              </button>
            </div>
            ` : ""}
          </div>
        `;
      }

      productPageGrid.innerHTML = html;
    } catch (err) {
      console.error("❌ ProductPage fetch error:", err);
    }
  }
}

const filtersBtn = document.getElementById("filtersBtn");
const ratingBtn = document.getElementById("ratingBtn");
const filtersDrop = document.getElementById("filtersDrop");
const ratingChevron = document.getElementById("ratingChevron");

function toggleDrop() {
  filtersDrop.classList.toggle("open");
}

filtersBtn?.addEventListener("click", toggleDrop);
ratingBtn?.addEventListener("click", () => {
  toggleDrop();
  ratingChevron?.classList.toggle("rotate");
});
function buildBrandFilters(products) {
  const box = document.getElementById("brandFilters");
  if (!box) return;

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();

  box.innerHTML = brands
    .map(b => `<label><input type="checkbox" value="${b}"> ${b}</label>`)
    .join("");
}
let PRODUCTPAGE_ALL = [];
let PRODUCTPAGE_VIEW = [];

function buildBrandListDesktop(products) {
  const ul = document.getElementById("brandListDesktop");
  if (!ul) return;

  // brand -> count
  const counts = new Map();
  products.forEach(p => {
    if (!p.brand) return;
    counts.set(p.brand, (counts.get(p.brand) || 0) + 1);
  });

  const brands = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  ul.innerHTML = brands.map(([brand, count]) => `
    <li>
      <label class="brandItem">
        <input type="checkbox" class="brandCheckDesktop" value="${brand}">
        <span class="brandCheck"></span>
        <span class="brandName">${brand}</span>
        <span class="brandCount">${count}</span>
      </label>
    </li>
  `).join("");

  
  ul.querySelectorAll(".brandCheckDesktop").forEach(chk => {
    chk.addEventListener("change", applyDesktopBrandFilter);
  });
}

function setupBrandSearchDesktop() {
  const input = document.getElementById("brandSearchDesktop");
  const ul = document.getElementById("brandListDesktop");
  if (!input || !ul) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    ul.querySelectorAll("li").forEach(li => {
      const name = li.querySelector(".brandName")?.textContent?.toLowerCase() || "";
      li.style.display = name.includes(q) ? "" : "none";
    });
  });
}


function applyDesktopBrandFilter() {
  const selected = [...document.querySelectorAll(".brandCheckDesktop:checked")].map(x => x.value);

  let filtered = [...PRODUCTPAGE_ALL];
  if (selected.length) {
    filtered = filtered.filter(p => selected.includes(p.brand));
  }

  PRODUCTPAGE_VIEW = filtered;


  renderProductPageGridDesktop(PRODUCTPAGE_VIEW);
}

// ---------- global click handlers ----------
function setupClicks() {
  document.body.addEventListener("click", (e) => {

    // 1) Detaya gitme (Buy Now)
    const goDetailBtn = e.target.closest("button[data-go-detail='1']");
    if (goDetailBtn) {
      const id = Number(goDetailBtn.dataset.productId);
      if (!Number.isFinite(id)) return;
      window.location.href = `ProductDetailsMobile.html?id=${id}`;
      return;
    }

    // 2) Sepete ekleme (Add to Cart)
    const addCartBtn = e.target.closest("button[data-add-cart='1']");
    if (addCartBtn) {
      const id = Number(addCartBtn.dataset.productId);
      if (!Number.isFinite(id)) return;

      const cart = readCart();
      const existing = cart.find(i => Number(i.id) === id);

      if (existing) existing.qty = (existing.qty || 0) + 1;
      else cart.push({ id, qty: 1 });

      writeCart(cart);
      updateCartBadge();
      return;
    }

  });
}
function buildStarsHTML(rating, size = 24) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.floor(r);
  const half = (r - full) >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  let html = "";
  for (let i = 0; i < full; i++) {
    html += `<img src="Star 1.png" style="width:${size}px;height:${size}px;" alt="star">`;
  }
  if (half) {
    html += `<img src="Star 5.png" style="width:${size}px;height:${size}px;" alt="half">`;
  }
  for (let i = 0; i < empty; i++) {
    html += `<img src="Starempty.png" style="width:${size}px;height:${size}px;" alt="empty">`;
  }
  return html;
}

async function renderProductDetails() {
  const root = document.getElementById("productDetailsRoot");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    root.innerHTML = "<p style='padding:16px;'>Ürün bulunamadı (id yok).</p>";
    return;
  }

  try {
    const p = await getJSON(`https://dummyjson.com/products/${encodeURIComponent(id)}`);
    await renderRelatedProducts(p);

    // ------------------------------
    // 1) ÖNCE sayfa iskeletini bas (root.innerHTML)
    // ------------------------------
    const thumbs = (p.images || []).slice(0, 4);

    const catLower = String(p.category || "").toLowerCase();
    const isBeauty = ["beauty", "fragrances", "skin-care"].includes(catLower);

    const shadeOptions = [
      { key: "01", name: "Light" },
      { key: "02", name: "Medium" },
      { key: "03", name: "Dark" },
    ];
    const sizeOptions = ["30ml", "50ml", "100ml"];

    root.innerHTML = `
      <div class="productPageDetailsMobileMedia">
        <div class="productPageFiltersMobileTop">
          <img src="${p.thumbnail}" style="width:263.59px;height:329.24px;" alt="${p.title}">
          <div class="imageFilters">
            ${thumbs.map(src => `<img src="${src}" style="width:74px;height:66px;" alt="thumb">`).join("")}
          </div>
        </div>

        <div class="productPageDetailsMobileContent">
          <div class="productPageDetailsMobileText">
            <h1 style="font-size:40px;font-weight:bold;margin:0;">${p.title}</h1>

            <div class="productPageDetailsMobileText2">
              <p style="font-size:32px;margin:0;">$${p.price}</p>
              ${p.discountPercentage ? `
                <p style="font-size:24px;color:gray;text-decoration:line-through;margin-left:16px;margin-top:6px;">
                  $${Math.round(p.price / (1 - (p.discountPercentage/100)))}
                </p>` : ``}
            </div>
          </div>

          <div class="metaGrid">
            <div class="metaItem">
              <p class="metaLabel">Brand</p>
              <p class="metaValue">${p.brand || "-"}</p>
            </div>
            <div class="metaItem">
              <p class="metaLabel">Category</p>
              <p class="metaValue">${p.category || "-"}</p>
            </div>
            <div class="metaItem">
              <p class="metaLabel">Rating</p>
              <p class="metaValue">${p.rating ?? "-"}</p>
            </div>
            <div class="metaItem">
              <p class="metaLabel">Stock</p>
              <p class="metaValue">${Number(p.stock||0) > 0 ? `${p.stock} pcs` : "Out of stock"}</p>
            </div>
          </div>

          ${isBeauty ? `
          <div class="variantBlock">
            <p class="metaLabel" style="margin-bottom:10px;">Shade</p>
            <div class="pillRow" id="shadeRow">
              ${shadeOptions.map(s => `
                <button type="button" class="pillBtn" data-shade="${s.key}">
                  ${s.key} <span style="opacity:.7;margin-left:6px;">${s.name}</span>
                </button>
              `).join("")}
            </div>
          </div>

          <div class="variantBlock">
            <p class="metaLabel" style="margin-bottom:10px;">Size</p>
            <div class="pillRow" id="sizeRow">
              ${sizeOptions.map(sz => `
                <button type="button" class="pillBtn" data-size="${sz}">${sz}</button>
              `).join("")}
            </div>
          </div>
          ` : ""}

          <p style="font-size:15px;color:#6C6C6C;margin-top:18px;">${p.description || ""}</p>

          <div class="productPageDetailsMobileButtons">
            <button style="width:341px;height:56px;background:white;border-radius:8px;border:1px solid black;color:black;font-size:16px;margin-top:26px;">
              Add to Wishlist
            </button>

            <button id="addToCartBtn"
              style="width:341px;height:56px;background:black;border-radius:8px;border:1px solid black;color:white;font-size:16px;margin-top:16px;">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;

    // ------------------------------
    // 2) Root basıldıktan SONRA: Details section (senin mevcut HTML id'lerin)
    // ------------------------------
    renderDetailsSection(p);

    // ------------------------------
    // 3) Breadcrumbs (root dışındaysa da sorun yok)
    // ------------------------------
    const bc = document.getElementById("breadcrumbs");
    if (bc) {
      const catText = (p.category || "").toString().split("-").join(" ");
      const title = (p.title || "").toString();

      bc.innerHTML = `
        <p style="color:#A4A4A4;cursor:pointer;" data-bc="home">Home</p>
        <img src="Arrowright.png" alt="">
        <p style="color:#A4A4A4;cursor:pointer;" data-bc="catalog">Catalog</p>
        <img src="Arrowright.png" alt="">
        <p style="color:#A4A4A4;cursor:pointer;" data-bc="category">${catText}</p>
        <img src="Arrowright.png" alt="">
        <p>${title}</p>
      `;

      bc.querySelector("[data-bc='home']")?.addEventListener("click", () => {
        window.location.href = "Home.html";
      });

      bc.querySelector("[data-bc='catalog']")?.addEventListener("click", () => {
        window.location.href = "ProductPage.html?category=beauty";
      });

      bc.querySelector("[data-bc='category']")?.addEventListener("click", () => {
        window.location.href = `ProductPage.html?category=${encodeURIComponent(p.category)}`;
      });
    }

    // ------------------------------
    // 4) Reviews rating number + stars
    // ------------------------------
    const reviewsBox = document.querySelector(".productPageFiltersMobileRewiews");
    const ratingNumberEl = reviewsBox?.querySelector(".productPageFiltersMobileRewiewsRating1 h1");
    if (ratingNumberEl) ratingNumberEl.textContent = (p.rating ?? "-").toString();

    const ratingStarsEl = reviewsBox?.querySelector(".productPageFiltersMobileRewiewsRatingStars");
    if (ratingStarsEl) ratingStarsEl.innerHTML = buildStarsHTML(p.rating, 24);

    // ------------------------------
    // 5) Comments: seed + stored + render (AVATAR FIX)
    // ------------------------------
    const commentsRoot = document.getElementById("commentsRoot");
    const input = document.getElementById("commentInput");
    const starsSel = document.getElementById("commentStars");
    const sendBtn = document.getElementById("commentSubmit");

    // seed yorumlar (avatar ekledik)
    const beautyComments = [
      { name: "Grace Carey", stars: 4.5, text: "Texture is smooth and lightweight. Blends easily and looks natural all day. Great for daily makeup.", pics: [], avatar: "gracepic.png" },
      { name: "Ronald Richards", stars: 5, text: "Nice packaging and the scent is pleasant (not too strong). Good value for the price.", pics: [], avatar: "ronaldpic.png" },
      { name: "Darcy King", stars: 4, text: "Color payoff is good, but I’d recommend moisturizing first. Overall I’m happy with it.", pics: [], avatar: "darcypic.png" }
    ];

    const phoneComments = [
      { name: "Grace Carey", stars: 4.5, text: "Fast delivery and the device looks great. Performance is solid and battery lasts long.", pics: [], avatar: "gracepic.png" },
      { name: "Ronald Richards", stars: 5, text: "Storage is great and the build feels premium. Highly recommended.", pics: [], avatar: "ronaldpic.png" },
      { name: "Darcy King", stars: 4, text: "Camera quality is good, but low-light could be better. Still a nice purchase.", pics: [], avatar: "darcypic.png" }
    ];

    const seedList = isBeauty ? beautyComments : phoneComments;

    function pickFallbackAvatar(name) {
      const n = String(name || "").toLowerCase();
      if (n.includes("grace")) return "gracepic.png";
      if (n.includes("ronald")) return "ronaldpic.png";
      if (n.includes("darcy")) return "darcypic.png";
      return "User.png";
    }

    function renderComments(listToRender) {
      if (!commentsRoot) return;

      commentsRoot.innerHTML = listToRender.map((c, idx) => {
        const cls =
          idx === 0 ? "reviewAndCommentsGrace" :
          idx === 1 ? "reviewAndCommentsRonald" :
          "reviewAndCommentsDarcy";

        const avatarSrc = c.avatar || pickFallbackAvatar(c.name);

        return `
          <div class="${cls}">
            <img src="${avatarSrc}" style="width:48px;height:48px;margin-left:16px;margin-top:24px;" alt="User">

            <div class="reviewAndCommentsGraceText">
              <p style="font-size:17px;font-weight:bold;margin:0px;margin-left:16px;">${c.name}</p>

              <div class="reviewAndCommentsGraceTextStars">
                ${buildStarsHTML(c.stars, 16)}
              </div>

              <div class="reviewAndCommentsGraceComment">
                <p style="font-size:17px;color:#7E7E7E">${c.text}</p>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    if (commentsRoot) {
      const stored = readComments(String(p.id)); // user yorumları
      const merged = [...stored, ...seedList];   // önce user, sonra seed
      renderComments(merged);
    }

    // Yorum gönderme (login kontrol + avatar User.png)
    if (sendBtn && !sendBtn.dataset.bound) {
      sendBtn.dataset.bound = "1";

      sendBtn.addEventListener("click", () => {
        const text = (input?.value || "").trim();
        const stars = Number(starsSel?.value || 5);

        if (!text) {
          alert("Yorum boş olamaz.");
          return;
        }

        const user = (() => {
          try { return JSON.parse(localStorage.getItem("user")); }
          catch { return null; }
        })();

        if (!user?.email) {
          alert("Yorum yapmak için giriş yapmalısın.");
          document.getElementById("navUser")?.click();
          return;
        }

        const storedNow = readComments(String(p.id));
        storedNow.unshift({
          name: user.email,
          stars,
          text,
          pics: [],
          avatar: "User.png"
        });

        writeComments(String(p.id), storedNow);

        if (input) input.value = "";

        const mergedNow = [...storedNow, ...seedList];
        renderComments(mergedNow);
      });
    }

    // ------------------------------
    // 6) View more / View less toggle (EN SONRA)
    // ------------------------------
    setupCommentsToggle();

    // ------------------------------
    // 7) Beauty varyant seçimi + AddToCart (root basıldıktan sonra bağla)
    // ------------------------------
    let selectedShade = null;
    let selectedSize = null;

    function bindPills(rowId, attr, onSelect) {
      const row = document.getElementById(rowId);
      if (!row) return;
      row.querySelectorAll(".pillBtn").forEach(btn => {
        btn.addEventListener("click", () => {
          row.querySelectorAll(".pillBtn").forEach(x => x.classList.remove("active"));
          btn.classList.add("active");
          onSelect(btn.dataset[attr]);
        });
      });
    }

    if (isBeauty) {
      bindPills("shadeRow", "shade", (v) => selectedShade = v);
      bindPills("sizeRow", "size", (v) => selectedSize = v);

      const firstShade = document.querySelector("#shadeRow .pillBtn");
      if (firstShade) firstShade.click();
      const firstSize = document.querySelector("#sizeRow .pillBtn");
      if (firstSize) firstSize.click();
    }

    const addBtn = document.getElementById("addToCartBtn");
    addBtn?.addEventListener("click", () => {
      if (Number(p.stock || 0) <= 0) {
        alert("Stok yok.");
        return;
      }

      const cart = readCart();
      const key = `${p.id}|${selectedShade || ""}|${selectedSize || ""}`;
      const existing = cart.find(i => i.key === key);

      if (existing) existing.qty = (existing.qty || 0) + 1;
      else cart.push({
        key,
        id: p.id,
        qty: 1,
        shade: selectedShade,
        size: selectedSize
      });

      writeCart(cart);
      updateCartBadge();
    });

  } catch (err) {
    console.error(err);
    root.innerHTML = "<p style='padding:16px;'>Ürün yüklenemedi.</p>";
  }
}
async function renderRelatedProducts(p) {
  const grid = document.getElementById("relatedProductsGrid");
  if (!grid) return;

  try {
    const cat = encodeURIComponent(p.category || "");
    if (!cat) {
      grid.innerHTML = "";
      return;
    }

    const data = await getJSON(`https://dummyjson.com/products/category/${cat}?limit=12`);
    let list = (data.products || []).filter(x => Number(x.id) !== Number(p.id));

    // 4 ürün yeter
    list = list.slice(0, 4);

    // 2'li satır mantığı (senin diğer grid'lerin gibi)
    let html = "";
    for (let i = 0; i < list.length; i += 2) {
      const left = list[i];
      const right = list[i + 1];

      html += `
        <div class="ProductResultItems">
          <div class="productResultItemIphone">
            <img src="${left.thumbnail}" style="width:104px;height:104px;" alt="${left.title}">
            <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">${left.title}</h2>
            <p style="font-size:24px;color:black;margin:0;">$${left.price}</p>
            <button data-go-detail="1" data-product-id="${left.id}"
              style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
              Buy Now
            </button>
          </div>

          ${right ? `
          <div class="productResultItemIphone">
            <img src="${right.thumbnail}" style="width:104px;height:104px;" alt="${right.title}">
            <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">${right.title}</h2>
            <p style="font-size:24px;color:black;margin:0;">$${right.price}</p>
            <button data-go-detail="1" data-product-id="${right.id}"
              style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
              Buy Now
            </button>
          </div>
          ` : ""}
        </div>
      `;
    }

    grid.innerHTML = html;
  } catch (e) {
    console.error("Related products error:", e);
    grid.innerHTML = "";
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "-";
}

function renderDetailsSection(p) {
  setText("pdDetailsText", p.description || "");

  setText("pdSpec1", p.brand || "-");
  setText("pdSpec2", p.category || "-");
  setText("pdSpec3", (p.rating ?? "-").toString());
  setText("pdSpec4", Number(p.stock || 0) > 0 ? `${p.stock} pcs` : "Out of stock");
  setText("pdSpec5", `$${p.price}`);

  const extra = document.getElementById("pdExtraList");
  if (extra) {
    const tags = Array.isArray(p.tags) ? p.tags : [];
    extra.innerHTML = tags.length
      ? tags.map(t => `<p style="font-size: 15px;color: black;font-weight: bold;margin: 0px;">${String(t)}</p>`).join("")
      : `<p style="font-size: 15px;color: black;font-weight: bold;margin: 0px;">-</p>`;
  }

  setText("pdCpu1", p.warrantyInformation || "-");
  setText("pdCpu2", p.shippingInformation || "-");
}
function setupCommentsToggle() {
  const root = document.getElementById("commentsRoot");
  const btn = document.getElementById("commentsToggleBtn");
  if (!root || !btn) return;

  btn.addEventListener("click", () => {
    const opened = root.classList.toggle("expanded");
    btn.textContent = opened ? "View less" : "View more";
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  setupBurgerMenu();
  setupLoginModal();
  setupClicks();
  setupCommentsToggle(); // ✅ bunu ekle

  try {
    await renderAll();
    await renderProductDetails();
  } catch (e) {
    console.error(e);
  }
});

