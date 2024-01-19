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
