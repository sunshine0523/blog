import { defineClientConfig } from "@vuepress/client";
import { hasGlobalComponent } from "D:/code/web/blog/node_modules/vuepress-shared/lib/client/index.js";
import { h } from "vue";

import { useScriptTag } from "D:/code/web/blog/node_modules/@vueuse/core/index.mjs";
import Badge from "D:/code/web/blog/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import FontIcon from "D:/code/web/blog/node_modules/vuepress-plugin-components/lib/client/components/FontIcon.js";
import BackToTop from "D:/code/web/blog/node_modules/vuepress-plugin-components/lib/client/components/BackToTop.js";

import "D:/code/web/blog/node_modules/vuepress-plugin-components/lib/client/styles/sr-only.scss";

export default defineClientConfig({
  enhance: ({ app }) => {
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    if(!hasGlobalComponent("FontIcon")) app.component("FontIcon", FontIcon);
    
  },
  setup: () => {
    useScriptTag(
  `https://cdn.jsdelivr.net/npm/iconify-icon@1`
);
  },
  rootComponents: [
    () => h(BackToTop, {}),
  ],
});
