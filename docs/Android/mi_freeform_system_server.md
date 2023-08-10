---
lang: zh-CN
title: Mi-Freeform 3.0 技术相关
---
# Mi-Freeform 3 技术相关

米窗之前的版本一直不够稳定，且使用的VirtualDisplay会有一些问题，比如会时常跳出小窗，且部分应用无法在小窗中启动。

AOSP和部分国产ROM（如MIUI）采用的小窗方式是使用DecorCaptionView，将应用程序DecorView移至DecorCaptionView，从而实现小窗功能。该方式实现最佳，不过需要修改较多的源码，并且经过证明，修改后仍然有较多问题。

米窗3采用了与VirtualDisplayAdapter/OverlayDisplayAdapter平行的自定义适配器：MiFreeformDisplayAdapter，将该类在Android启动时注入framework，为此，开发者做了以下努力：

- 如何与该自定义适配器进行通信？

  > 在Android中，用户态程序获取系统服务的方式通常是走Binder，米窗3亦是如此。米窗3定义了一个专用系统服务MiFreeformService，该类继承自IMiFreeformService.Stub，该服务是一个Binder，我们可以通过ServiceManager#addService()方法，将其添加到系统服务列表。在此我们会发现，米窗3并不能顺利添加自定义系统服务。
  >
- 为什么不能顺利添加自定义系统服务？

  > SELinux限制。在Linux/Android下，除了基础的权限限制，系统还引入了SELinux，SELinux对每个角色可以执行什么操作进行了严格限制，为此，我们需要给米窗3所需要执行的内容编写SELinux规则。Magisk可以在sepolicy.rule中编写自定义的SELinux规则，米窗3所需要的规则如下：
  >
  > ```
  > allow untrusted_app default_android_service service_manager find
  > allow system_server default_android_service service_manager add
  > ```
  >
- 在添加完自定义服务后，为什么用户程序仍然无法发现？

  > 获取系统服务最终需要调用ServiceManager#getService()方法：
  >
  > ```java
  > public static IBinder getService(String name) {
  >     try {
  >         IBinder service = sCache.get(name);
  >         if (service != null) {
  >             return service;
  >         } else {
  >             return Binder.allowBlocking(rawGetService(name));
  >         }
  >     } catch (RemoteException e) {
  >         Log.e(TAG, "error in getService", e);
  >     }
  >     return null;
  > }
  > ```
  > 因为我们的自定义系统服务不在sCache中，所以需要走else，不过因为未知原因，这里无法通过else获取到米窗3自定义的系统服务。所以米窗3采用了将自定义系统服务添加到sCache中的做法：
  >
  > ```java
  > ServiceManager.addService("mi_freeform", this);
  > Map<String, IBinder> cache = new ArrayMap<>();
  > cache.put("mi_freeform", this);
  > ServiceManager.initServiceCache(cache);
  > ```
  >
