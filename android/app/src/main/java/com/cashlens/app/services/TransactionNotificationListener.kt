package com.cashlens.app.services

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
            Log.d(TAG, "Transaction Detected from $packageName: $text")

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
