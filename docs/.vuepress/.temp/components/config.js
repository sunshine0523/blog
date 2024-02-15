import { defineClientConfig } from "@vuepress/client";
import { hasGlobalComponent } from "/media/kindbrave/Data/code/web/blog/node_modules/vuepress-shared/lib/client/index.js";
import { h } from "vue";

import { useScriptTag } from "/media/kindbrave/Data/code/web/blog/node_modules/@vueuse/core/index.mjs";
import Badge from "/media/kindbrave/Data/code/web/blog/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import FontIcon from "/media/kindbrave/Data/code/web/blog/node_modules/vuepress-plugin-components/lib/client/components/FontIcon.js";
import BackToTop from "/media/kindbrave/Data/code/web/blog/node_modules/vuepress-plugin-components/lib/client/components/BackToTop.js";

import "/media/kindbrave/Data/code/web/blog/node_modules/vuepress-plugin-components/lib/client/styles/sr-only.scss";

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
