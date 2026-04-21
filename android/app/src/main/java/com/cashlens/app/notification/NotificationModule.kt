package com.cashlens.app.notification

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
        Log.d(TAG, "Sending test notification: $title - $text")

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
