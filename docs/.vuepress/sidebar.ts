import { sidebar } from "vuepress-theme-hope";

export const sidebarConfig = sidebar({
    "/": [
        {
            icon: "simple-icons:openai",
            text: "LLM",
            collapsible: true,
            prefix: "LLM",
            children: "structure",
        },
        {
            icon: "solar:notebook-linear",
            text: "随笔记",
            collapsible: true,
            prefix: "notebook",
            children: "structure",
        }
    ]
})