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

  // Mobile badge
  if (badgeMobile) {
    badgeMobile.textContent = totalQty;
    badgeMobile.style.display = totalQty > 0 ? "inline-block" : "none";
  }
}


// ---------- login modal ----------
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

  // ✅ MOBİL USER: Login.html'ye gitme -> Desktop'taki aynı davranışı çalıştır
  if (mobileUserBtn) {
    mobileUserBtn.addEventListener("click", () => {
      // Menüyü kapat (açıksa)
      if (mobileMenu?.classList.contains("open")) closeMenu();
      // Desktop user click'i tetikle => modal açılır / logout çalışır
      navUser.click();
    });
  }

  // Sepet yönlendirmeleri (desktop + mobile)
  if (navCart) navCart.addEventListener("click", () => window.location.href = "ShoppingCardMobile.html");
  if (mobileCartBtn) mobileCartBtn.addEventListener("click", () => window.location.href = "ShoppingCardMobile.html");

  // ---------- burger menu ----------
  function openMenu() {
    if (!mobileMenu || !overlay || !burgerBtn) return;
    mobileMenu.classList.add("open");
    overlay.classList.add("show");
    burgerBtn.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    if (!mobileMenu || !overlay || !burgerBtn) return;
    mobileMenu.classList.remove("open");
    overlay.classList.remove("show");
    burgerBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (burgerBtn) {
    burgerBtn.addEventListener("click", () => {
      mobileMenu?.classList.contains("open") ? closeMenu() : openMenu();
    });
  }

  overlay?.addEventListener("click", closeMenu);
  closeBtn?.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  mobileMenu?.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeMenu();
  });

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
          <button data-product-id="${p.id}"
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
        <button data-product-id="${p.id}"
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
              <button data-product-id="${left.id}"
                style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
                Buy Now
              </button>
            </div>

            ${right ? `
            <div class="productResultItemIphone">
              <img src="${right.thumbnail}" style="width:104px;height:104px;" alt="${right.title}">
              <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">${right.title}</h2>
              <p style="font-size:24px;color:black;margin:0;">$${right.price}</p>
              <button data-product-id="${right.id}"
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

  // checkbox değişince filtre uygula
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

  // mevcut ürün basma fonksiyonun varsa onu çağır
  // yoksa şu anki ProductPage render kodunu tekrar çalıştırman gerekir
  renderProductPageGridDesktop(PRODUCTPAGE_VIEW);
}

// ---------- global click handlers ----------
function setupClicks() {
  // add-to-cart (Buy Now)
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
  try {
    await renderAll();
  } catch (e) {
    console.error(e);
  }
});
