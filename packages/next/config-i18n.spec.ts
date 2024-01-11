import {
  type Redirect,
  type Rewrite,
  getRedirects,
  getRewrites,
  normaliseUrlPathname,
  orderRoutes,
} from "./config-i18n";

// prettier-ignore
const DATA = {
  config: {
    locales: ["en", "it"],
    defaultLocale: "en",
    hideDefaultLocaleInUrl: true,
    routes: {
      "en": {
        "account": {
          "user": {
            "profile": "/account/user",
            "settings": {
              "index": "/account/user/settings",
              "security": "/account/user/settings/security"
            }
          }
        },
        "auth": {
          "signin": "/signin",
          "signup": "/signup",
        },
        "community": {
          "users": {
            "index": "/users",
            "[userName]": "/users/{{ userName }}"
          }
        },
        "content": {
          "about": "/about-us"
        },
        "www": {
          "main": "/",
          "search": "/search",
          "category": {
            "[slug]": {
              "[id]": "/l/{{ slug }}/{{ id }}"
            }
          },
          "product": {
            "[slug]": {
              "[id]": {
                "index": "/p/{{ slug }}/{{ id }}",
                "revisions": {
                  "index": "/p/{{ slug }}/{{ id }}/revisions",
                  "[revisionId]": {
                    "index": "/p/{{ slug }}/{{ id }}/revisions/{{ revisionId }}"
                  }
                }
              }
            }
          }
        },
        "apps": {
          "listr": {
            "index": "/tools/listr",
            "[spa]": "/tools/listr/{{ spa }}*",
            "orgs": {
              "index": "/orgs",
              "[id]": {
                "index": "/orgs/{{ id }}",
                "user": {
                  "index": "/orgs/{{ id }}/user",
                  "new": "/orgs/{{ id }}/user/new"
                }
              }
            }
          }
        },
      },
      "it": {
        "account": {
          "user": {
            "profile": "/profilo",
            "settings": {
              "index": "/profilo/impostazioni",
              "security": "/profilo/impostazioni/sicurezza"
            }
          }
        },
        "auth": {
          "signin": "/accedi",
          "signup": "/registrati",
        },
        "community": {
          "users": {
            "index": "/utenti",
            "[userName]": "/utenti/{{ userName }}"
          }
        },
        "content": {
          "about": "/chi-siamo"
        },
        "www": {
          "main": "/",
          "search": "/cerca",
          "category": {
            "[slug]": {
              "[id]": "/c/{{ slug }}/{{ id }}"
            }
          },
          "product": {
            "[slug]": {
              "[id]": {
                "index": "/prodotti/{{ slug }}/{{ id }}",
                "revisions": {
                  "index": "/prodotti/{{ slug }}/{{ id }}/revisioni",
                  "[revisionId]": {
                    "index": "/prodotti/{{ slug }}/{{ id }}/revisioni/{{ revisionId }}"
                  }
                }
              }
            }
          },
        },
        "apps": {
          "listr": {
            "index": "/strumenti/listr",
            "[spa]": "/strumenti/listr/{{ spa }}*",
            "orgs": {
              "index": "/orgs",
              "[id]": {
                "index": "/orgs/{{ id }}",
                "source": {
                  "index": "/orgs/{{ id }}/source",
                  "new": "/orgs/{{ id }}/source/new"
                }
              }
            }
          }
        }
      }
    }
  },
  expected: {
    rewrites: {
      en: [
        { source: '/account/user', destination: '/account/user/profile' },
        { source: '/signin', destination: '/auth/signin' },
        { source: '/signup', destination: '/auth/signup' },
        { source: '/users', destination: '/community/users' },
        { source: '/users/:userName', destination: '/community/users/:userName' },
        { source: '/about-us', destination: '/content/about' },
        { source: '/', destination: '/www/main' },
        { source: '/search', destination: '/www/search' },
        { source: '/l/:slug/:id', destination: '/www/category/:slug/:id' },
        { source: '/p/:slug/:id', destination: '/www/product/:slug/:id' },
        { source: '/p/:slug/:id/revisions', destination: '/www/product/:slug/:id/revisions' },
        { source: '/p/:slug/:id/revisions/:revisionId', destination: '/www/product/:slug/:id/revisions/:revisionId' },
        { source: "/tools/listr", destination: "/apps/listr" },
        { source: "/tools/listr/:spa*", destination: "/apps/listr/:spa*" },
      ],
      it: [
        { source: "/profilo", destination: "/account/user/profile" },
        { source: "/profilo/impostazioni", destination: "/account/user/settings" },
        { source: "/profilo/impostazioni/sicurezza", destination: "/account/user/settings/security" },
        { source: "/accedi", destination: "/auth/signin" },
        { source: "/registrati", destination: "/auth/signup" },
        { source: "/utenti", destination: "/community/users" },
        { source: "/utenti/:userName", destination: "/community/users/:userName" },
        { source: "/chi-siamo", destination: "/content/about" },
        { source: "", destination: "/www/main" },
        { source: "/cerca", destination: "/www/search" },
        { source: "/c/:slug/:id", destination: "/www/category/:slug/:id" },
        { source: "/prodotti/:slug/:id", destination: "/www/product/:slug/:id" },
        { source: "/prodotti/:slug/:id/revisioni", destination: "/www/product/:slug/:id/revisions" },
        { source: "/prodotti/:slug/:id/revisioni/:revisionId", destination: "/www/product/:slug/:id/revisions/:revisionId" },
        { source: "/strumenti/listr", destination: "/apps/listr" },
        { source: "/strumenti/listr/:spa*", destination: "/apps/listr/:spa*" },
      ]
    },
    redirects: {
      en: [
        { source: '/account/user/profile', destination: '/account/user', permanent: false, locale: false },
        { source: '/auth/signin', destination: '/signin', permanent: false, locale: false },
        { source: '/auth/signup', destination: '/signup', permanent: false, locale: false },
        { source: '/community/users', destination: '/users', permanent: false, locale: false },
        { source: '/community/users/:userName', destination: '/users/:userName', permanent: false, locale: false },
        { source: '/content/about', destination: '/about-us', permanent: false, locale: false },
        { source: '/www/main', destination: '/', permanent: false, locale: false },
        { source: '/www/search', destination: '/search', permanent: false, locale: false },
        { source: '/www/category/:slug/:id', destination: '/l/:slug/:id', permanent: false, locale: false },
        { source: '/www/product/:slug/:id', destination: '/p/:slug/:id', permanent: false, locale: false },
        { source: '/www/product/:slug/:id/revisions', destination: '/p/:slug/:id/revisions', permanent: false, locale: false },
        { source: '/www/product/:slug/:id/revisions/:revisionId', destination: '/p/:slug/:id/revisions/:revisionId', permanent: false, locale: false },
        { source: "/apps/listr", destination: "/tools/listr" },
        { source: "/apps/listr/:spa*", destination: "/tools/listr/:spa*" },
      ],
      it: [
        { source: "/it/account/user/profile", destination: "/profilo", permanent: false, locale: false },
        { source: "/it/account/user/settings", destination: "/profilo/impostazioni", permanent: false, locale: false },
        { source: "/it/account/user/settings/security", destination: "/profilo/impostazioni/sicurezza", permanent: false, locale: false },
        { source: "/it/auth/signin", destination: "/accedi", permanent: false, locale: false },
        { source: "/it/auth/signup", destination: "/registrati", permanent: false, locale: false },
        { source: "/it/community/users", destination: "/utenti", permanent: false, locale: false },
        { source: "/it/community/users/:userName", destination: "/utenti/:userName", permanent: false, locale: false },
        { source: "/it/content/about", destination: "/chi-siamo", permanent: false, locale: false },
        { source: "/it/www/main", destination: "/", permanent: false, locale: false },
        { source: "/it/www/search", destination: "/cerca", permanent: false, locale: false },
        { source: "/it/www/category/:slug/:id", destination: "/c/:slug/:id", permanent: false, locale: false },
        { source: "/it/www/product/:slug/:id", destination: "/prodotti/:slug/:id", permanent: false, locale: false },
        { source: "/it/www/product/:slug/:id/revisions", destination: "/prodotti/:slug/:id/revisioni", permanent: false, locale: false },
        { source: "/it/www/product/:slug/:id/revisions/:revisionId", destination: "/prodotti/:slug/:id/revisioni/:revisionId", permanent: false, locale: false },
        { source: "/it/apps/listr", destination: "/strumenti/listr" },
        { source: "/it/apps/listr/:spa*", destination: "/strumenti/listr/:spa*" },
      ]
    }
  },
}

