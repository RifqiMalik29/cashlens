const {
  withDangerousMod,
  withAndroidManifest,
  withAppBuildGradle,
  withMainApplication
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const NOTIFICATION_MODULE = `package com.cashlens.app.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.provider.Settings
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import com.cashlens.app.services.TransactionNotificationListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class NotificationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), LifecycleEventListener {

    private val TAG = "NotificationModule"
    private var listenerCount = 0

    private val transactionReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val params = Arguments.createMap().apply {
                putString("packageName", intent.getStringExtra(TransactionNotificationListener.EXTRA_PACKAGE) ?: "")
                putString("title", intent.getStringExtra(TransactionNotificationListener.EXTRA_TITLE) ?: "")
                putString("text", intent.getStringExtra(TransactionNotificationListener.EXTRA_TEXT) ?: "")
                putString("subText", intent.getStringExtra(TransactionNotificationListener.EXTRA_SUB_TEXT) ?: "")
                putDouble("postTime", intent.getLongExtra(TransactionNotificationListener.EXTRA_POST_TIME, 0L).toDouble())
            }

            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onNotificationReceived", params)

            Log.d(TAG, "Event emitted to React Native successfully")
        }
    }

    init {
        reactContext.addLifecycleEventListener(this)
    }

    override fun getName(): String = "NotificationModule"

    @ReactMethod
    fun isPermissionGranted(promise: Promise) {
        val contentResolver = reactApplicationContext.contentResolver
        val enabledListeners = Settings.Secure.getString(contentResolver, "enabled_notification_listeners")
        val packageName = reactApplicationContext.packageName
        promise.resolve(enabledListeners != null && enabledListeners.contains(packageName))
    }

    @ReactMethod
    fun openNotificationSettings() {
        val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun sendTestNotification(title: String, text: String, packageName: String) {
        Log.d(TAG, "Sending test notification: ${"$"}title - ${"$"}text")

        val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "cashlens_test_channel"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Test Notifications", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }

        val builder = NotificationCompat.Builder(reactApplicationContext, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(text)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setAutoCancel(true)

        notificationManager.notify(1, builder.build())
    }

    @ReactMethod
    fun addListener(eventName: String) {
        if (listenerCount == 0) {
            LocalBroadcastManager.getInstance(reactApplicationContext)
                .registerReceiver(transactionReceiver, IntentFilter(TransactionNotificationListener.ACTION_TRANSACTION))
            Log.d(TAG, "BroadcastReceiver registered")
        }
        listenerCount++
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        listenerCount -= count
        if (listenerCount <= 0) {
            listenerCount = 0
            try {
                LocalBroadcastManager.getInstance(reactApplicationContext)
                    .unregisterReceiver(transactionReceiver)
                Log.d(TAG, "BroadcastReceiver unregistered")
            } catch (e: Exception) {
                Log.w(TAG, "Receiver already unregistered")
            }
        }
    }

    override fun onHostResume() {}
    override fun onHostPause() {}
    override fun onHostDestroy() {
        try {
            LocalBroadcastManager.getInstance(reactApplicationContext)
                .unregisterReceiver(transactionReceiver)
        } catch (e: Exception) {}
    }
}
`;

const NOTIFICATION_PACKAGE = `package com.cashlens.app.notification

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class NotificationPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(NotificationModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
`;

const TRANSACTION_NOTIFICATION_LISTENER = `package com.cashlens.app.services

import android.content.Intent
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import androidx.localbroadcastmanager.content.LocalBroadcastManager

class TransactionNotificationListener : NotificationListenerService() {

    private val TAG = "NotificationListener"

    companion object {
        const val ACTION_TRANSACTION = "com.cashlens.app.TRANSACTION_NOTIFICATION"
        const val EXTRA_PACKAGE = "packageName"
        const val EXTRA_TITLE = "title"
        const val EXTRA_TEXT = "text"
        const val EXTRA_SUB_TEXT = "subText"
        const val EXTRA_POST_TIME = "postTime"
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val packageName = sbn.packageName
        val extras = sbn.notification.extras
        val title = extras.getString("android.title") ?: ""
        val text = extras.getCharSequence("android.text")?.toString() ?: ""
        val subText = extras.getCharSequence("android.subText")?.toString() ?: ""

        val transactionKeywords = arrayOf("Rp", "IDR", "Transfer", "Bayar", "Berhasil", "Top Up", "Debit", "Kredit", "Uang", "Pembayaran", "Sebesar")
        val isLikelyTransaction = transactionKeywords.any {
            text.contains(it, ignoreCase = true) || title.contains(it, ignoreCase = true)
        }

        if (isLikelyTransaction) {
            Log.d(TAG, "Transaction Detected from ${"$"}packageName: ${"$"}text")

            val intent = Intent(ACTION_TRANSACTION).apply {
                putExtra(EXTRA_PACKAGE, packageName)
                putExtra(EXTRA_TITLE, title)
                putExtra(EXTRA_TEXT, text)
                putExtra(EXTRA_SUB_TEXT, subText)
                putExtra(EXTRA_POST_TIME, sbn.postTime)
            }

            LocalBroadcastManager.getInstance(applicationContext).sendBroadcast(intent)
        }
    }
}
`;

// Step 1: Write kotlin files + restore sentry.properties
const withKotlinFiles = (config) => {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const base = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/java/com/cashlens/app"
      );
      fs.mkdirSync(path.join(base, "notification"), { recursive: true });
      fs.mkdirSync(path.join(base, "services"), { recursive: true });
      fs.writeFileSync(path.join(base, "notification/NotificationModule.kt"), NOTIFICATION_MODULE);
      fs.writeFileSync(path.join(base, "notification/NotificationPackage.kt"), NOTIFICATION_PACKAGE);
      fs.writeFileSync(path.join(base, "services/TransactionNotificationListener.kt"), TRANSACTION_NOTIFICATION_LISTENER);

      const sentryProps = path.join(config.modRequest.platformProjectRoot, "sentry.properties");
      fs.writeFileSync(sentryProps, "defaults.url=https://sentry.io/\ndefaults.org=maliks-og\ndefaults.project=cashlens\n");

      return config;
    },
  ]);
};

