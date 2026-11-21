// --- ВСЁ ДЛЯ ШАПКИ ---
document.addEventListener("DOMContentLoaded", () => {
  const hamb = document.querySelector("#hamb");
  const popup = document.querySelector("#popup");
  const menu = document.querySelector("#menu");
  const body = document.body;
  // Исправлено: теперь ищем блоки .section__name с атрибутом id
  const sections = document.querySelectorAll(".section__name[id]");

  // --- 1. БУРГЕР-МЕНЮ ---
  if (menu && popup) {
    const clonedMenu = menu.cloneNode(true);
    clonedMenu.removeAttribute("id");
    popup.appendChild(clonedMenu);
  }

  const closeBurger = () => {
    if (popup) popup.classList.remove("open");
    if (hamb) hamb.classList.remove("active");
    body.classList.remove("noscroll");
  };

  if (hamb && popup) {
    hamb.addEventListener("click", (event) => {
      event.preventDefault();
      popup.classList.toggle("open");
      hamb.classList.toggle("active");
      body.classList.toggle("noscroll");
    });
  }

  // --- 2. ПЛАВНАЯ ПРОКРУТКА ПО ЯКОРЯМ И ЛОГОТИПУ ---
  document.addEventListener("click", (event) => {
    const logo = event.target.closest("#logo");
    if (logo) {
      event.preventDefault();
      closeBurger();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    const targetElement = document.querySelector(href);
    if (targetElement) {
      event.preventDefault();
      closeBurger();

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  // --- 3. ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ---
  const setActiveLink = (id) => {
    const allNavLinks = document.querySelectorAll(".header__name-link");
    allNavLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.getAttribute("id"));
        }
      });
    },
    {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    },
  );

  sections.forEach((section) => observer.observe(section));

  window.addEventListener(
    "scroll",
    () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

      if (isAtBottom && sections.length > 0) {
        const lastSectionId = sections[sections.length - 1].getAttribute("id");
        setActiveLink(lastSectionId);
      }
    },
    { passive: true },
  );
});

// --- ВСЁ ДЛЯ ВСЕГО САЙТА ---
// --- АККЩЗДИОН ---
// Аккордион открытие, закрытие, переход.
const accordion = document.querySelector(".accordion");

if (accordion) {
  const items = accordion.querySelectorAll(".accordion__item");

  accordion.addEventListener("click", (event) => {
    // Проверяем, что клик был именно по заголовку (или внутри него)
    const header = event.target.closest(".accordion__header");
    if (!header) return;

    const currentItem = header.closest(".accordion__item");
    const isOpen = currentItem.classList.contains("is-open");

    // Закрываем все элементы
    items.forEach((item) => item.classList.remove("is-open"));

    // Открываем текущий, если он был закрыт
    if (!isOpen) {
      currentItem.classList.add("is-open");
    }
  });
}
// --- ФОРМА ОБРАТНОЙ СВЯЗИ И МОДАЛЬНОЕ ОКНО СОГЛАСИЕ НА ОБРАБОТКУ ---
// Форма обратной связи
const web3Form = document.getElementById("web3form");
const web3Status = document.getElementById("web3form-status");

if (web3Form) {
  const submitBtn = web3Form.querySelector(".feedback__btn");

  web3Form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Блокируем кнопку и сбрасываем прошлые статусы
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";
    web3Status.textContent = "";
    web3Status.className = "feedback__status";

    const formData = new FormData(web3Form);

    try {
      const response = await fetch("https://web3forms.com", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        web3Status.textContent = "Спасибо! Ваше сообщение успешно отправлено.";
        web3Status.classList.add("is-success");
        web3Form.reset();
      } else {
        web3Status.textContent = "Ошибка при отправке. Проверьте настройки ключа.";
        web3Status.classList.add("is-error");
      }
    } catch (error) {
      web3Status.textContent = "Ошибка сети. Проверьте подключение к интернету.";
      web3Status.classList.add("is-error");
    } finally {
      // Возвращаем кнопку в рабочее состояние
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить сообщение";
    }
  });
}

// МОДАЛЬНОЕ ОКНО ПОЛИТИКИ КОНФИДЕНЦИАЛЬНОСТИ 
const privacyModal = document.getElementById("privacy-modal");
const openModalBtn = document.getElementById("open-privacy-modal");
const closeModalBtn = document.getElementById("close-privacy-modal");
const acceptPrivacyBtn = document.getElementById("accept-privacy-btn");
const privacyCheckbox = document.querySelector('input[name="privacy_policy"]');

if (privacyModal && openModalBtn) {
  // Открытие окна
  openModalBtn.addEventListener("click", () => {
    privacyModal.showModal();
  });

  // Закрытие по крестику
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      privacyModal.close();
    });
  }

  // Кнопка "Принять условия" — ставит галочку и закрывает окно
  if (acceptPrivacyBtn) {
    acceptPrivacyBtn.addEventListener("click", () => {
      if (privacyCheckbox) {
        privacyCheckbox.checked = true;
      }
      privacyModal.close();
    });
  }

  // Закрытие при клике по тёмному фону за пределами окна
  privacyModal.addEventListener("click", (e) => {
    if (e.target === privacyModal) {
      privacyModal.close();
    }
  });
}// --- КНОПКА «НАВЕРХ» ---
const scrollTopBtn = document.querySelector("#scrollTop");

if (scrollTopBtn) {
  // Показываем кнопку, если прокрутили вниз больше чем на 300px
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    },
    { passive: true },
  );

  // Плавная прокрутка в начало страницы при клике
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}


