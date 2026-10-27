package com.smartkisan.app

import android.app.Application
import com.smartkisan.app.data.db.DatabaseRepository

class SmartKisanApplication : Application() {

    lateinit var repository: DatabaseRepository
        private set

    override fun onCreate() {
        super.onCreate()
        repository = DatabaseRepository(this)
    }
}
