import { vitestSetNodeEnv } from "@knitkode/test/vitest";
import { render } from "./render";

const data = {
  name: "My name",
  img: {
    "291x512": {
      src: "https://example.com",
    },
  },
  list: [1, 2].map((n) => ({
    img: {
      dot: `${n} dot value`,
      dotNest: {
        nested: `${n} dot nested value`,
      },
      [`1-bracket`]: `${n} bracket value`,
      [`b-bracket-nested`]: {
        nested: `${n} bracket nested value`,
      },
    },
  })),
};

function normalizeWhitespaces(output: string) {
  return output.replace(/\n/gm, "").replace(/\s\s/gm, " ");
}

test("render simple interpolation", () => {
  const tpl = `Hello <%= data.name %>`;
  const renderer = render(tpl);

  expect(renderer(data)).toEqual(`Hello My name`);
});

test("render interpolation with bracket notation", () => {
  const tpl = `Hello <%= data['name'] %>`;
  const renderer = render(tpl);

  expect(renderer(data)).toEqual(`Hello My name`);
});

test("render interpolation with bracket notation and deeply nested object", () => {
  const tpl = `Hello <img src="<%= data.img['291x512'].src %>">`;
  const renderer = render(tpl);

  expect(renderer(data)).toEqual(`Hello <img src="https://example.com">`);
});

test("render array interpolation with bracket notation and deeply nested object within list", () => {
  const tpl = `
<%~ data.list :item %>
item:
  <%= item.img.dot %>
  <%= item.img.dotNest.nested %>
  <%= item.img['1-bracket'] %>
  <%= item.img['b-bracket-nested'].nested %>
<%~ %>
`;
  const renderer = render(tpl);

  expect(renderer(data)).toEqual(
    normalizeWhitespaces(`
item:
  1 dot value
  1 dot nested value
  1 bracket value
  1 bracket nested value
item:
  2 dot value
  2 dot nested value
  2 bracket value
  2 bracket nested value
`),
  );
});

test("render evaluation blocks", () => {
  const renderer = render(
    `<% if (data.show) { %>shown<% } else { %>hidden<% } %>`,
  );

  expect(renderer({ show: true })).toEqual("shown");
  expect(renderer({ show: false })).toEqual("hidden");
});

test("render conditionals", () => {
  const renderer = render(`<%? data.ok %>yes<%?? %>no<%? %>`);

  expect(renderer({ ok: true })).toEqual("yes");
  expect(renderer({ ok: false })).toEqual("no");
});

test("render conditionals with else if", () => {
  const renderer = render(
    `<%? data.n === 1 %>one<%?? data.n === 2 %>two<%?? %>many<%? %>`,
  );

  expect(renderer({ n: 1 })).toEqual("one");
  expect(renderer({ n: 2 })).toEqual("two");
  expect(renderer({ n: 3 })).toEqual("many");
});

test("render array iteration with a custom index name", () => {
  const renderer = render(
    `<%~ data.list :item:idx %>[<%= idx %>:<%= item %>]<%~ %>`,
  );

  expect(renderer({ list: ["a", "b"] })).toEqual("[0:a][1:b]");
  expect(renderer({ list: [] })).toEqual("");
});

test("render array iteration over a missing array", () => {
  const renderer = render(`before<%~ data.missing :item %>x<%~ %>after`);

  expect(renderer({})).toEqual("beforeafter");
});

test("render nested array iterations", () => {
  const renderer = render(
    `<%~ data.rows :row %><%~ row :cell %><%= cell %><%~ %>;<%~ %>`,
  );

  expect(
    renderer({
      rows: [
        [1, 2],
        [3, 4],
      ],
    }),
  ).toEqual("12;34;");
});

test("render quotes and backslashes literally", () => {
  const renderer = render(`It's a "quote" and a \\ backslash <%= data.v %>`);

  expect(renderer({ v: "!" })).toEqual(`It's a "quote" and a \\ backslash !`);
});

test("render collapses the template newlines and indentation", () => {
  const renderer = render(`<p>
    <%= data.v %>
  </p>`);

  expect(renderer({ v: "x" })).toEqual("<p> x </p>");
});

test("render compile-time defines with ':'", () => {
  const renderer = render(
    `<%##def.greeting:Hello#%><%#def.greeting%> <%= data.name %>`,
  );

  expect(renderer(data)).toEqual("Hello My name");
});

test("render compile-time defines with '='", () => {
  const renderer = render(`<%## year = 2024 #%>Year <%#def.year%>`);

  expect(renderer({})).toEqual("Year 2024");
});

test("render compile-time defines with parameters", () => {
  const renderer = render(
    `<%##def.bold:text:<b><%= text %></b>#%><%#def.bold:data.name%>`,
  );

  expect(renderer(data)).toEqual("<b>My name</b>");
});

test("render keeps the first compile-time define of a name", () => {
  const renderer = render(`<%##def.a:first#%><%##def.a:second#%><%#def.a%>`);

  expect(renderer({})).toEqual("first");
});

test("render the same parametrised define multiple times", () => {
  const renderer = render(
    `<%##def.em:t:<em><%= t %></em>#%><%#def.em:data.a%>|<%#def.em:data.b%>`,
  );

  expect(renderer({ a: "A", b: "B" })).toEqual("<em>A</em>|<em>B</em>");
});

describe("render invalid templates", () => {
  describe("outside development", () => {
    vitestSetNodeEnv("production");

    test("returns a renderer of an empty string", () => {
      const renderer = render(`<%= data.name ( %>`);

      expect(renderer(data)).toEqual("");
    });
  });

  describe("in development", () => {
    vitestSetNodeEnv("development");

    test("logs and throws", () => {
      const log = vi.spyOn(console, "log").mockImplementation(() => {});

      expect(() => render(`<%= data.name ( %>`)).toThrow(SyntaxError);
      expect(log).toHaveBeenCalledWith(
        expect.stringContaining("Could not create a template function: "),
      );
      log.mockRestore();
    });
  });
});

// test("render interpolation with encoding", () => {
//   const tpl = `Hello <%! data['name'] %>`;
//   const renderer = render(tpl);

//   expect(renderer(data)).toEqual(
//     `Hello My name`
//   );
// });

// * <% %>	for evaluation
// * <%= %>	for interpolation
// * <%! %>	for interpolation with encoding
// * <%# %>	for compile-time evaluation/includes and partials
// * <%## #%>	for compile-time defines
// * <%? %>	for conditionals
// * <%~ %>	for array iteration
