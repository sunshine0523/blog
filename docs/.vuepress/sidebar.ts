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
            icon: "material-symbols:android",
            text: "Android",
            collapsible: true,
            prefix: "Android",
            children: "structure",
        },
        {
            icon: "solar:notebook-linear",
            text: "随笔记",
            collapsible: true,
            prefix: "notebook/",
            children: [
                {
                    text: '阳阳笔记',
                    collapsible: true,
                    prefix: "yangyang/",
                    children: "structure"
                },
            ],
        }
    ]
})