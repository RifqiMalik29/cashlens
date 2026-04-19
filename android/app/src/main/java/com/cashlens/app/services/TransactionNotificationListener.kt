package com.cashlens.app.services

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
            Log.d(TAG, "Transaction Detected from $packageName: $text")

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
            Log.e(TAG, "Error emitting event: ${e.message}")
        }
    }
}
