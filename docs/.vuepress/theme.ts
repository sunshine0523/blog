import { hopeTheme } from "vuepress-theme-hope";
import {sidebarConfig} from "./sidebar"

export default hopeTheme({
    author: {
        name: "KindBrave",
        url: "https://github.com/sunshine0523",
    },
    headerDepth: 3,
    repo: "sunshine0523/blog",
    editLinkPattern: ":repo/edit/main/docs/:path",
    sidebar: sidebarConfig,
    //使用的图标网站
    iconAssets: "iconify",
    plugins: {
        //md功能增强
        mdEnhance: {
            // 使用 KaTeX 启用 TeX 支持
            katex: true,
        }
    }
})