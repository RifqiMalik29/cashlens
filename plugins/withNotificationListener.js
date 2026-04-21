const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const NOTIFICATION_MODULE = `package com.cashlens.app.notification

import android.content.Intent
import android.provider.Settings
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.os.Build
import android.util.Log

class NotificationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

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
        Log.d("NotificationModule", "Sending test notification: $title - $text")

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

        val params = Arguments.createMap().apply {
            putString("packageName", packageName)
            putString("title", title)
            putString("text", text)
            putString("subText", "")
            putDouble("postTime", System.currentTimeMillis().toDouble())
        }

        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onNotificationReceived", params)
    }

    @ReactMethod
    fun addListener(eventName: String) {
    }

    @ReactMethod
    fun removeListeners(count: Int) {
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

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.cashlens.app.MainApplication

class TransactionNotificationListener : NotificationListenerService() {

    private val TAG = "NotificationListener"

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
            Log.d(TAG, "Transaction Detected from \$packageName: \$text")

            val payload = Arguments.createMap().apply {
                putString("packageName", packageName)
                putString("title", title)
                putString("text", text)
                putString("subText", subText)
                putDouble("postTime", sbn.postTime.toDouble())
            }

            sendEvent(payload)
        }
    }

    private fun sendEvent(params: WritableMap) {
        try {
            val reactContext = (application as MainApplication)
                .reactNativeHost
                .reactInstanceManager
                .currentReactContext

            if (reactContext != null) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onNotificationReceived", params)
                Log.d(TAG, "Event emitted to React Native successfully")
            } else {
                Log.e(TAG, "ReactContext is null, cannot emit event")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error emitting event: \${e.message}")
        }
    }
}
`;

const withNotificationListener = (config) => {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const base = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/java/com/cashlens/app"
      );

      const notificationDir = path.join(base, "notification");
      const servicesDir = path.join(base, "services");

      fs.mkdirSync(notificationDir, { recursive: true });
      fs.mkdirSync(servicesDir, { recursive: true });

      fs.writeFileSync(
        path.join(notificationDir, "NotificationModule.kt"),
        NOTIFICATION_MODULE
      );
      fs.writeFileSync(
        path.join(notificationDir, "NotificationPackage.kt"),
        NOTIFICATION_PACKAGE
      );
      fs.writeFileSync(
        path.join(servicesDir, "TransactionNotificationListener.kt"),
        TRANSACTION_NOTIFICATION_LISTENER
      );

      return config;
    },
  ]);
};

module.exports = withNotificationListener;