// prettier-ignore
const DATA2 = {
  config: {
    debug: true,
    locales: ["nl", "en"],
    defaultLocale: "nl",
    hideDefaultLocaleInUrl: true,
    localeParam: "lng",
    routes: {
      nl: {
        "home": "/",
        "about": "/over-ons",
        "blogs": {
          "index": "/blogs",
          "[slug]": "/blogs/{{ slug }}"
        },
        "contact": "/contact",
        "faq": "/faq",
        "offices": "/kantoorruimtes",
        "tenants": {
          "index": "/huurders",
          "[slug]": "/huurders/{{ slug }}"
        }
      },
      en: {
        "home": "/",
        "about": "/about",
        "blogs": {
          "index": "/blogs",
          "[slug]": "/blogs/{{ slug }}"
        },
        "contact": "/contact",
        "faq": "/faq",
        "offices": "/office-spaces",
        "tenants": {
          "index": "/tenants",
          "[slug]": "/tenants/{{ slug }}"
        }
      },
    }
  },
  expected: {
    rewrites: {
      nl: [
        { source: '/', destination: '/nl/home' },
        { source: "/over-ons", destination: "/nl/about", },
        // { source: "/:lng/over-ons", destination: "/:lng/about", },
        { source: "/blogs", destination: "/nl/blogs", },
        { source: "/blogs/:slug", destination: "/nl/blogs/:slug", },
        { source: "/contact", destination: "/nl/contact", },
        { source: "/faq", destination: "/nl/faq", },
        { source: "/kantoorruimtes", destination: "/nl/offices", },
        // { source: "/:lng/kantoorruimtes", destination: "/:lng/offices", },
        { source: "/huurders", destination: "/nl/tenants", },
        // { source: "/:lng/huurders", destination: "/:lng/tenants", },
        { source: "/huurders/:slug", destination: "/nl/tenants/:slug", },
        // { source: "/:lng/huurders/:slug", destination: "/:lng/tenants/:slug", },
      ],
      en: [
        { source: '/:lng', destination: '/:lng/home' },
        { source: '/:lng/office-spaces', destination: '/:lng/offices' },
      ]
    },
    redirects: {
      nl: [
        { source: "/nl/home", destination: "/", permanent: false},
        { source: "/nl/about", destination: "/over-ons", permanent: false},
        // { source: "/nl/about", destination: "/nl/over-ons", permanent: false},
        { source: "/nl/blogs/:slug", destination: "/blogs/:slug", },
        { source: "/nl/offices", destination: "/kantoorruimtes", permanent: false},
        // { source: "/nl/offices", destination: "/nl/kantoorruimtes", permanent: false},
        { source: "/nl/tenants", destination: "/huurders", permanent: false},
        // { source: "/nl/tenants", destination: "/nl/huurders", permanent: false},
        { source: "/nl/tenants/:slug", destination: "/huurders/:slug", permanent: false},
        // { source: "/nl/tenants/:slug", destination: "/nl/huurders/:slug", permanent: false},
      ],
      en: [
        { source: "/en/home", destination: "/en", permanent: false},
        // { source: "/en/over-ons", destination: "/en/about", permanent: false},
        // { source: "/en/kantoorruimtes", destination: "/en/offices", permanent: false},
        { source: "/en/offices", destination: "/en/office-spaces", permanent: false},
        // { source: "/en/huurders", destination: "/en/tenants", permanent: false},
        // { source: "/en/huurders/:slug", destination: "/en/tenants/:slug", permanent: false},
      ]
    }
  }
}

