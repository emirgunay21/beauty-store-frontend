document.addEventListener("DOMContentLoaded", async () => {
  const productsGrid = document.getElementById("productsGrid");
  const discountGrid = document.getElementById("discountGrid");
  const bannerBottomGrid = document.getElementById("bannerBottomGrid");
  const categoriesGrid = document.getElementById("CategoriesGrid");
  const bigBannerWrapperGrid = document.getElementById("bigBannerWrapperGrid");

  
  if (productsGrid) {
    const res = await fetch("https://dummyjson.com/products?limit=8");
    const data = await res.json();

    productsGrid.innerHTML = data.products.map(p => `
      <div class="productItems">
        <div class="productItemİphone14Pro">
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
if (discountGrid) {
    const res2 = await fetch("https://dummyjson.com/products?limit=4&skip=8");
    const data2 = await res2.json();
    discountGrid.innerHTML = data2.products.map(p => `
      <div class="DiscountİtemTopİphoneGold">
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
if (bannerBottomGrid) {
  fetch("https://dummyjson.com/products/category/beauty?limit=4")
    .then(res => res.json())
    .then(data => {
      bannerBottomGrid.innerHTML = `
        <div class="bannerBottomAirPodsMax">
          <img src="${data.products[0].thumbnail}" style="width:192px;height:200px;margin-top:40px">
          <h2 style="font-size:36px;margin:24px;color:black">
            ${data.products[0].title}
          </h2>
          <p style="font-size:19px;color:gray">
            ${data.products[0].description}
          </p>
        </div>

        <div class="bannerAppleVisionPro">
          <img src="${data.products[1].thumbnail}" style="width:325px;height:192px;margin-top:40px">
          <h2 style="font-size:36px;margin:24px;color:white">
            ${data.products[1].title}
          </h2>
          <p style="font-size:19px;color:gray">
            ${data.products[1].description}
          </p>
        </div>

        <div class="bannerPlaystation5">
          <img src="${data.products[2].thumbnail}" style="width:200px;height:200px">
          <h2 style="font-size:36px;margin:24px;color:black">
            ${data.products[2].title}
          </h2>
          <p style="font-size:19px;color:gray">
            ${data.products[2].description}
          </p>
        </div>

        <div class="MacbookAir">
          <img src="${data.products[3].thumbnail}" style="width:330px;height:200px;margin-top:40px">
          <h2 style="font-size:36px;margin:24px;color:black">
            ${data.products[3].title}
          </h2>
          <p style="font-size:19px;color:gray">
            ${data.products[3].description}
          </p>
          <button style="width:343px;height:56px;border:2px solid black">
            Shop Now
          </button>
        </div>
      `;
    });
}
if (categoriesGrid) {
  const res3 = await fetch("https://dummyjson.com/products/categories");
  const data3 = await res3.json();

  const normalize = (c) => {
    if (typeof c === "string") return { slug: c, name: c };
    return { slug: c.slug || c.name || "", name: c.name || c.slug || "" };
  };

  const all = data3.map(normalize);

  const wantedSlugs = [
    "beauty",
    "fragrances",
    "skin-care",
    "sunglasses",
    "womens-bags",
    "womens-jewellery"
  ];

  // ✅ ikon = o kategoriden 1 ürün thumbnail’ı (dışardan)
  async function getCategoryIcon(slug) {
    try {
      const r = await fetch(`https://dummyjson.com/products/category/${slug}?limit=1`);
      const d = await r.json();
      return d.products?.[0]?.thumbnail || "phoneicon.png";
    } catch {
      return "phoneicon.png";
    }
  }

  const list = wantedSlugs.map(slug => {
    const found = all.find(c => c.slug === slug);
    return found || { slug, name: slug };
  });

  categoriesGrid.innerHTML = "";

  for (let i = 0; i < list.length; i += 2) {
    const left = list[i];
    const right = list[i + 1];

    const leftIcon = await getCategoryIcon(left.slug);
    const rightIcon = await getCategoryIcon(right.slug);

    categoriesGrid.innerHTML += `
      <div class="CategoryItem">
        <div class="CategoryItemTop">
          <img src="${leftIcon}" style="width:48px;height:48px;" alt="${left.name}">
          <h1 style="font-size:16px;margin:0;color:black">
            ${String(left.name).split("-").join(" ")}
          </h1>
        </div>

        <div class="CategoryItemTop">
          <img src="${rightIcon}" style="width:48px;height:48px;" alt="${right.name}">
          <h1 style="font-size:16px;margin:0;color:black">
            ${String(right.name).split("-").join(" ")}
          </h1>
        </div>
      </div>
    `;
  }
}
if (bigBannerWrapperGrid) {
  // İstersen statik bannerları gizle (HTML silmeden)
  const wrapper = document.querySelector(".bigBannerWrapper");
  if (wrapper) {
    wrapper.querySelectorAll(".bigBanner").forEach(b => b.style.display = "none");
  }

  try {
    
    const res = await fetch("https://dummyjson.com/products/category/beauty?limit=4");
    const data = await res.json();
    const p = data.products || [];

    
    while (p.length < 4) p.push({ title: "Product", description: "", thumbnail: "" });

    bigBannerWrapperGrid.innerHTML = `
  <!-- MOBILE: sadece 1 tane -->
  <div class="bigBanner bigBanner-mobile-visible">
    <div class="Halfimage">
      <img src="${p[0].thumbnail}" style="width:360px; height:366px;" alt="${p[0].title}">
    </div>
    <div class="bigBannerText">
      <p style="font-size:49px;margin:0;color:black">${p[0].title}</p>
      <p1 style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[0].description}</p1>
      <button style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">Shop Now</button>
    </div>
  </div>

  <!-- DESKTOP: 4 tane -->
  <div class="bigBanner bigBanner-desktop-only">
    <div class="Halfimage">
      <img src="${p[0].thumbnail}" style="width:360px; height:327px;" alt="${p[0].title}">
    </div>
    <div class="bigBannerText">
      <p style="font-size:49px;margin:0;color:black">${p[0].title}</p>
      <p1 style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[0].description}</p1>
      <button style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">Shop Now</button>
    </div>
  </div>

  <div class="bigBanner bigBanner-desktop-only">
    <div class="Halfimage">
      <img src="${p[1].thumbnail}" style="width:360px; height:360px;" alt="${p[1].title}">
    </div>
    <div class="bigBannerText">
      <p style="font-size:49px;margin:0;color:black">${p[1].title}</p>
      <p1 style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[1].description}</p1>
      <button style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">Shop Now</button>
    </div>
  </div>

  <div class="bigBanner bigBanner-desktop-only">
    <div class="Halfimage">
      <img src="${p[2].thumbnail}" style="width:360px; height:360px;" alt="${p[2].title}">
    </div>
    <div class="bigBannerText">
      <p style="font-size:49px;margin:0;color:black">${p[2].title}</p>
      <p1 style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[2].description}</p1>
      <button style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">Shop Now</button>
    </div>
  </div>

  <div class="bigBanner bigBanner-desktop-only bigBanner-dark">
    <div class="Halfimage">
      <img src="${p[3].thumbnail}" style="width:340px; height:356px;" alt="${p[3].title}">
    </div>
    <div class="bigBannerText">
      <p style="font-size:49px;margin:0;color:white">${p[3].title}</p>
      <p1 style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[3].description}</p1>
      <button style="width:184px;height:56px;background:#2C2C2C;border:2px solid white;color:white;border-radius:8px;">Shop Now</button>
    </div>
  </div>
`;
  } catch (err) {
    console.error("bigBanner fetch error:", err);
  }
}



  document.body.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-product-id]");
    if (!button) return;

    const productId = button.dataset.productId;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(i => i.id === productId);

    if (existing) existing.qty += 1;
    else cart.push({ id: productId, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("✅ Sepet güncel:", cart);
  });
});
