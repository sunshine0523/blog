---
title: 3、Bean如何注入容器，自动装配相关
---
## 1.Bean如何注入容器

假设我们现在有以下类：

```java
package org.example.springdemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

/**
 * @author KindBrave
 * @since 2024/4/2
 */
@Component
public class Person {

    @Autowired
    private Apple appleImpl;

    private int id;

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    @Override
    public String toString() {
        return appleImpl.toString();
    }
}

```

```java
package org.example.springdemo;

import org.springframework.stereotype.Component;

/**
 * @author KindBrave
 * @since 2024/4/2
 */
@Component
public class Apple {
}

```

```java
package org.example.springdemo;

import org.springframework.stereotype.Component;

/**
 * @author KindBrave
 * @since 2024/4/2
 */
@Component
public class AppleImpl extends Apple{
}

```

### 1.1 使用@Configuration和@Bean

```java
@Configuration
public class MConfig {
    @Bean
    public Person person() {
        return new Person();
    }

    @Bean
    public Apple apple() {
        return new Apple();
    }

    @Bean
    public AppleImpl appleImpl() {
        return new AppleImpl();
    }
}
```

测试：

```java
@Test
public void test() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MConfig.class);
    Object o = context.getBean("person");
    System.out.println(o);	//org.example.springdemo.AppleImpl@66f659e6
}
```

### 1.2 使用@ComponentScan

```java
package org.example.springdemo;

import org.springframework.context.annotation.ComponentScan;

/**
 * @author KindBrave
 * @since 2024/4/2
 */

@ComponentScan
public class Main {

}

```

测试：

```
@Test
public void test() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MConfig.class);
    Object o = context.getBean("person");
    System.out.println(o);	//org.example.springdemo.AppleImpl@12958360
}
```

### 1.3使用@Import/使用FactoryBean等


### @Bean和@Component区别？

- @Bean用在方法上，@Component用在类上
- @Bean更灵活

## 2.自动装配

自动装配就是我们在A中使用到了B，Spring会自动给B赋予引用对象，而不需要我们手动创建。

自动装配的注解包括@Autowired @Resource @Inject @Value

@Autowired支持对属性、函数的参数、方法进行装配，而@Resource只支持属性

@Value是对基本变量进行赋值的，它会从配置文件中读取制定值来进行赋值

@Autowired会和@Qualifier配合