function addLocale<T extends Redirect | Rewrite>(
  redirectsOrRewrites: T[],
  key: keyof T,
  locale: string,
) {
  return redirectsOrRewrites.map((r) => ({
    ...r,
    [key]: `/${normaliseUrlPathname(`${locale}/${r[key]}`)}`,
  }));
}

describe("next config (set 1)", () => {
  const { config, expected } = DATA;

  describe("with hideDefaultLocaleInUrl: true", () => {
    test("rewrites", async () => {
      const rewrites = await getRewrites(config);

      expect(rewrites).toMatchObject([
        ...expected.rewrites.en,
        ...addLocale(expected.rewrites.it, "source", "it"),
      ]);
    });

    test("redirects", async () => {
      const redirects = await getRedirects(config);

      expect(redirects).toMatchObject([
        ...expected.redirects.en,
        ...addLocale(expected.redirects.it, "destination", "it"),
      ]);
    });
  });

  describe("with hideDefaultLocaleInUrl: false", () => {
    test("rewrites", async () => {
      const rewrites = await getRewrites({
        ...config,
        hideDefaultLocaleInUrl: false,
      });

      expect(rewrites).toMatchObject([
        ...addLocale(expected.rewrites.en, "source", "en"),
        ...addLocale(expected.rewrites.it, "source", "it"),
      ]);
    });

    test("redirects", async () => {
      const redirects = await getRedirects({
        ...config,
        hideDefaultLocaleInUrl: false,
      });

      expect(redirects).toMatchObject([
        ...addLocale(expected.redirects.en, "destination", "en"),
        ...addLocale(expected.redirects.it, "destination", "it"),
      ]);
    });

    test("order routes by default locale", async () => {
      const unorderedRoutes = {
        en: { a: "en" },
        it: { a: "it" },
      };
      const orderedRoutes = await orderRoutes(unorderedRoutes, "it");

      expect(Object.keys(unorderedRoutes)[0]).toEqual("en");
      expect(Object.keys(orderedRoutes)[0]).toEqual("it");
    });
  });
});

describe("next config (set 2)", () => {
  const { config, expected } = DATA2;

  describe("with hideDefaultLocaleInUrl: true", () => {
    test("rewrites", async () => {
      const rewrites = await getRewrites(config);

      expect(rewrites).toMatchObject([
        ...expected.rewrites.nl,
        ...expected.rewrites.en,
      ]);
    });

    test("redirects", async () => {
      const redirects = await getRedirects(config);

      expect(redirects).toMatchObject([
        ...expected.redirects.nl,
        ...expected.redirects.en,
      ]);
    });
  });
});
