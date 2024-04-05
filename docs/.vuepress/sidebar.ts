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
            icon: "ri:java-fill",
            text: "Java",
            collapsible: true,
            prefix: "java",
            children: "structure",
        },
        {
            icon: "mdi:spring",
            text: "Spring",
            collapsible: true,
            prefix: "spring",
            children: "structure",
        },
        {
            icon: "mdi:network",
            text: "计算机网络",
            collapsible: true,
            prefix: "network",
            children: "structure",
        },
        {
            icon: "mdi:os",
            text: "操作系统",
            collapsible: true,
            prefix: "os",
            children: "structure",
        },
        {
            icon: "simple-icons:mysql",
            text: "MySQL",
            collapsible: true,
            prefix: "mysql",
            children: "structure",
        },
        {
            icon: "simple-icons:redis",
            text: "Redis",
            collapsible: true,
            prefix: "redis",
            children: "structure",
        },
        // {
        //     icon: "simple-icons:leetcode",
        //     text: "Leetcode",
        //     collapsible: true,
        //     prefix: "leetcode/",
        //     children: [
        //         {
        //             icon: "simple-icons:leetcode",
        //             text: 'Leetcode 面试经典150题计划-数组',
        //             collapsible: true,
        //             prefix: "leetcode_150_shuzu/",
        //             children: "structure"
        //         },
        //     ],
        // }
    ]
})