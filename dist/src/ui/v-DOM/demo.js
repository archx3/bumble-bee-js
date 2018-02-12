"use strict";

/** @jsx createEl */

var f = createEl(
   "ul",
   { style: "list-style: none;" },
   createEl(
      "li",
      { className: "item" },
      "item 1"
   ),
   createEl(
      "li",
      { className: "item" },
      createEl("input", { type: "checkbox", checked: true }),
      createEl("input", { type: "text", disabled: false })
   )
);

var $root = document.getElementById('root');
$root.appendChild(createElement(f));
//# sourceMappingURL=demo.js.map