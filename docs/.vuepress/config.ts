import {defineUserConfig} from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({
    base: '/blog/',
    lang: 'zh-CN',
    title: 'KindBrave',
    description: 'KindBrave 技术和生活缺一不可',
    theme: hopeTheme({
        headerDepth: 3,
    }),
    markdown: {
        headers: {
            level: [2, 3, 4]
        }
    },
    plugins: [
        searchProPlugin({
            // 索引全部内容
            indexContent: true,
        }),
    ],
})