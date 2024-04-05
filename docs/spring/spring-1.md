---
title: 2、SpringMVC中的适配器模式
---
一般叫...Adapter的就是适配器了。SpringMVC中常用的适配器就是HandlerAdapter。

## 一个请求的执行过程...

我们在使用SpringMVC时候，一个请求过程是怎样的？

- 请求
- DispatcherServlet
- 去HandlerMapping中找到Handler
- 通过Handler找到HandlerAdapter
- 通过HandlerAdapter来调用Handler，就是执行Controller的方法

我们使用的@RequestMapping，就是一个Handler