- 如何获取到DisplayManagerService？

  > 实例化MiFreeformDisplayAdapter需要DisplayManagerService的一些字段，为此米窗3需要设法获取到DMS实例。获取DMS实例常用方式是通过Xposed hook，不过这会增加用户成本，为此，米窗3选择使用Riru/Zygisk方式进行获取。因为获取DMS后执行的操作均在Java层完成，所以米窗3选择了[ZygoteLoader](https://github.com/Kr328/ZygoteLoader)。该库额外提供了代理SystemService的功能，米窗3利用该功能，监听display系统服务的添加。
  > 不过，display系统服务是一个Binder，并不是DMS，米窗3如何通过display系统服务获取到DMS呢？这里注意到，display系统服务是下面类的实例：
  >
  > ```java
  > class DisplayManagerService extends SystemService {
  >     final class BinderService extends IDisplayManager.Stub {
  >         ...
  >     }
  > }
  >
  > ```
  > 我们可以直接通过ServiceManager获取到BinderService，不过注意到，该类是DisplayManagerService的内部类，而在日常使用时，内部类是可以直接访问外部类的变量的，这是因为内部类持有外部类的实例。我们可以通过反射的方式获取到外部类的实例(this$0表示顶层外部类引用)：
  >
  > ```java
  > // get out class field
  > Field field = service.getClass().getDeclaredField("this$0");
  > ```
  >
- 为什么通过反射获取DisplayManagerService时会抛出NoClassDefFoundError异常？

  > 当米窗3想要实例化上述字段来获取DMS实例时，发现会抛出NoClassDefFoundError异常。这是因为当前的ClassLoader中不包括/system/framework/services.jar路径，而DMS类在该jar包中。为此，我们需要使用BinderService的实例的ClassLoader来加载DMS类：
  >
  > ```java
  > // get out class field
  > Field field = service.getClass().getDeclaredField("this$0");
  > ClassLoader classLoader = service.getClass().getClassLoader();
  > assert classLoader != null;
  > //for find dms, we need service`s classloader
  > Class<?> dmsClass = classLoader.loadClass("com.android.server.display.DisplayManagerService");
  >
  > // get DisplayManagerService
  > Object displayManagerService = field.get(service);
  > ```
  > 此时，米窗3实例化了DMS，下面需要加载MiFreeformDisplayAdapter，为了让MDA与DMS可通过同一ClassLoader加载（否则仍然会抛出NoClassDefFoundError），米窗3做了以下操作：
  >
  > ```java
  > //add MiFreeformServer dex to path
  > classLoader.getClass().getMethod("addDexPath", String.class).invoke(classLoader, "/system/framework/freeform.dex");
  > Class<?> mfClass = classLoader.loadClass("com.android.server.display.MiFreeformDisplayAdapter");
  > Object mf = mfClass.getConstructors()[0].newInstance(mSyncRoot, mContext, mHandler, mDisplayDeviceRepo, mUiHandler);
  > ```
  >
- 用户程序可以通过以下方式获取到mi_freeform服务：

  > ```kotlin
  > val serviceManager = Class.forName("android.os.ServiceManager")
  > val binder = HiddenApiBypass.invoke(serviceManager, null, "getService", "mi_freeform") as IBinder
  > Log.e(TAG, "mf binder $binder")
  > val mfs = IMiFreeformService.Stub.asInterface(binder)
  > ```
  > 此处使用了[AndroidHiddenApiBypass](https://github.com/LSPosed/AndroidHiddenApiBypass)，传统的getSystemService("mi_freeform")无法获取，因为没有注册服务：
  >
  > ```java
  > //frameworks/base/core/java/android/app/SystemServiceRegistry.java
  >
  >  // add for infrare scan
  >  registerService(Context.INFRARE_SCAN_SERVICE, InfrareScanManager.class,
  >        new CachedServiceFetcher<InfrareScanManager>() {
  >             @Override
  >             public InfrareScanManager createService(ContextImpl ctx) throws ServiceNotFoundException {
  >                 IBinder b = ServiceManager.getService(Context.INFRARE_SCAN_SERVICE);
  >                 IInfrareScanManager service = IInfrareScanManager.Stub.asInterface(b);
  >                 Log.d("InfrareScanManager"," "+b+"   "+service);
  >                 return new InfrareScanManager(ctx.getOuterContext(), service);
  >             }});
  >   // add end
  > ```
  >
- HiddenApi冲突？

  > 在调用android.jar中提供，但是部分内容被隐藏的类时(如SurfaceControl)，我们很难处理，这里米窗3使用了[HiddenApiRefinePlugin](https://github.com/RikkaApps/HiddenApiRefinePlugin)来处理，将系统类起一个别名。
  >
- 在创建完DisplayDevice后，无法立即获得LogicalDisplay从而拿到displayId？

  > 调用DisplayDeviceRepository#addListener()添加监听，在添加成功后给Binder回调即可。
  >