// Step 2: Add NotificationListenerService to AndroidManifest
const withNotificationManifest = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application[0];

    if (!application.service) {
      application.service = [];
    }

    const serviceExists = application.service.some(
      (s) => s.$?.["android:name"] === ".services.TransactionNotificationListener"
    );

    if (!serviceExists) {
      application.service.push({
        $: {
          "android:name": ".services.TransactionNotificationListener",
          "android:label": "CashLens Notification Listener",
          "android:permission": "android.permission.BIND_NOTIFICATION_LISTENER_SERVICE",
          "android:exported": "true",
        },
        "intent-filter": [
          {
            action: [
              { $: { "android:name": "android.service.notification.NotificationListenerService" } },
            ],
          },
        ],
      });
    }

    return config;
  });
};

// Step 3: Register NotificationPackage in MainApplication.kt
const withNotificationMainApplication = (config) => {
  return withMainApplication(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes("import com.cashlens.app.notification.NotificationPackage")) {
      contents = contents.replace(
        "import expo.modules.ApplicationLifecycleDispatcher",
        "import com.cashlens.app.notification.NotificationPackage\nimport expo.modules.ApplicationLifecycleDispatcher"
      );
    }

    if (!contents.includes("add(NotificationPackage())")) {
      contents = contents.replace(
        "PackageList(this).packages.apply {",
        "PackageList(this).packages.apply {\n              add(NotificationPackage())"
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};

// Step 4: Add signing config and bundle splits to build.gradle
const withReleaseBuildConfig = (config) => {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    // Add release signing config if missing
    if (!contents.includes("CASHLENS_UPLOAD_STORE_FILE")) {
      contents = contents.replace(
        /signingConfigs \{(\s*debug \{[^}]+\})\s*\}/,
        `signingConfigs {$1
        release {
            storeFile file(CASHLENS_UPLOAD_STORE_FILE)
            storePassword CASHLENS_UPLOAD_STORE_PASSWORD
            keyAlias CASHLENS_UPLOAD_KEY_ALIAS
            keyPassword CASHLENS_UPLOAD_KEY_PASSWORD
        }
    }`
      );

      contents = contents.replace(
        "signingConfig signingConfigs.debug\n            def enableShrinkResources",
        "signingConfig signingConfigs.release\n            def enableShrinkResources"
      );
    }

    // Add bundle splits if missing
    if (!contents.includes("bundle {")) {
      contents = contents.replace(
        /(    androidResources \{[^}]+\})\s*\n\}/,
        `$1\n    bundle {\n        language {\n            enableSplit = true\n        }\n        density {\n            enableSplit = true\n        }\n        abi {\n            enableSplit = true\n        }\n    }\n}`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};

const withNotificationListener = (config) => {
  config = withKotlinFiles(config);
  config = withNotificationManifest(config);
  config = withNotificationMainApplication(config);
  config = withReleaseBuildConfig(config);
  return config;
};

module.exports = withNotificationListener;
