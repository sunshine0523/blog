---
title: 14、线程相关
---
## 1.线程常见的调度方法

- 等待：wait
- 让出：yield
- 中断：interrupt
- 通知：notify notifyAll
- 休眠：sleep

## 2.为什么要使用interrupt而不是stop

## 3.sleep和wait的区别

- sleep是Thread的方法，wait是Object的方法
- sleep暂停线程时，不会让出共享资源；wait会
- sleep在任何时候都可以调用，wait只有在获得了锁之后才可以调用
- sleep在休眠时间到了之后会自动恢复，wait可以设置在等待时间结束后自动恢复，也可以通过其他线程对锁的notify来恢复

## 4.线程的状态有几种

- 创建：线程刚刚创建，还没有执行
- 执行：线程正常工作
- 阻塞：线程被锁阻塞着
- 等待：线程调用了wait方法，需要等待其他线程调用notify或者interrupt
- 超时等待：过了超时时间自动恢复
- 中止：线程执行完毕

## 5.守护线程
