import { sidebar } from "vuepress-theme-hope";

export const sidebarConfig = sidebar({
    "/": [
        {
            icon: "simple-icons:openai",
            text: "LLM",
            collapsible: true,
            prefix: "llm",
            children: "structure",
        },
        {
            icon: "material-symbols:android",
            text: "Android",
            collapsible: true,
            prefix: "android",
            children: "structure",
        },
        {
            icon: "simple-icons:java",
            text: "Java",
            collapsible: true,
            prefix: "java",
            children: "structure",
        },
        {
            icon: "simple-icons:leetcode",
            text: "Leetcode",
            collapsible: true,
            prefix: "leetcode/",
            children: [
                {
                    icon: "simple-icons:leetcode",
                    text: 'Leetcode 面试经典150题计划-数组',
                    collapsible: true,
                    prefix: "leetcode_150_shuzu/",
                    children: "structure"
                },
            ],
        }
    ]
})